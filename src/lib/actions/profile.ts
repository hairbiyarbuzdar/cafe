"use server";

import { revalidatePath } from "next/cache";

import { writeSessionCookie } from "@/lib/actions/auth";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Permission, SessionUser } from "@/types/auth";

export type UpdateProfileResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

const ALLOWED_ROUTES = new Set([
  "/pos",
  "/dashboard",
  "/orders",
  "/kitchen",
  "/menu",
  "/inventory",
  "/reports",
  "/staff",
  "/settings",
]);

/**
 * Self-service profile edit. Updates the *currently signed-in*
 * user's name, phone, and landing route. The route allowlist keeps
 * malformed values out of the session cookie. `defaultRoute === ""`
 * clears the override and reverts to ROLE_HOME[role].
 */
export async function updateProfileAction(input: {
  name: string;
  phone: string | null;
  defaultRoute: string | null;
}): Promise<UpdateProfileResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: "Not signed in" };

  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Name must be 2–80 characters" };
  }

  const phone = input.phone?.trim() || null;
  if (phone && phone.length > 32) {
    return { ok: false, error: "Phone is too long" };
  }

  const defaultRoute: string | null = input.defaultRoute?.trim() || null;
  if (defaultRoute && !ALLOWED_ROUTES.has(defaultRoute)) {
    return { ok: false, error: "That landing route isn't available" };
  }

  const row = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, defaultRoute },
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

  const user: SessionUser = {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    roleName: row.roleRef?.name,
    permissions: Array.isArray(row.roleRef?.permissions)
      ? (row.roleRef.permissions as Permission[])
      : [],
    avatar: row.avatar,
    defaultRoute: row.defaultRoute ?? row.roleRef?.defaultRoute ?? null,
    monthlySalary: row.monthlySalary ? Number(row.monthlySalary) : null,
  };

  // Re-issue the session cookie so the proxy picks up the new
  // landing route on the next "/" hit without forcing a re-login.
  await writeSessionCookie(user);

  revalidatePath("/", "layout");
  return { ok: true, user };
}
