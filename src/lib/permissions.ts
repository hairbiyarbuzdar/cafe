import type { Permission, Role, SessionUser } from "@/types/auth";

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
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL_PERMISSIONS,
  manager: [
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
  ],
  cashier: ["pos.access", "orders.view"],
  kitchen: ["kitchen.view", "orders.view", "inventory.view"],
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  manager: "Manager",
  cashier: "Cashier",
  kitchen: "Kitchen staff",
};

/** Where each role lands by default after signing in. */
export const ROLE_HOME: Record<Role, string> = {
  admin: "/dashboard",
  manager: "/dashboard",
  cashier: "/pos",
  kitchen: "/kitchen",
};

export function hasPermission(
  user: Pick<SessionUser, "role"> | null | undefined,
  permission: Permission,
): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(permission);
}

export function hasAnyPermission(
  user: Pick<SessionUser, "role"> | null | undefined,
  permissions: Permission[],
): boolean {
  if (!user) return false;
  const granted = ROLE_PERMISSIONS[user.role];
  return permissions.some((p) => granted.includes(p));
}

/**
 * Route guard — maps URL prefixes to the permission required to view them.
 * Order matters: longest prefix should be checked first.
 */
const ROUTE_GUARDS: { prefix: string; permission: Permission }[] = [
  { prefix: "/dashboard", permission: "dashboard.view" },
  { prefix: "/pos", permission: "pos.access" },
  { prefix: "/orders", permission: "orders.view" },
  { prefix: "/menu", permission: "menu.view" },
  { prefix: "/inventory", permission: "inventory.view" },
  { prefix: "/reports", permission: "reports.view" },
  { prefix: "/staff", permission: "staff.view" },
  { prefix: "/settings", permission: "settings.view" },
  { prefix: "/kitchen", permission: "kitchen.view" },
];

export function routePermission(pathname: string): Permission | null {
  const match = ROUTE_GUARDS.find((g) => pathname.startsWith(g.prefix));
  return match?.permission ?? null;
}
