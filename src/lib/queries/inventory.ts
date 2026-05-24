import "server-only";

import { supabase } from "@/lib/supabase";
import type { InventoryItem, Supplier } from "@/types";

export async function listInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("InventoryItem")
    .select("*")
    .order("category")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(toInventoryItem);
}

export async function listSuppliers(): Promise<Supplier[]> {
  const [{ data: suppliers, error }, { data: items }] = await Promise.all([
    supabase.from("Supplier").select("*").order("name"),
    supabase.from("InventoryItem").select("supplierId"),
  ]);
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const i of items ?? []) {
    if (i.supplierId) counts[i.supplierId] = (counts[i.supplierId] ?? 0) + 1;
  }

  return (suppliers ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    contact: s.contact ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    itemsSupplied: counts[s.id] ?? 0,
    rating: Number(s.rating),
  }));
}

export async function listLowStock(limit = 6): Promise<InventoryItem[]> {
  const { data, error } = await supabase.from("InventoryItem").select("*");
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((r) => Number(r.stock) < Number(r.reorderLevel))
    .sort((a, b) => {
      const ratioA = Number(a.reorderLevel) === 0 ? 0 : Number(a.stock) / Number(a.reorderLevel);
      const ratioB = Number(b.reorderLevel) === 0 ? 0 : Number(b.stock) / Number(b.reorderLevel);
      return ratioA - ratioB;
    })
    .slice(0, limit)
    .map(toInventoryItem);
}

export type InventorySummary = { skuCount: number; totalValue: number; lowCount: number };

export async function inventorySummary(): Promise<InventorySummary> {
  const { data, error } = await supabase.from("InventoryItem").select("stock, reorderLevel, costPerUnit");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const totalValue = rows.reduce((sum, r) => sum + Number(r.stock) * Number(r.costPerUnit), 0);
  const lowCount = rows.filter((r) => Number(r.stock) < Number(r.reorderLevel)).length;
  return { skuCount: rows.length, totalValue, lowCount };
}

function toInventoryItem(row: Record<string, unknown>): InventoryItem {
  return {
    id: row.id as string,
    name: row.name as string,
    sku: row.sku as string,
    category: row.category as string,
    unit: row.unit as InventoryItem["unit"],
    stock: Number(row.stock),
    reorderLevel: Number(row.reorderLevel),
    costPerUnit: Number(row.costPerUnit),
    supplierId: (row.supplierId as string | null) ?? "",
    lastRestocked: (row.lastRestocked as string | null) ?? new Date(0).toISOString(),
    expiresAt: (row.expiresAt as string | null) ?? undefined,
  };
}
