"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import type { ProductModifier, RecipeIngredient } from "@/types";

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
  name: string; description: string | null; categoryId: string; stationId: string;
  price: number; sku: string | null; pctCode: string | null; available: boolean;
  posVisible: boolean; popular: boolean; prepTimeMinutes: number | null;
  image: string | null; modifiers: object | undefined;
};

type SanitizeResult =
  | { ok: true; data: SanitizedMenuItem; recipe: RecipeIngredient[] }
  | { ok: false; error: string };

function sanitize(input: MenuItemInput): SanitizeResult {
  const name = input.name?.trim();
  const sku = input.sku?.trim() || null;
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!input.categoryId) return { ok: false, error: "Pick a category" };
  if (!input.stationId) return { ok: false, error: "Pick a kitchen station" };
  if (!Number.isFinite(input.price) || input.price < 0) return { ok: false, error: "Price must be 0 or greater" };
  return {
    ok: true,
    data: {
      name, description: input.description?.trim() || null, categoryId: input.categoryId,
      stationId: input.stationId, price: input.price, sku, pctCode: input.pctCode?.trim() || null,
      available: input.available, posVisible: input.posVisible, popular: input.popular ?? false,
      prepTimeMinutes: input.prepTimeMinutes != null && input.prepTimeMinutes > 0 ? Math.floor(input.prepTimeMinutes) : null,
      image: input.image?.trim() || null,
      modifiers: input.modifiers && input.modifiers.length ? (input.modifiers as unknown as object) : undefined,
    },
    recipe: input.recipe ?? [],
  };
}

export async function createMenuItemAction(
  input: MenuItemInput,
): Promise<ActionResult<{ id: string }>> {
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const sku = sanitized.data.sku;
  if (sku) {
    const { data: dup } = await supabase.from("MenuItem").select("id").eq("sku", sku).maybeSingle();
    if (dup) return { ok: false, error: `SKU "${sku}" is in use` };
  }

  try {
    const { data: created, error } = await supabase
      .from("MenuItem")
      .insert(sanitized.data)
      .select("id")
      .single();
    if (error) throw error;

    if (sanitized.recipe.length) {
      await supabase.from("RecipeIngredient").insert(
        sanitized.recipe.map((r) => ({
          menuItemId: created.id,
          inventoryItemId: r.inventoryItemId,
          quantity: r.quantity,
          unit: r.unit,
        })),
      );
    }

    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createMenuItemAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create item" };
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
    const { data: dup } = await supabase.from("MenuItem").select("id").eq("sku", sku).neq("id", id).maybeSingle();
    if (dup) return { ok: false, error: `SKU "${sku}" is in use` };
  }

  try {
    const { error } = await supabase.from("MenuItem").update(sanitized.data).eq("id", id);
    if (error) throw error;

    await supabase.from("RecipeIngredient").delete().eq("menuItemId", id);
    if (sanitized.recipe.length) {
      await supabase.from("RecipeIngredient").insert(
        sanitized.recipe.map((r) => ({
          menuItemId: id,
          inventoryItemId: r.inventoryItemId,
          quantity: r.quantity,
          unit: r.unit,
        })),
      );
    }

    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("updateMenuItemAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update item" };
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

  const { data: inUse } = await supabase
    .from("OrderItem")
    .select("menuItemId")
    .in("menuItemId", ids)
    .limit(1);
  if (inUse && inUse.length > 0) {
    return {
      ok: false,
      error: "At least one selected item is referenced by past orders. Hide it from the POS (toggle 'On POS') instead of deleting.",
    };
  }

  try {
    const { error } = await supabase.from("MenuItem").delete().in("id", ids);
    if (error) throw error;
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true, data: { deleted: ids.length } };
  } catch (err) {
    console.error("deleteMenuItemsAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete items" };
  }
}

export async function toggleMenuItemAvailabilityAction(id: string): Promise<ActionResult> {
  return toggleField(id, "available");
}

export async function toggleMenuItemPosVisibilityAction(id: string): Promise<ActionResult> {
  return toggleField(id, "posVisible");
}

async function toggleField(id: string, field: "available" | "posVisible"): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing item id" };
  const { data: row } = await supabase
    .from("MenuItem")
    .select(field)
    .eq("id", id)
    .maybeSingle();
  if (!row) return { ok: false, error: "Item not found" };
  await supabase.from("MenuItem").update({ [field]: !(row as Record<string, boolean>)[field] }).eq("id", id);
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { ok: true };
}
