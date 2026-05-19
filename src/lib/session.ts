/**
 * Client- and edge-safe session helpers.
 *
 * Keep this file free of `next/headers` and DB code so it can be
 * imported by the proxy (edge runtime) and the client store. The
 * cookie carries enough to authorise (`userId` + `role`); the full
 * user record is resolved server-side via Prisma — see `lib/auth.ts`.
 */

import type { Permission, Role, SessionCookie } from "@/types/auth";

export const SESSION_COOKIE = "brewline_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function parseSession(raw: string | undefined | null): SessionCookie | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<SessionCookie>;
    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.role !== "string" ||
      parsed.role.length === 0
    ) {
      return null;
    }
    const permissions: Permission[] = Array.isArray(parsed.permissions)
      ? (parsed.permissions.filter((p) => typeof p === "string") as Permission[])
      : [];
    return {
      userId: parsed.userId,
      role: parsed.role,
      permissions,
      defaultRoute:
        typeof parsed.defaultRoute === "string" && parsed.defaultRoute
          ? parsed.defaultRoute
          : undefined,
      issuedAt: parsed.issuedAt,
    };
  } catch {
    return null;
  }
}

export function serializeSession(
  userId: string,
  role: Role,
  permissions: Permission[],
  defaultRoute?: string | null,
): string {
  return encodeURIComponent(
    JSON.stringify({
      userId,
      role,
      permissions,
      defaultRoute: defaultRoute ?? undefined,
      issuedAt: Date.now(),
    } satisfies SessionCookie),
  );
}
