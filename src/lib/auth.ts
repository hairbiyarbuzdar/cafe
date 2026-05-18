import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE, parseSession } from "@/lib/session";
import type { Session, SessionUser } from "@/types/auth";

/**
 * Server-side current user. Reads the session cookie set by the
 * client-side auth store and resolves it against MOCK_USERS.
 *
 * In Phase 3 this is the only place that needs to change — swap the
 * mock lookup for a DB session table.
 */
export async function getServerSession(): Promise<Session | null> {
  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}
