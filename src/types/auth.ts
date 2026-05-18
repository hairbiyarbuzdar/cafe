/**
 * Roles & permissions.
 *
 * Permissions are strings (e.g. "orders.refund") so they can be
 * checked anywhere — middleware, server components, client hooks —
 * without dragging in the full role mapping.
 *
 * Phase 3 will swap MOCK_USERS for a database, but the permission
 * matrix below remains the source of truth for what each role can do.
 */

export type Role = "admin" | "manager" | "cashier" | "kitchen";

export type Permission =
  | "pos.access"
  | "orders.view"
  | "orders.refund"
  | "orders.cancel"
  | "inventory.view"
  | "inventory.edit"
  | "reports.view"
  | "staff.view"
  | "staff.edit"
  | "settings.view"
  | "settings.edit"
  | "kitchen.view"
  | "dashboard.view";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Plaintext for the demo only — Phase 3 replaces this with hashed credentials in DB */
  password: string;
  avatar?: string;
};

export type SessionUser = Omit<AuthUser, "password">;

export type Session = {
  user: SessionUser;
  issuedAt: number;
};
