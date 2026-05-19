"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { logActivity } from "@/lib/activity";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Permission, Role, SessionUser } from "@/types/auth";

async function isValidRoleSlug(slug: string): Promise<boolean> {
  if (!slug) return false;
  const found = await prisma.role.findUnique({
    where: { id: slug },
    select: { id: true },
  });
  return !!found;
}

// ──────────────────────────────────────────────────────────────
// Pending members (drafts created from the Staff page)
// ──────────────────────────────────────────────────────────────

export type CreatePendingMemberInput = {
  name: string;
  email: string;
  phone?: string | null;
};

export type CreatePendingMemberResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Add a teammate without granting them access yet — they show up in
 * the Settings → Team invite dropdown so an admin can assign a role
 * and password later.
 */
export async function createPendingMemberAction(
  input: CreatePendingMemberInput,
): Promise<CreatePendingMemberResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim() || null;

  if (!name || name.length < 2) {
    return { ok: false, error: "Name is required" };
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Enter a valid email" };
  }
  if (phone && phone.length > 32) {
    return { ok: false, error: "Phone is too long" };
  }

  // Either a live user or a pending draft with this email is a conflict.
  const [user, pending] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    prisma.pendingMember.findUnique({ where: { email }, select: { id: true } }),
  ]);
  if (user) return { ok: false, error: `${email} is already on the team` };
  if (pending) return { ok: false, error: `${email} is already pending invite` };

  try {
    const created = await prisma.pendingMember.create({
      data: { name, email, phone },
      select: { id: true },
    });
    revalidatePath("/staff");
    revalidatePath("/settings");

    await logActivity({
      type: "staff",
      title: `${name} added to staff`,
      description: `${email} · awaiting invite`,
    });

    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createPendingMemberAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add member",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Invite — turn a pending member into a User
// ──────────────────────────────────────────────────────────────

export type InvitePendingMemberInput = {
  pendingId: string;
  role: Role;
  password: string;
};

export type InvitePendingMemberResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

export async function invitePendingMemberAction(
  input: InvitePendingMemberInput,
): Promise<InvitePendingMemberResult> {
  if (!input.pendingId) return { ok: false, error: "Pick a member to invite" };
  if (!(await isValidRoleSlug(input.role))) {
    return { ok: false, error: "Invalid role" };
  }
  if (!input.password || input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters" };
  }

  const pending = await prisma.pendingMember.findUnique({
    where: { id: input.pendingId },
  });
  if (!pending) return { ok: false, error: "Member is no longer pending" };

  // Race guard: someone might have created a User with that email
  // between Add Member and Invite. Bail rather than create a duplicate.
  const taken = await prisma.user.findUnique({
    where: { email: pending.email },
    select: { id: true },
  });
  if (taken) {
    await prisma.pendingMember.delete({ where: { id: pending.id } });
    return { ok: false, error: `${pending.email} is already on the team` };
  }

  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: pending.name,
          email: pending.email,
          phone: pending.phone,
          role: input.role,
          passwordHash: await bcrypt.hash(input.password, 10),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          defaultRoute: true,
          monthlySalary: true,
          roleRef: {
            select: { name: true, permissions: true, defaultRoute: true },
          },
        },
      });
      await tx.pendingMember.delete({ where: { id: pending.id } });
      return created;
    });

    revalidatePath("/settings");
    revalidatePath("/staff");
    revalidatePath("/login");

    await logActivity({
      type: "staff",
      title: `${user.name} joined the team`,
      description: `${user.role} · ${user.email}`,
    });

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roleName: user.roleRef?.name,
        permissions: Array.isArray(user.roleRef?.permissions)
          ? (user.roleRef.permissions as Permission[])
          : [],
        avatar: user.avatar,
        defaultRoute: user.defaultRoute ?? user.roleRef?.defaultRoute ?? null,
        monthlySalary: user.monthlySalary ? Number(user.monthlySalary) : null,
      },
    };
  } catch (err) {
    console.error("invitePendingMemberAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to invite member",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Existing-user mutations
// ──────────────────────────────────────────────────────────────

export type UpdateUserRoleResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Change a single user's role. Self-edits and demoting the last
 * remaining admin are both blocked so the workspace can never end up
 * unmanageable.
 */
export async function updateUserRoleAction(
  userId: string,
  role: Role,
): Promise<UpdateUserRoleResult> {
  if (!(await isValidRoleSlug(role))) {
    return { ok: false, error: "Invalid role" };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return { ok: false, error: "User not found" };
  if (target.role === role) return { ok: true };

  if (target.role === "admin" && role !== "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return { ok: false, error: "Can't demote the last admin" };
    }
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true };
  } catch (err) {
    console.error("updateUserRoleAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update role",
    };
  }
}

export type UpdateMemberInput = {
  id: string;
  type: "user" | "pending";
  name: string;
  email: string;
  phone?: string | null;
  /** Only honored when type === "user". Null clears the salary. */
  monthlySalary?: number | null;
};

export type UpdateMemberResult =
  | { ok: true }
  | { ok: false; error: string };

/** Patch name / email / phone (and salary for live users) on either
 * a live user or a pending draft. */
export async function updateMemberAction(
  input: UpdateMemberInput,
): Promise<UpdateMemberResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim() || null;
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Enter a valid email" };
  }
  if (phone && phone.length > 32) {
    return { ok: false, error: "Phone is too long" };
  }
  if (
    input.monthlySalary != null &&
    (!Number.isFinite(input.monthlySalary) || input.monthlySalary < 0)
  ) {
    return { ok: false, error: "Salary must be a positive number" };
  }

  // Reject if the new email collides with anyone else (user or draft).
  const [otherUser, otherPending] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    prisma.pendingMember.findUnique({ where: { email }, select: { id: true } }),
  ]);
  if (otherUser && otherUser.id !== input.id) {
    return { ok: false, error: `${email} is already taken` };
  }
  if (otherPending && otherPending.id !== input.id) {
    return { ok: false, error: `${email} is already taken` };
  }

  try {
    if (input.type === "user") {
      await prisma.user.update({
        where: { id: input.id },
        data: {
          name,
          email,
          phone,
          monthlySalary: input.monthlySalary ?? null,
        },
      });
    } else {
      await prisma.pendingMember.update({
        where: { id: input.id },
        data: { name, email, phone },
      });
    }
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true };
  } catch (err) {
    console.error("updateMemberAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update member",
    };
  }
}

export type RemoveMemberResult = { ok: true } | { ok: false; error: string };

/**
 * Remove a teammate. Self-deletion and removing the last admin are
 * blocked; orders that referenced the user fall back to staffId=null
 * so historical totals stay correct.
 */
export async function removeMemberAction(
  id: string,
  type: "user" | "pending",
): Promise<RemoveMemberResult> {
  if (!id) return { ok: false, error: "No member specified" };

  if (type === "pending") {
    try {
      await prisma.pendingMember.delete({ where: { id } });
      revalidatePath("/settings");
      revalidatePath("/staff");
      return { ok: true };
    } catch (err) {
      console.error("removeMemberAction(pending) failed", err);
      return { ok: false, error: "Couldn't remove draft" };
    }
  }

  const me = await getCurrentUser();
  if (me?.id === id) {
    return { ok: false, error: "You can't remove yourself" };
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!target) return { ok: false, error: "User not found" };

  if (target.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return { ok: false, error: "Can't remove the last admin" };
    }
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/settings");
    revalidatePath("/staff");
    revalidatePath("/orders");
    return { ok: true };
  } catch (err) {
    console.error("removeMemberAction(user) failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to remove member",
    };
  }
}
