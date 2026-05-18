import "server-only";

import { prisma } from "@/lib/prisma";
import type { Category, MenuItem, ProductModifier, RecipeIngredient } from "@/types";

export async function listMenuItems(): Promise<MenuItem[]> {
  const rows = await prisma.menuItem.findMany({
    orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    include: { recipe: true },
  });
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description ?? undefined,
    categoryId: m.categoryId,
    stationId: m.stationId,
    price: toNumber(m.price),
    sku: m.sku ?? undefined,
    pctCode: m.pctCode ?? undefined,
    image: m.image ?? undefined,
    available: m.available,
    posVisible: m.posVisible,
    prepTimeMinutes: m.prepTimeMinutes ?? undefined,
    popular: m.popular,
    modifiers: Array.isArray(m.modifiers)
      ? (m.modifiers as ProductModifier[])
      : undefined,
    recipe: m.recipe.map<RecipeIngredient>((r) => ({
      inventoryItemId: r.inventoryItemId,
      quantity: toNumber(r.quantity),
      unit: r.unit,
    })),
  }));
}

export async function listMenuCategories(): Promise<Category[]> {
  const rows = await prisma.menuCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    color: c.color,
    count: c._count.items,
  }));
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
