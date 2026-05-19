"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ProductModifier, RecipeIngredient } from "@/types";

/**
 * Menu CRUD. Persists to the `MenuItem` table so edits survive page
 * refreshes — the form sheet was previously mutating the Zustand
 * store directly, which only lasted until the next nav.
 */

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type MenuItemInput = {
  name: string;
  description?: string | null;
  categoryId: string;
  stationId: string;
  price: number;
  sku?: string | null;
  pctCode?: string | null;
  available: boolean;
  posVisible: boolean;
  popular?: boolean;
  prepTimeMinutes?: number | null;
  image?: string | null;
  modifiers?: ProductModifier[];
  recipe?: RecipeIngredient[];
};

type SanitizedMenuItem = {
  name: string;
  description: string | null;
  categoryId: string;
  stationId: string;
  price: number;
  sku: string | null;
  pctCode: string | null;
  available: boolean;
  posVisible: boolean;
  popular: boolean;
  prepTimeMinutes: number | null;
  image: string | null;
  modifiers: object | undefined;
};

type SanitizeResult =
  | { ok: true; data: SanitizedMenuItem; recipe: RecipeIngredient[] }
  | { ok: false; error: string };

function sanitize(input: MenuItemInput): SanitizeResult {
  const name = input.name?.trim();
  const sku = input.sku?.trim() || null;
  if (!name || name.length < 2) {
    return { ok: false, error: "Name is required" };
  }
  if (!input.categoryId) return { ok: false, error: "Pick a category" };
  if (!input.stationId) return { ok: false, error: "Pick a kitchen station" };
  if (!Number.isFinite(input.price) || input.price < 0) {
    return { ok: false, error: "Price must be 0 or greater" };
  }
  return {
    ok: true,
    data: {
      name,
      description: input.description?.trim() || null,
      categoryId: input.categoryId,
      stationId: input.stationId,
      price: input.price,
      sku,
      pctCode: input.pctCode?.trim() || null,
      available: input.available,
      posVisible: input.posVisible,
      popular: input.popular ?? false,
      prepTimeMinutes:
        input.prepTimeMinutes != null && input.prepTimeMinutes > 0
          ? Math.floor(input.prepTimeMinutes)
          : null,
      image: input.image?.trim() || null,
      modifiers:
        input.modifiers && input.modifiers.length
          ? (input.modifiers as unknown as object)
          : undefined,
    },
    recipe: input.recipe ?? [],
  };
}

export async function createMenuItemAction(
  input: MenuItemInput,
): Promise<ActionResult<{ id: string }>> {
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  // SKU uniqueness — quick precheck to give the operator a friendly
  // error instead of leaking a P2002 from Prisma.
  const sku = sanitized.data.sku;
  if (sku) {
    const dup = await prisma.menuItem.findUnique({
      where: { sku },
      select: { id: true },
    });
    if (dup) return { ok: false, error: `SKU "${sku}" is in use` };
  }

  try {
    const created = await prisma.menuItem.create({
      data: {
        ...sanitized.data,
        recipe: sanitized.recipe.length
          ? {
              create: sanitized.recipe.map((r) => ({
                inventoryItemId: r.inventoryItemId,
                quantity: r.quantity,
                unit: r.unit,
              })),
            }
          : undefined,
      },
      select: { id: true },
    });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createMenuItemAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create item",
    };
  }
}

export async function updateMenuItemAction(
  id: string,
  input: MenuItemInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing item id" };
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const sku = sanitized.data.sku;
  if (sku) {
    const dup = await prisma.menuItem.findFirst({
      where: { sku, NOT: { id } },
      select: { id: true },
    });
    if (dup) return { ok: false, error: `SKU "${sku}" is in use` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.menuItem.update({
        where: { id },
        data: sanitized.data,
      });
      // Replace the recipe wholesale — simpler than diffing each line.
      await tx.recipeIngredient.deleteMany({ where: { menuItemId: id } });
      if (sanitized.recipe.length) {
        await tx.recipeIngredient.createMany({
          data: sanitized.recipe.map((r) => ({
            menuItemId: id,
            inventoryItemId: r.inventoryItemId,
            quantity: r.quantity,
            unit: r.unit,
          })),
        });
      }
    });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("updateMenuItemAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update item",
    };
  }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing item id" };
  return deleteMenuItemsAction([id]);
}

export async function deleteMenuItemsAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  if (!ids.length) return { ok: false, error: "Nothing selected" };

  // Block deleting menu items that already appear on placed orders —
  // OrderItem.menuItemId is a required FK without cascade, so the
  // delete would fail with a 23503 and the operator would have to
  // refresh to see the consistent state. Block early with a clear msg.
  const inUse = await prisma.orderItem.findMany({
    where: { menuItemId: { in: ids } },
    select: { menuItemId: true },
    take: 1,
  });
  if (inUse.length > 0) {
    return {
      ok: false,
      error:
        "At least one selected item is referenced by past orders. Hide it from the POS (toggle 'On POS') instead of deleting.",
    };
  }

  try {
    const result = await prisma.menuItem.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true, data: { deleted: result.count } };
  } catch (err) {
    console.error("deleteMenuItemsAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete items",
    };
  }
}

export async function toggleMenuItemAvailabilityAction(
  id: string,
): Promise<ActionResult> {
  return toggleField(id, "available");
}

export async function toggleMenuItemPosVisibilityAction(
  id: string,
): Promise<ActionResult> {
  return toggleField(id, "posVisible");
}

async function toggleField(
  id: string,
  field: "available" | "posVisible",
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing item id" };
  const row = await prisma.menuItem.findUnique({
    where: { id },
    select: { [field]: true } as { available: true } | { posVisible: true },
  });
  if (!row) return { ok: false, error: "Item not found" };
  await prisma.menuItem.update({
    where: { id },
    data: { [field]: !(row as Record<string, boolean>)[field] },
  });
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { ok: true };
}
