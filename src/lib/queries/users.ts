import "server-only";

import { supabase } from "@/lib/supabase";
import type { AssignableStaff } from "@/types";
import type { Permission, SessionUser } from "@/types/auth";

export async function listAssignableStaff(): Promise<AssignableStaff[]> {
  const { data, error } = await supabase
    .from("User")
    .select("id, name, role")
    .in("role", ["waiter", "delivery"])
    .eq("active", true)
    .order("role")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, role: r.role }));
}

export async function listPublicUsers(): Promise<SessionUser[]> {
  const { data, error } = await supabase
    .from("User")
    .select("id, name, email, phone, role, avatar, defaultRoute, monthlySalary, Role(name, permissions, defaultRoute)")
    .order("role")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const roleData = Array.isArray(r.Role) ? r.Role[0] : r.Role;
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      roleName: roleData?.name,
      permissions: Array.isArray(roleData?.permissions) ? (roleData.permissions as Permission[]) : [],
      avatar: r.avatar,
      defaultRoute: r.defaultRoute ?? roleData?.defaultRoute ?? null,
      monthlySalary: r.monthlySalary != null ? Number(r.monthlySalary) : null,
    };
  });
}

export type PendingMember = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
};

export async function listPendingMembers(): Promise<PendingMember[]> {
  const { data, error } = await supabase
    .from("PendingMember")
    .select("id, name, email, phone, createdAt")
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone, createdAt: r.createdAt,
  }));
}
