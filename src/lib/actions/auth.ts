"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  serializeSession,
} from "@/lib/session";
import type { Role, SessionUser } from "@/types/auth";

export type AuthActionResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

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

  const user = await prisma.user.findUnique({
    where: { email: trimmed },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      passwordHash: true,
    },
  });
  if (!user) return { ok: false, error: "Invalid email or password" };

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return { ok: false, error: "Invalid email or password" };

  await writeSessionCookie(user.id, user.role);

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
}

/**
 * Demo-mode sign-in by id. Skips password verification so the demo
 * role-picker on the login screen stays one-click — only safe because
 * this build is explicitly a demo. Gate or remove for production.
 */
export async function demoSignInAction(userId: string): Promise<AuthActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
  if (!user) return { ok: false, error: "User not found" };

  await writeSessionCookie(user.id, user.role);
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

  const existing = await prisma.user.count();
  if (existing > 0) {
    return {
      ok: false,
      error: "A workspace already exists. Sign in or run `npm run db:wipe` to reset.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "admin" },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });

  await writeSessionCookie(user.id, user.role);
  return { ok: true, user };
}

async function writeSessionCookie(userId: string, role: Role) {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: serializeSession(userId, role),
    httpOnly: false, // client store reads it on hydration for demo UX
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}
