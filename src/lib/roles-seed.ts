import "server-only";

import { supabase } from "@/lib/supabase";
import type { Permission } from "@/types/auth";

const ALL_PERMISSIONS: Permission[] = [
  "pos.access", "orders.view", "orders.refund", "orders.cancel",
  "inventory.view", "inventory.edit", "menu.view", "menu.edit",
  "reports.view", "staff.view", "staff.edit", "settings.view", "settings.edit",
  "kitchen.view", "dashboard.view", "expenses.view", "expenses.edit",
];

export const BUILT_IN_ROLES = [
  { id: "admin",    name: "Administrator",  isSystem: true, defaultRoute: "/pos",     description: "Full access — manages workspace, team, and configuration.", permissions: ALL_PERMISSIONS },
  { id: "manager",  name: "Manager",        isSystem: true, defaultRoute: "/pos",     description: "Day-to-day operations: POS, menu, inventory, reports, view team.", permissions: ["dashboard.view","pos.access","orders.view","orders.refund","orders.cancel","inventory.view","inventory.edit","menu.view","menu.edit","reports.view","staff.view","expenses.view","expenses.edit"] as Permission[] },
  { id: "cashier",  name: "Cashier",        isSystem: true, defaultRoute: "/pos",     description: "POS-only access for front-of-house staff.", permissions: ["pos.access","orders.view"] as Permission[] },
  { id: "kitchen",  name: "Kitchen staff",  isSystem: true, defaultRoute: "/kitchen", description: "Kitchen display + read-only inventory and orders.", permissions: ["kitchen.view","orders.view","inventory.view"] as Permission[] },
  { id: "waiter",   name: "Waiter",         isSystem: true, defaultRoute: null,       description: "Assigned to tables and dine-in orders. No app access.", permissions: [] as Permission[] },
  { id: "delivery", name: "Delivery",       isSystem: true, defaultRoute: null,       description: "Assigned to delivery orders as the rider. No app access.", permissions: [] as Permission[] },
];

export async function ensureBuiltInRoles(): Promise<void> {
  const { error } = await supabase.from("Role").upsert(
    BUILT_IN_ROLES.map((r) => ({
      id: r.id, name: r.name, description: r.description,
      permissions: r.permissions, isSystem: r.isSystem, defaultRoute: r.defaultRoute,
    })),
    { onConflict: "id" },
  );
  if (error) throw new Error(`ensureBuiltInRoles: ${error.message}`);
}
