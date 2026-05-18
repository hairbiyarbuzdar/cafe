import "server-only";

import { prisma } from "@/lib/prisma";
import type { InventoryItem, Supplier } from "@/types";

/**
 * Inventory queries.
 *
 * Prisma returns `Decimal` for numeric columns and `Date` for
 * timestamps. The UI layer wants plain numbers and ISO strings, so
 * we shape rows here rather than in every consumer.
 */

export async function listInventory(): Promise<InventoryItem[]> {
  const rows = await prisma.inventoryItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return rows.map(toInventoryItem);
}

export async function listSuppliers(): Promise<Supplier[]> {
  const rows = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { inventoryItems: true } } },
  });
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    contact: s.contact ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    itemsSupplied: s._count.inventoryItems,
    rating: s.rating,
  }));
}

export async function listLowStock(limit = 6): Promise<InventoryItem[]> {
  // Postgres can't ORDER-BY/FILTER between two columns through Prisma's
  // standard filter syntax, so we fetch the small "below reorder" set
  // via a raw expression instead.
  const rows = await prisma.$queryRaw<
    {
      id: string;
      name: string;
      sku: string;
      category: string;
      unit: string;
      stock: number;
      reorderLevel: number;
      costPerUnit: number;
      supplierId: string | null;
      lastRestocked: Date | null;
      expiresAt: Date | null;
    }[]
  >`
    SELECT
      id,
      name,
      sku,
      category,
      unit,
      stock::float8       AS "stock",
      "reorderLevel"::float8 AS "reorderLevel",
      "costPerUnit"::float8  AS "costPerUnit",
      "supplierId",
      "lastRestocked",
      "expiresAt"
    FROM "InventoryItem"
    WHERE stock < "reorderLevel"
    ORDER BY (stock / NULLIF("reorderLevel", 0)) ASC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    sku: r.sku,
    category: r.category,
    unit: r.unit as InventoryItem["unit"],
    stock: Number(r.stock),
    reorderLevel: Number(r.reorderLevel),
    costPerUnit: Number(r.costPerUnit),
    supplierId: r.supplierId ?? "",
    lastRestocked: (r.lastRestocked ?? new Date(0)).toISOString(),
    expiresAt: r.expiresAt ? r.expiresAt.toISOString() : undefined,
  }));
}

export type InventorySummary = {
  skuCount: number;
  totalValue: number;
  lowCount: number;
};

export async function inventorySummary(): Promise<InventorySummary> {
  const [agg, lowCount, skuCount] = await Promise.all([
    prisma.$queryRaw<{ total: number | null }[]>`
      SELECT SUM(stock * "costPerUnit")::float8 AS total FROM "InventoryItem"
    `,
    prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM "InventoryItem" WHERE stock < "reorderLevel"
    `,
    prisma.inventoryItem.count(),
  ]);
  return {
    skuCount,
    totalValue: Number(agg[0]?.total ?? 0),
    lowCount: Number(lowCount[0]?.count ?? 0),
  };
}

function toInventoryItem(row: {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  stock: unknown;
  reorderLevel: unknown;
  costPerUnit: unknown;
  supplierId: string | null;
  lastRestocked: Date | null;
  expiresAt: Date | null;
}): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    unit: row.unit as InventoryItem["unit"],
    stock: toNumber(row.stock),
    reorderLevel: toNumber(row.reorderLevel),
    costPerUnit: toNumber(row.costPerUnit),
    supplierId: row.supplierId ?? "",
    lastRestocked: (row.lastRestocked ?? new Date(0)).toISOString(),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : undefined,
  };
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}
