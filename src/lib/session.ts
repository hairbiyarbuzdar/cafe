/**
 * Client- and edge-safe session helpers.
 *
 * Keep this file free of `next/headers` and DB code so it can be
 * imported by the proxy (edge runtime) and the client store. The
 * cookie carries enough to authorise (`userId` + `role`); the full
 * user record is resolved server-side via Prisma — see `lib/auth.ts`.
 */

import type { Role, SessionCookie } from "@/types/auth";

export const SESSION_COOKIE = "brewline_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const ROLES: Role[] = ["admin", "manager", "cashier", "kitchen"];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

export function parseSession(raw: string | undefined | null): SessionCookie | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<SessionCookie>;
    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      !isRole(parsed.role)
    ) {
      return null;
    }
    return { userId: parsed.userId, role: parsed.role, issuedAt: parsed.issuedAt };
  } catch {
    return null;
  }
}

export function serializeSession(userId: string, role: Role): string {
  return encodeURIComponent(
    JSON.stringify({ userId, role, issuedAt: Date.now() } satisfies SessionCookie),
  );
}
