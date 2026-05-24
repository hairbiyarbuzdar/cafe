"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import { ensureBuiltInRoles } from "@/lib/roles-seed";
import type { Permission } from "@/types/auth";

export type RoleActionResult<T = { id: string }> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const ALL_PERMISSIONS: ReadonlySet<Permission> = new Set([
  "pos.access", "orders.view", "orders.refund", "orders.cancel",
  "inventory.view", "inventory.edit", "menu.view", "menu.edit",
  "reports.view", "staff.view", "staff.edit", "settings.view", "settings.edit",
  "kitchen.view", "dashboard.view", "expenses.view", "expenses.edit",
]);

const ALLOWED_DEFAULT_ROUTES = new Set([
  "/pos", "/dashboard", "/orders", "/kitchen", "/menu",
  "/inventory", "/reports", "/expenses", "/staff", "/settings",
]);

function slugify(value: string): string {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function sanitisePermissions(input: unknown): Permission[] {
  if (!Array.isArray(input)) return [];
  const out = new Set<Permission>();
  for (const v of input) {
    if (typeof v === "string" && ALL_PERMISSIONS.has(v as Permission)) out.add(v as Permission);
  }
  return Array.from(out);
}

export type CreateRoleInput = {
  name: string;
  description?: string | null;
  permissions: Permission[];
  defaultRoute?: string | null;
};

export async function createRoleAction(
  input: CreateRoleInput,
): Promise<RoleActionResult> {
  await ensureBuiltInRoles();

  const name = input.name.trim();
  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: "Name must be 2–40 characters" };
  }
  const permissions = sanitisePermissions(input.permissions);
  if (permissions.length === 0) {
    return { ok: false, error: "Pick at least one permission" };
  }
  const defaultRoute = input.defaultRoute?.trim() || null;
  if (defaultRoute && !ALLOWED_DEFAULT_ROUTES.has(defaultRoute)) {
    return { ok: false, error: "That landing route isn't available" };
  }

  const base = slugify(name) || "role";
  let id = base;
  for (let i = 2; i < 50; i++) {
    const { data: exists } = await supabase.from("Role").select("id").eq("id", id).maybeSingle();
    if (!exists) break;
    id = `${base}-${i}`;
  }

  try {
    const { data: row, error } = await supabase
      .from("Role")
      .insert({ id, name, description: input.description?.trim() || null, permissions, isSystem: false, defaultRoute })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { id: row.id } };
  } catch (err) {
    console.error("createRoleAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create role" };
  }
}

export type UpdateRoleInput = {
  id: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
  defaultRoute?: string | null;
};

export async function updateRoleAction(
  input: UpdateRoleInput,
): Promise<RoleActionResult> {
  if (!input.id) return { ok: false, error: "No role specified" };

  const name = input.name.trim();
  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: "Name must be 2–40 characters" };
  }
  const permissions = sanitisePermissions(input.permissions);
  if (permissions.length === 0) {
    return { ok: false, error: "Pick at least one permission" };
  }
  const defaultRoute = input.defaultRoute?.trim() || null;
  if (defaultRoute && !ALLOWED_DEFAULT_ROUTES.has(defaultRoute)) {
    return { ok: false, error: "That landing route isn't available" };
  }

  const { data: existing } = await supabase.from("Role").select("id, isSystem").eq("id", input.id).maybeSingle();
  if (!existing) return { ok: false, error: "Role not found" };

  const finalPermissions = input.id === "admin" ? Array.from(ALL_PERMISSIONS) : permissions;

  try {
    const { error } = await supabase.from("Role").update({
      name, description: input.description?.trim() || null, permissions: finalPermissions, defaultRoute,
    }).eq("id", input.id);
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { id: input.id } };
  } catch (err) {
    console.error("updateRoleAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update role" };
  }
}

export async function deleteRoleAction(
  id: string,
): Promise<RoleActionResult<{ deleted: true }>> {
  if (!id) return { ok: false, error: "No role specified" };

  const { data: role } = await supabase.from("Role").select("id, isSystem").eq("id", id).maybeSingle();
  if (!role) return { ok: false, error: "Role not found" };
  if (role.isSystem) return { ok: false, error: "Built-in roles can't be deleted" };

  const { count } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .eq("role", id);
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `${count} member${count === 1 ? "" : "s"} still hold this role — reassign them first`,
    };
  }

  try {
    const { error } = await supabase.from("Role").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { deleted: true } };
  } catch (err) {
    console.error("deleteRoleAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete role" };
  }
}
