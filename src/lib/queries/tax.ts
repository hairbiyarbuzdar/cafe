import "server-only";

import { prisma } from "@/lib/prisma";

export type TaxConfig = {
  rate: number;
  label: string;
};

/**
 * Workspace tax config. Singleton row id = "default"; if missing
 * (fresh DB) we return the sensible default the cart used to ship
 * with. The Settings → Tax panel writes the persistent value.
 */
export async function getTaxConfig(): Promise<TaxConfig> {
  const row = await prisma.taxConfig.findUnique({ where: { id: "default" } });
  return {
    rate: row?.rate ?? 0.085,
    label: row?.label ?? "Tax",
  };
}
