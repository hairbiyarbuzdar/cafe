import "server-only";

import { cookies } from "next/headers";

import { supabase } from "@/lib/supabase";
import { SESSION_COOKIE, parseSession } from "@/lib/session";
import type { Permission, Session, SessionCookie, SessionUser } from "@/types/auth";

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

export async function loadSessionUser(userId: string): Promise<SessionUser | null> {
  const { data, error } = await supabase
    .from("User")
    .select("id, name, email, phone, role, avatar, defaultRoute, monthlySalary, Role(name, permissions, defaultRoute)")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const roleData = Array.isArray(data.Role) ? data.Role[0] : data.Role;
  const permissions = Array.isArray(roleData?.permissions)
    ? (roleData.permissions as Permission[])
    : [];

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    roleName: roleData?.name,
    permissions,
    avatar: data.avatar,
    defaultRoute: data.defaultRoute ?? roleData?.defaultRoute ?? null,
    monthlySalary: data.monthlySalary != null ? Number(data.monthlySalary) : null,
  };
}
