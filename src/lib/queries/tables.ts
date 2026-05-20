import "server-only";

import { prisma } from "@/lib/prisma";
import type { Table } from "@/types";

export async function listTables(): Promise<Table[]> {
  const rows = await prisma.table.findMany({
    orderBy: { name: "asc" },
    include: { waiter: { select: { name: true } } },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    capacity: t.capacity,
    occupancy: t.occupancy,
    waiterId: t.waiterId,
    waiterName: t.waiter?.name ?? null,
  }));
}
