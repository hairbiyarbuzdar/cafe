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
