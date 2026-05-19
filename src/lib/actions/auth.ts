"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { ensureBuiltInRoles } from "@/lib/roles-seed";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  serializeSession,
} from "@/lib/session";
import type { Permission, Role, SessionUser } from "@/types/auth";

export type AuthActionResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  avatar: true,
  defaultRoute: true,
  monthlySalary: true,
  roleRef: {
    select: { name: true, permissions: true, defaultRoute: true },
  },
} as const;

type LoadedUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  defaultRoute: string | null;
  monthlySalary: { toNumber?: () => number } | null | string | number;
  roleRef: {
    name: string;
    permissions: unknown;
    defaultRoute: string | null;
  } | null;
};

function toSessionUser(row: LoadedUser): SessionUser {
  const permissions = Array.isArray(row.roleRef?.permissions)
    ? (row.roleRef.permissions as Permission[])
    : [];
  const monthlySalary =
    row.monthlySalary == null
      ? null
      : typeof row.monthlySalary === "object" && "toNumber" in row.monthlySalary
        ? row.monthlySalary.toNumber!()
        : Number(row.monthlySalary);
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    roleName: row.roleRef?.name,
    permissions,
    avatar: row.avatar,
    defaultRoute: row.defaultRoute ?? row.roleRef?.defaultRoute ?? null,
    monthlySalary,
  };
}

/**
 * Credential sign-in. Returns the public user record on success; the
 * caller (a client component) handles the redirect so it can also fire
 * a toast and refresh React Server Components.
 */
export async function signInAction(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  const row = await prisma.user.findUnique({
    where: { email: trimmed },
    select: { ...USER_SELECT, passwordHash: true },
  });
  if (!row) return { ok: false, error: "Invalid email or password" };

  const matches = await bcrypt.compare(password, row.passwordHash);
  if (!matches) return { ok: false, error: "Invalid email or password" };

  const user = toSessionUser(row);
  await writeSessionCookie(user);

  return { ok: true, user };
}

/**
 * Demo-mode sign-in by id. Skips password verification so the demo
 * role-picker on the login screen stays one-click — only safe because
 * this build is explicitly a demo. Gate or remove for production.
 */
export async function demoSignInAction(userId: string): Promise<AuthActionResult> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
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

/**
 * First-run setup. Refuses to run once any user exists so an
 * existing workspace can't be replaced by hitting /onboarding by
 * accident — re-run `npm run db:wipe` first if you really want to
 * start over. Always provisions the owner as admin.
 */
export async function completeOnboardingAction(
  input: OnboardingInput,
): Promise<AuthActionResult> {
  const name = input.ownerName.trim();
  const email = input.ownerEmail.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) return { ok: false, error: "Owner name is required" };
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Owner email looks invalid" };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters" };
  }

  // First touch of the workspace — make sure the built-in roles are
  // present so `User.role = "admin"` has a valid FK target.
  await ensureBuiltInRoles();

  const existing = await prisma.user.count();
  if (existing > 0) {
    return {
      ok: false,
      error: "A workspace already exists. Sign in or run `npm run db:wipe` to reset.",
    };
  }

  // Seed the singleton Workspace row from the onboarding form so the
  // sidebar/dashboard/settings panels show the operator's café name
  // and city immediately — instead of falling back to "My café".
  const cafeName = input.cafeName?.trim();
  const city = input.city?.trim();
  await prisma.workspace.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      name: cafeName && cafeName.length >= 2 ? cafeName : "My café",
      city: city || null,
    },
    update: {
      ...(cafeName && cafeName.length >= 2 ? { name: cafeName } : {}),
      ...(city ? { city } : {}),
    },
  });

  const passwordHash = await bcrypt.hash(password, 10);
  const row = await prisma.user.create({
    data: { name, email, passwordHash, role: "admin" },
    select: USER_SELECT,
  });

  const user = toSessionUser(row);
  await writeSessionCookie(user);
  return { ok: true, user };
}

export async function writeSessionCookie(user: SessionUser) {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: serializeSession(
      user.id,
      user.role,
      user.permissions ?? [],
      user.defaultRoute,
    ),
    httpOnly: false, // client store reads it on hydration for demo UX
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}
