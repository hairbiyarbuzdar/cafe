/**
 * Client- and edge-safe session helpers.
 *
 * Keep this file free of `next/headers` so it can be imported by
 * the client Zustand store and the proxy (which runs on the edge).
 * Server-only helpers (cookie reading via React) live in `auth.ts`.
 */

import { findUserById } from "@/mock/users";
import type { Session } from "@/types/auth";

export const SESSION_COOKIE = "brewline_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function parseSession(raw: string | undefined | null): Session | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      userId: string;
      issuedAt: number;
    };
    const user = findUserById(parsed.userId);
    if (!user) return null;
    const { password: _password, ...safe } = user;
    void _password;
    return { user: safe, issuedAt: parsed.issuedAt };
  } catch {
    return null;
  }
}

export function serializeSession(userId: string): string {
  return encodeURIComponent(JSON.stringify({ userId, issuedAt: Date.now() }));
}
