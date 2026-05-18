import { NextResponse, type NextRequest } from "next/server";

import { parseSession, SESSION_COOKIE } from "@/lib/session";
import { hasPermission, ROLE_HOME, routePermission } from "@/lib/permissions";

const PUBLIC_PATHS = ["/login", "/onboarding", "/unauthorized"];

/**
 * Renamed from `middleware` in Next.js 16. Same shape — gates the
 * (app) route group on a session cookie and on per-route permissions.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = parseSession(sessionCookie);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[session.user.role];
    return NextResponse.redirect(url);
  }

  const permission = routePermission(pathname);
  if (permission && !hasPermission(session.user, permission)) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
