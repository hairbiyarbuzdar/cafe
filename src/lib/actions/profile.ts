"use server";

import { revalidatePath } from "next/cache";

import { writeSessionCookie } from "@/lib/actions/auth";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Permission, SessionUser } from "@/types/auth";

export type UpdateProfileResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

const ALLOWED_ROUTES = new Set([
  "/pos", "/dashboard", "/orders", "/kitchen", "/menu",
  "/inventory", "/reports", "/staff", "/settings",
]);

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

  const { data: row, error } = await supabase
    .from("User")
    .update({ name, phone, defaultRoute })
    .eq("id", session.user.id)
    .select("id, name, email, phone, role, avatar, defaultRoute, monthlySalary, Role(name, permissions, defaultRoute)")
    .single();

  if (error || !row) {
    return { ok: false, error: error?.message ?? "Failed to update profile" };
  }

  const roleData = (Array.isArray(row.Role) ? row.Role[0] : row.Role) as {
    name: string; permissions: unknown; defaultRoute: string | null;
  } | null;

  const user: SessionUser = {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    roleName: roleData?.name,
    permissions: Array.isArray(roleData?.permissions)
      ? (roleData.permissions as Permission[])
      : [],
    avatar: row.avatar,
    defaultRoute: row.defaultRoute ?? roleData?.defaultRoute ?? null,
    monthlySalary: row.monthlySalary ? Number(row.monthlySalary) : null,
  };

  await writeSessionCookie(user);
  revalidatePath("/", "layout");
  return { ok: true, user };
}
