"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { logActivity } from "@/lib/activity";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Permission, Role, SessionUser } from "@/types/auth";

async function isValidRoleSlug(slug: string): Promise<boolean> {
  if (!slug) return false;
  const { data } = await supabase.from("Role").select("id").eq("id", slug).maybeSingle();
  return !!data;
}

export type CreatePendingMemberInput = { name: string; email: string; phone?: string | null };
export type CreatePendingMemberResult = { ok: true; id: string } | { ok: false; error: string };

export async function createPendingMemberAction(
  input: CreatePendingMemberInput,
): Promise<CreatePendingMemberResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim() || null;
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Enter a valid email" };
  if (phone && phone.length > 32) return { ok: false, error: "Phone is too long" };

  const [{ data: user }, { data: pending }] = await Promise.all([
    supabase.from("User").select("id").eq("email", email).maybeSingle(),
    supabase.from("PendingMember").select("id").eq("email", email).maybeSingle(),
  ]);
  if (user) return { ok: false, error: `${email} is already on the team` };
  if (pending) return { ok: false, error: `${email} is already pending invite` };

  try {
    const { data: created, error } = await supabase.from("PendingMember").insert({ name, email, phone }).select("id").single();
    if (error) throw error;
    revalidatePath("/staff");
    revalidatePath("/settings");
    await logActivity({ type: "staff", title: `${name} added to staff`, description: `${email} · awaiting invite` });
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createPendingMemberAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to add member" };
  }
}

export type InvitePendingMemberInput = { pendingId: string; role: Role; password: string };
export type InvitePendingMemberResult = { ok: true; user: SessionUser } | { ok: false; error: string };

export async function invitePendingMemberAction(
  input: InvitePendingMemberInput,
): Promise<InvitePendingMemberResult> {
  if (!input.pendingId) return { ok: false, error: "Pick a member to invite" };
  if (!(await isValidRoleSlug(input.role))) return { ok: false, error: "Invalid role" };
  if (!input.password || input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };

  const { data: pending } = await supabase.from("PendingMember").select("*").eq("id", input.pendingId).maybeSingle();
  if (!pending) return { ok: false, error: "Member is no longer pending" };

  const { data: taken } = await supabase.from("User").select("id").eq("email", pending.email).maybeSingle();
  if (taken) {
    await supabase.from("PendingMember").delete().eq("id", pending.id);
    return { ok: false, error: `${pending.email} is already on the team` };
  }

  try {
    const { data: created, error } = await supabase.from("User").insert({
      name: pending.name, email: pending.email, phone: pending.phone,
      role: input.role, passwordHash: await bcrypt.hash(input.password, 10),
    }).select("id, name, email, phone, role, avatar, defaultRoute, monthlySalary, Role(name, permissions, defaultRoute)").single();
    if (error) throw error;

    await supabase.from("PendingMember").delete().eq("id", pending.id);

    revalidatePath("/settings");
    revalidatePath("/staff");
    revalidatePath("/login");

    await logActivity({ type: "staff", title: `${created.name} joined the team`, description: `${created.role} · ${created.email}` });

    const roleData = (Array.isArray(created.Role) ? created.Role[0] : created.Role) as { name: string; permissions: unknown; defaultRoute: string | null } | null;

    return {
      ok: true,
      user: {
        id: created.id, name: created.name, email: created.email, phone: created.phone,
        role: created.role, roleName: roleData?.name,
        permissions: Array.isArray(roleData?.permissions) ? (roleData.permissions as Permission[]) : [],
        avatar: created.avatar,
        defaultRoute: created.defaultRoute ?? roleData?.defaultRoute ?? null,
        monthlySalary: created.monthlySalary ? Number(created.monthlySalary) : null,
      },
    };
  } catch (err) {
    console.error("invitePendingMemberAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to invite member" };
  }
}

export type UpdateUserRoleResult = { ok: true } | { ok: false; error: string };

export async function updateUserRoleAction(userId: string, role: Role): Promise<UpdateUserRoleResult> {
  if (!(await isValidRoleSlug(role))) return { ok: false, error: "Invalid role" };
  const { data: target } = await supabase.from("User").select("id, role").eq("id", userId).maybeSingle();
  if (!target) return { ok: false, error: "User not found" };
  if (target.role === role) return { ok: true };

  if (target.role === "admin" && role !== "admin") {
    const { count } = await supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return { ok: false, error: "Can't demote the last admin" };
  }

  try {
    const { error } = await supabase.from("User").update({ role }).eq("id", userId);
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true };
  } catch (err) {
    console.error("updateUserRoleAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update role" };
  }
}

export type UpdateMemberInput = {
  id: string; type: "user" | "pending"; name: string; email: string; phone?: string | null; monthlySalary?: number | null;
};
export type UpdateMemberResult = { ok: true } | { ok: false; error: string };

export async function updateMemberAction(input: UpdateMemberInput): Promise<UpdateMemberResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim() || null;
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Enter a valid email" };
  if (phone && phone.length > 32) return { ok: false, error: "Phone is too long" };
  if (input.monthlySalary != null && (!Number.isFinite(input.monthlySalary) || input.monthlySalary < 0)) {
    return { ok: false, error: "Salary must be a positive number" };
  }

  const [{ data: otherUser }, { data: otherPending }] = await Promise.all([
    supabase.from("User").select("id").eq("email", email).maybeSingle(),
    supabase.from("PendingMember").select("id").eq("email", email).maybeSingle(),
  ]);
  if (otherUser && otherUser.id !== input.id) return { ok: false, error: `${email} is already taken` };
  if (otherPending && otherPending.id !== input.id) return { ok: false, error: `${email} is already taken` };

  try {
    if (input.type === "user") {
      const { error } = await supabase.from("User").update({ name, email, phone, monthlySalary: input.monthlySalary ?? null }).eq("id", input.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("PendingMember").update({ name, email, phone }).eq("id", input.id);
      if (error) throw error;
    }
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true };
  } catch (err) {
    console.error("updateMemberAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update member" };
  }
}

export type RemoveMemberResult = { ok: true } | { ok: false; error: string };

export async function removeMemberAction(id: string, type: "user" | "pending"): Promise<RemoveMemberResult> {
  if (!id) return { ok: false, error: "No member specified" };

  if (type === "pending") {
    try {
      await supabase.from("PendingMember").delete().eq("id", id);
      revalidatePath("/settings");
      revalidatePath("/staff");
      return { ok: true };
    } catch (err) {
      console.error("removeMemberAction(pending) failed", err);
      return { ok: false, error: "Couldn't remove draft" };
    }
  }

  const me = await getCurrentUser();
  if (me?.id === id) return { ok: false, error: "You can't remove yourself" };

  const { data: target } = await supabase.from("User").select("id, role").eq("id", id).maybeSingle();
  if (!target) return { ok: false, error: "User not found" };

  if (target.role === "admin") {
    const { count } = await supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return { ok: false, error: "Can't remove the last admin" };
  }

  try {
    await supabase.from("User").delete().eq("id", id);
    revalidatePath("/settings");
    revalidatePath("/staff");
    revalidatePath("/orders");
    return { ok: true };
  } catch (err) {
    console.error("removeMemberAction(user) failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to remove member" };
  }
}
