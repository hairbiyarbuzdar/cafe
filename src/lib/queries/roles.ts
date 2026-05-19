import "server-only";

import { prisma } from "@/lib/prisma";
import type { Permission } from "@/types/auth";

export type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  isSystem: boolean;
  defaultRoute: string | null;
  /** How many users currently hold this role — used by Roles Manager
   * to block deletion of in-use roles. */
  userCount: number;
};

/** All roles (built-in + custom) ordered system-first. */
export async function listRoles(): Promise<Role[]> {
  const rows = await prisma.role.findMany({
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    include: { _count: { select: { users: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    permissions: Array.isArray(r.permissions)
      ? (r.permissions as Permission[])
      : [],
    isSystem: r.isSystem,
    defaultRoute: r.defaultRoute,
    userCount: r._count.users,
  }));
}
