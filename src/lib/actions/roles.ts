"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensureBuiltInRoles } from "@/lib/roles-seed";
import type { Permission } from "@/types/auth";

export type RoleActionResult<T = { id: string }> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const ALL_PERMISSIONS: ReadonlySet<Permission> = new Set([
  "pos.access",
  "orders.view",
  "orders.refund",
  "orders.cancel",
  "inventory.view",
  "inventory.edit",
  "menu.view",
  "menu.edit",
  "reports.view",
  "staff.view",
  "staff.edit",
  "settings.view",
  "settings.edit",
  "kitchen.view",
  "dashboard.view",
  "expenses.view",
  "expenses.edit",
]);

const ALLOWED_DEFAULT_ROUTES = new Set([
  "/pos",
  "/dashboard",
  "/orders",
  "/kitchen",
  "/menu",
  "/inventory",
  "/reports",
  "/expenses",
  "/staff",
  "/settings",
]);

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function sanitisePermissions(input: unknown): Permission[] {
  if (!Array.isArray(input)) return [];
  const out = new Set<Permission>();
  for (const v of input) {
    if (typeof v === "string" && ALL_PERMISSIONS.has(v as Permission)) {
      out.add(v as Permission);
    }
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
  // Make sure the built-in slugs ("admin", "manager", …) are taken
  // before generating any custom slug — keeps user-supplied "Admin"
  // from colliding with the built-in.
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
    const exists = await prisma.role.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) break;
    id = `${base}-${i}`;
  }

  try {
    const row = await prisma.role.create({
      data: {
        id,
        name,
        description: input.description?.trim() || null,
        permissions,
        isSystem: false,
        defaultRoute,
      },
      select: { id: true },
    });
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { id: row.id } };
  } catch (err) {
    console.error("createRoleAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create role",
    };
  }
}

export type UpdateRoleInput = {
  id: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
  defaultRoute?: string | null;
};

/**
 * Update a role's name, description, permissions, and default route.
 * Built-in roles can have their permissions adjusted but their slug
 * (id) is locked and their `isSystem` flag is preserved.
 */
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

  const existing = await prisma.role.findUnique({
    where: { id: input.id },
    select: { id: true, isSystem: true },
  });
  if (!existing) return { ok: false, error: "Role not found" };

  // Belt-and-suspenders: admin must always have full access. The UI
  // disables the checkboxes too, but the server is the last line of
  // defence against an admin role being neutered by accident.
  let finalPermissions = permissions;
  if (input.id === "admin") {
    finalPermissions = Array.from(ALL_PERMISSIONS);
  }

  try {
    await prisma.role.update({
      where: { id: input.id },
      data: {
        name,
        description: input.description?.trim() || null,
        permissions: finalPermissions,
        defaultRoute,
      },
    });
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { id: input.id } };
  } catch (err) {
    console.error("updateRoleAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update role",
    };
  }
}

export async function deleteRoleAction(
  id: string,
): Promise<RoleActionResult<{ deleted: true }>> {
  if (!id) return { ok: false, error: "No role specified" };

  const role = await prisma.role.findUnique({
    where: { id },
    select: { id: true, isSystem: true, _count: { select: { users: true } } },
  });
  if (!role) return { ok: false, error: "Role not found" };
  if (role.isSystem) {
    return { ok: false, error: "Built-in roles can't be deleted" };
  }
  if (role._count.users > 0) {
    return {
      ok: false,
      error: `${role._count.users} member${role._count.users === 1 ? "" : "s"} still hold this role — reassign them first`,
    };
  }

  try {
    await prisma.role.delete({ where: { id } });
    revalidatePath("/settings");
    revalidatePath("/staff");
    return { ok: true, data: { deleted: true } };
  } catch (err) {
    console.error("deleteRoleAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete role",
    };
  }
}
