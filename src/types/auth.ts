/**
 * Roles & permissions.
 *
 * Permissions are strings (e.g. "orders.refund") so they can be
 * checked anywhere — middleware, server components, client hooks —
 * without dragging in the full role mapping.
 *
 * Persisted users live in the `User` table; the auth flow hashes
 * passwords with bcrypt (see `src/lib/actions/auth.ts`).
 */

/**
 * Role slug. Used to be a closed union; now a free-form string because
 * custom roles can be added from Settings → Roles. The four built-ins
 * (admin / manager / cashier / kitchen) are always present — see
 * `BUILT_IN_ROLES` in `src/lib/roles-seed.ts`.
 */
export type Role = string;

/** Slugs of the four roles that are seeded on every boot. Useful
 * when code genuinely needs to compare against a built-in (e.g.
 * "is this user an admin?"). New roles never share these slugs. */
export type BuiltInRole = "admin" | "manager" | "cashier" | "kitchen";

export type Permission =
  | "pos.access"
  | "orders.view"
  | "orders.refund"
  | "orders.cancel"
  | "inventory.view"
  | "inventory.edit"
  | "menu.view"
  | "menu.edit"
  | "reports.view"
  | "staff.view"
  | "staff.edit"
  | "settings.view"
  | "settings.edit"
  | "kitchen.view"
  | "dashboard.view"
  | "expenses.view"
  | "expenses.edit";

/**
 * The shape any UI surface needs to render a user. Never includes
 * `passwordHash` — server queries strip it before serialising.
 */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  /** Display name of the role (e.g. "Administrator", "Head chef"). */
  roleName?: string;
  /** Denormalized permission slugs from the user's role. Keep this
   * field populated on every server query that surfaces a SessionUser
   * so client-side `hasPermission(user, …)` calls always work. */
  permissions?: Permission[];
  avatar?: string | null;
  defaultRoute?: string | null;
  monthlySalary?: number | null;
};

/**
 * What's actually stored in the session cookie. Role is embedded so
 * the edge proxy can authorise without a DB round-trip.
 */
export type SessionCookie = {
  userId: string;
  role: Role;
  /** Permission slugs granted to the user via their role. Embedded
   * so the edge proxy + client-side components can authorise without
   * a DB round-trip. Refreshed on each sign-in and on profile/role
   * edits. */
  permissions: Permission[];
  /** Optional per-user landing route; the proxy reads this when
   * redirecting "/" so the user lands on their preferred page. */
  defaultRoute?: string;
  issuedAt: number;
};

export type Session = {
  user: SessionUser;
  issuedAt: number;
};
