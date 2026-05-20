import "server-only";

import { prisma } from "@/lib/prisma";
import type { AssignableStaff } from "@/types";
import type { Permission, SessionUser } from "@/types/auth";

/**
 * Staff that can be assigned to orders/tables: waiters (dine-in) and
 * delivery riders. These roles carry no app permissions — they exist
 * purely so orders/tables can be tagged with a person.
 */
export async function listAssignableStaff(): Promise<AssignableStaff[]> {
  const rows = await prisma.user.findMany({
    where: { role: { in: ["waiter", "delivery"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, role: true },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, role: r.role }));
}

/**
 * Public user roster — what the login screen's demo picker and the
 * settings → team panel both render. Never includes `passwordHash`.
 */
export async function listPublicUsers(): Promise<SessionUser[]> {
  const rows = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      defaultRoute: true,
      monthlySalary: true,
      roleRef: {
        select: { name: true, permissions: true, defaultRoute: true },
      },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    role: r.role,
    roleName: r.roleRef?.name,
    permissions: Array.isArray(r.roleRef?.permissions)
      ? (r.roleRef.permissions as Permission[])
      : [],
    avatar: r.avatar,
    defaultRoute: r.defaultRoute ?? r.roleRef?.defaultRoute ?? null,
    monthlySalary: r.monthlySalary ? Number(r.monthlySalary) : null,
  }));
}

export type PendingMember = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
};

/** Drafts created from the Staff page, awaiting a role + password. */
export async function listPendingMembers(): Promise<PendingMember[]> {
  const rows = await prisma.pendingMember.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    createdAt: r.createdAt.toISOString(),
  }));
}
