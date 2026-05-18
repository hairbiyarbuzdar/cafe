import "server-only";

import { prisma } from "@/lib/prisma";
import type { KitchenStation } from "@/types";

export async function listKitchenStations(): Promise<KitchenStation[]> {
  const rows = await prisma.kitchenStation.findMany({
    orderBy: { name: "asc" },
  });
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    printer: s.printer ?? undefined,
    active: s.active,
    color: s.color,
  }));
}
