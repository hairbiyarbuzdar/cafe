import "server-only";

import { supabase } from "@/lib/supabase";
import type { Category, MenuItem, ProductModifier, RecipeIngredient } from "@/types";

export async function listMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("MenuItem")
    .select("*, RecipeIngredient(inventoryItemId, quantity, unit)")
    .order("categoryId")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description ?? undefined,
    categoryId: m.categoryId,
    stationId: m.stationId,
    price: Number(m.price),
    cost: m.cost != null ? Number(m.cost) : undefined,
    sku: m.sku ?? undefined,
    pctCode: m.pctCode ?? undefined,
    image: m.image ?? undefined,
    available: m.available,
    posVisible: m.posVisible,
    prepTimeMinutes: m.prepTimeMinutes ?? undefined,
    popular: m.popular,
    modifiers: Array.isArray(m.modifiers) ? (m.modifiers as ProductModifier[]) : undefined,
    recipe: (m.RecipeIngredient ?? []).map<RecipeIngredient>((r) => ({
      inventoryItemId: r.inventoryItemId,
      quantity: Number(r.quantity),
      unit: r.unit,
    })),
  }));
}

export async function listMenuCategories(): Promise<Category[]> {
  const [{ data: cats, error }, { data: items }] = await Promise.all([
    supabase.from("MenuCategory").select("*").order("name"),
    supabase.from("MenuItem").select("categoryId"),
  ]);
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const i of items ?? []) counts[i.categoryId] = (counts[i.categoryId] ?? 0) + 1;

  return (cats ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    color: c.color,
    count: counts[c.id] ?? 0,
  }));
}
