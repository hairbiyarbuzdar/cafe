import "server-only";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, parseSession } from "@/lib/session";
import type { Session, SessionCookie, SessionUser } from "@/types/auth";

/**
 * Server-side current user. The cookie carries `{userId, role}`; we
 * still re-fetch from the DB so a deleted/role-changed user is caught
 * immediately rather than at the cookie's 7-day expiry.
 */
export async function getServerSession(): Promise<Session | null> {
  const cookie = await readSessionCookie();
  if (!cookie) return null;
  const user = await loadSessionUser(cookie.userId);
  if (!user) return null;
  return { user, issuedAt: cookie.issuedAt };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

async function readSessionCookie(): Promise<SessionCookie | null> {
  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

async function loadSessionUser(userId: string): Promise<SessionUser | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
  return row ?? null;
}
