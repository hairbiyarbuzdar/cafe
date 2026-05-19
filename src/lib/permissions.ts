import type { Permission, SessionUser } from "@/types/auth";

/**
 * Permission checks.
 *
 * Roles are now DB-backed (see `src/lib/roles-seed.ts`) so we can no
 * longer answer "does role X have permission Y?" without a database
 * round-trip. Instead, the user's permission set is denormalized onto
 * `SessionUser.permissions` (and into the session cookie) and we
 * check against that array everywhere — server components, server
 * actions, the proxy, and client components.
 */

type Subject =
  | Pick<SessionUser, "permissions">
  | { permissions?: Permission[] }
  | null
  | undefined;

export function hasPermission(
  subject: Subject,
  permission: Permission,
): boolean {
  const perms = subject?.permissions;
  if (!perms || perms.length === 0) return false;
  return perms.includes(permission);
}

export function hasAnyPermission(
  subject: Subject,
  permissions: Permission[],
): boolean {
  const perms = subject?.permissions;
  if (!perms || perms.length === 0) return false;
  return permissions.some((p) => perms.includes(p));
}

/**
 * Default landing routes per built-in role. Custom roles set their
 * own `defaultRoute` in the DB and a user's personal `defaultRoute`
 * always wins via `homeFor()`.
 */
export const ROLE_HOME: Record<string, string> = {
  admin: "/pos",
  manager: "/pos",
  cashier: "/pos",
  kitchen: "/kitchen",
};

/**
 * Resolves the landing route for a given user: their personal
 * `defaultRoute` first, then the role-level default they're a member
 * of, then `/pos` as the universal fallback.
 */
export function homeFor(
  user: Pick<SessionUser, "role" | "defaultRoute">,
): string {
  const personal = user.defaultRoute?.trim();
  if (personal) return personal;
  return ROLE_HOME[user.role] ?? "/pos";
}

/**
 * Default display label for the four built-in roles. Custom roles
 * source their label from `Role.name` in the DB — surface that via
 * `SessionUser.roleName` whenever possible. This map is a fallback
 * for legacy code paths that still pass a raw role slug around.
 */
export const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  cashier: "Cashier",
  kitchen: "Kitchen staff",
};

export function roleLabel(slug: string, fallback?: string): string {
  return ROLE_LABEL[slug] ?? fallback ?? slug;
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
