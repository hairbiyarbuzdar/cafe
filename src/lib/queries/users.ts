import "server-only";

import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types/auth";

/**
 * Public user roster — what the login screen's demo picker and the
 * settings → team panel both render. Never includes `passwordHash`.
 */
export async function listPublicUsers(): Promise<SessionUser[]> {
  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
}
