"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { supabase } from "@/lib/supabase";
import { ensureBuiltInRoles } from "@/lib/roles-seed";
import { SESSION_COOKIE, SESSION_MAX_AGE, serializeSession } from "@/lib/session";
import type { Permission, SessionUser } from "@/types/auth";

export type AuthActionResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

type RoleShape = { name: string; permissions: unknown; defaultRoute: string | null };
type UserWithRole = {
  id: string; name: string; email: string; phone: string | null;
  role: string; passwordHash: string; avatar: string | null;
  defaultRoute: string | null; monthlySalary: number | null;
  Role: RoleShape | RoleShape[] | null;
};

async function fetchUserWithRole(field: "id" | "email", value: string): Promise<UserWithRole | null> {
  const { data, error } = await supabase
    .from("User")
    .select("id, name, email, phone, role, passwordHash, avatar, defaultRoute, monthlySalary, Role(name, permissions, defaultRoute)")
    .eq(field, value)
    .single();
  if (error || !data) return null;
  return data as unknown as UserWithRole;
}

function toSessionUser(row: UserWithRole): SessionUser {
  const roleData = Array.isArray(row.Role) ? row.Role[0] : row.Role;
  const permissions = Array.isArray(roleData?.permissions)
    ? (roleData.permissions as Permission[])
    : [];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    roleName: roleData?.name,
    permissions,
    avatar: row.avatar,
    defaultRoute: row.defaultRoute ?? roleData?.defaultRoute ?? null,
    monthlySalary: row.monthlySalary != null ? Number(row.monthlySalary) : null,
  };
}

export async function signInAction(email: string, password: string): Promise<AuthActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !password) return { ok: false, error: "Email and password are required" };

  const row = await fetchUserWithRole("email", trimmed);
  if (!row) return { ok: false, error: "Invalid email or password" };

  const matches = await bcrypt.compare(password, row.passwordHash);
  if (!matches) return { ok: false, error: "Invalid email or password" };

  const user = toSessionUser(row);
  await writeSessionCookie(user);
  return { ok: true, user };
}

export async function demoSignInAction(userId: string): Promise<AuthActionResult> {
  const row = await fetchUserWithRole("id", userId);
  if (!row) return { ok: false, error: "User not found" };
  const user = toSessionUser(row);
  await writeSessionCookie(user);
  return { ok: true, user };
}

export async function signOutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export type OnboardingInput = {
  ownerName: string;
  ownerEmail: string;
  password: string;
  cafeName?: string;
  city?: string;
};

export async function completeOnboardingAction(input: OnboardingInput): Promise<AuthActionResult> {
  const name = input.ownerName.trim();
  const email = input.ownerEmail.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) return { ok: false, error: "Owner name is required" };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Owner email looks invalid" };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };

  await ensureBuiltInRoles();

  const { count } = await supabase.from("User").select("*", { count: "exact", head: true });
  if (count && count > 0) {
    return { ok: false, error: "A workspace already exists. Sign in or wipe the database to reset." };
  }

  const cafeName = input.cafeName?.trim();
  const city = input.city?.trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("Workspace") as any).upsert({
    id: "default",
    name: cafeName && cafeName.length >= 2 ? cafeName : "My café",
    city: city || null,
  }, { onConflict: "id" });

  const passwordHash = await bcrypt.hash(password, 10);
  const { data: created, error } = await supabase
    .from("User")
    .insert({ name, email, passwordHash, role: "admin" })
    .select("id")
    .single();

  if (error || !created) return { ok: false, error: error?.message ?? "Failed to create user" };

  const row = await fetchUserWithRole("id", created.id);
  if (!row) return { ok: false, error: "Failed to load created user" };

  const user = toSessionUser(row);
  await writeSessionCookie(user);
  return { ok: true, user };
}

export async function writeSessionCookie(user: SessionUser) {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: serializeSession(user.id, user.role, user.permissions ?? [], user.defaultRoute),
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: shouldUseSecureCookies(),
  });
}

function shouldUseSecureCookies(): boolean {
  if (process.env.BREWLINE_INSECURE_COOKIES === "1") return false;
  return process.env.NODE_ENV === "production";
}
