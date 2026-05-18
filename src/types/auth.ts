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

export type Role = "admin" | "manager" | "cashier" | "kitchen";

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
  | "dashboard.view";

/**
 * The shape any UI surface needs to render a user. Never includes
 * `passwordHash` — server queries strip it before serialising.
 */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
};

/**
 * What's actually stored in the session cookie. Role is embedded so
 * the edge proxy can authorise without a DB round-trip.
 */
export type SessionCookie = {
  userId: string;
  role: Role;
  issuedAt: number;
};

export type Session = {
  user: SessionUser;
  issuedAt: number;
};
