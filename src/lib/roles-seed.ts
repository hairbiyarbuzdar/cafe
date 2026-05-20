import "server-only";

import { prisma } from "@/lib/prisma";
import type { Permission } from "@/types/auth";

/**
 * Built-in roles. Seeded on first boot (and on every onboarding
 * attempt) so users created from the UI always have a valid role
 * FK to point at. Custom roles live alongside these in the same
 * table.
 *
 * Slugs ("admin", "manager", …) are stable — keep them in sync with
 * anywhere code still hardcodes a role check (search the repo for
 * `=== "admin"` if you suspect drift). `isSystem: true` blocks
 * deletion + slug renames from the Roles Manager UI.
 */

const ALL_PERMISSIONS: Permission[] = [
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
];

type BuiltInRole = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  defaultRoute: string | null;
};

export const BUILT_IN_ROLES: BuiltInRole[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access — manages workspace, team, and configuration.",
    permissions: ALL_PERMISSIONS,
    defaultRoute: "/pos",
  },
  {
    id: "manager",
    name: "Manager",
    description:
      "Day-to-day operations: POS, menu, inventory, reports, view team.",
    permissions: [
      "dashboard.view",
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
      "expenses.view",
      "expenses.edit",
    ],
    defaultRoute: "/pos",
  },
  {
    id: "cashier",
    name: "Cashier",
    description: "POS-only access for front-of-house staff.",
    permissions: ["pos.access", "orders.view"],
    defaultRoute: "/pos",
  },
  {
    id: "kitchen",
    name: "Kitchen staff",
    description: "Kitchen display + read-only inventory and orders.",
    permissions: ["kitchen.view", "orders.view", "inventory.view"],
    defaultRoute: "/kitchen",
  },
  // Assignment-only roles: no app permissions. These exist so staff can
  // be tagged as a waiter (assigned to tables / dine-in orders) or a
  // delivery person (assigned to delivery orders). They aren't meant to
  // log in and operate the app.
  {
    id: "waiter",
    name: "Waiter",
    description: "Assigned to tables and dine-in orders. No app access.",
    permissions: [],
    defaultRoute: null,
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Assigned to delivery orders as the rider. No app access.",
    permissions: [],
    defaultRoute: null,
  },
];

/**
 * Idempotently upsert the four built-in roles. Called at the start
 * of completeOnboardingAction and whenever the Settings → Roles
 * page loads, so a fresh DB always has them. Existing custom roles
 * are left untouched.
 */
export async function ensureBuiltInRoles(): Promise<void> {
  for (const r of BUILT_IN_ROLES) {
    await prisma.role.upsert({
      where: { id: r.id },
      // System roles: keep permissions in sync with code on every
      // boot. If you customise an admin/manager/cashier/kitchen
      // permission via the UI, this WILL overwrite it — clone them
      // into a new custom role to keep edits.
      update: {
        name: r.name,
        description: r.description,
        permissions: r.permissions,
        isSystem: true,
        defaultRoute: r.defaultRoute,
      },
      create: {
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: r.permissions,
        isSystem: true,
        defaultRoute: r.defaultRoute,
      },
    });
  }
}
