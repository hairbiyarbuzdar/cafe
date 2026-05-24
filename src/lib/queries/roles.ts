import "server-only";

import { supabase } from "@/lib/supabase";
import type { Permission } from "@/types/auth";

export type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  isSystem: boolean;
  defaultRoute: string | null;
  userCount: number;
};

export async function listRoles(): Promise<Role[]> {
  const [{ data: roles, error }, { data: users }] = await Promise.all([
    supabase.from("Role").select("*").order("isSystem", { ascending: false }).order("name"),
    supabase.from("User").select("role"),
  ]);
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const u of users ?? []) counts[u.role] = (counts[u.role] ?? 0) + 1;

  return (roles ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    permissions: Array.isArray(r.permissions) ? (r.permissions as Permission[]) : [],
    isSystem: r.isSystem,
    defaultRoute: r.defaultRoute,
    userCount: counts[r.id] ?? 0,
  }));
}
