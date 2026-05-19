"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

type InventoryUnit = "kg" | "g" | "L" | "ml" | "pcs" | "box";

export type CreateInventoryItemInput = {
  name: string;
  sku: string;
  category: string;
  unit: InventoryUnit;
  stock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierId?: string | null;
  expiresAt?: string | null;
};

export type CreateInventoryItemResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const UNITS: readonly InventoryUnit[] = ["kg", "g", "L", "ml", "pcs", "box"];

export type ReceiveStockInput = {
  inventoryItemId: string;
  /** Positive quantity to add to stock, in the item's own unit. */
  quantity: number;
  /** Optional new supplier (e.g. operator switched mid-restock). */
  supplierId?: string | null;
  /** Optional new cost per unit — updates the item's cost too. */
  costPerUnit?: number;
  note?: string;
};

export type ReceiveStockResult =
  | { ok: true; itemId: string; newStock: number }
  | { ok: false; error: string };

export async function receiveStockAction(
  input: ReceiveStockInput,
): Promise<ReceiveStockResult> {
  if (!input.inventoryItemId) {
    return { ok: false, error: "Pick an inventory item" };
  }
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return { ok: false, error: "Quantity must be greater than zero" };
  }
  if (
    input.costPerUnit !== undefined &&
    (!Number.isFinite(input.costPerUnit) || input.costPerUnit < 0)
  ) {
    return { ok: false, error: "Cost per unit must be 0 or greater" };
  }

  const item = await prisma.inventoryItem.findUnique({
    where: { id: input.inventoryItemId },
    select: { id: true, name: true, unit: true },
  });
  if (!item) return { ok: false, error: "Item not found" };

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const next = await tx.inventoryItem.update({
        where: { id: item.id },
        data: {
          stock: { increment: input.quantity },
          lastRestocked: new Date(),
          ...(input.supplierId !== undefined
            ? { supplierId: input.supplierId || null }
            : {}),
          ...(input.costPerUnit !== undefined
            ? { costPerUnit: input.costPerUnit }
            : {}),
        },
        select: { id: true, stock: true },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          delta: input.quantity,
          reason: input.note?.trim() || `Received ${input.quantity} ${item.unit}`,
        },
      });
      return next;
    });

    revalidatePath("/inventory");

    await logActivity({
      type: "stock",
      title: `Restock received — ${item.name}`,
      description: `+${input.quantity} ${item.unit}${
        input.note?.trim() ? ` · ${input.note.trim()}` : ""
      }`,
    });

    return {
      ok: true,
      itemId: updated.id,
      newStock: toNumber(updated.stock),
    };
  } catch (err) {
    console.error("receiveStockAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to receive stock",
    };
  }
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

export async function createInventoryItemAction(
  input: CreateInventoryItemInput,
): Promise<CreateInventoryItemResult> {
  const name = input.name?.trim();
  const sku = input.sku?.trim();
  const category = input.category?.trim();

  if (!name) return { ok: false, error: "Name is required" };
  if (!sku) return { ok: false, error: "SKU is required" };
  if (!category) return { ok: false, error: "Category is required" };
  if (!UNITS.includes(input.unit)) return { ok: false, error: "Unit is invalid" };
  if (!Number.isFinite(input.stock) || input.stock < 0) {
    return { ok: false, error: "Stock must be 0 or greater" };
  }
  if (!Number.isFinite(input.reorderLevel) || input.reorderLevel < 0) {
    return { ok: false, error: "Reorder level must be 0 or greater" };
  }
  if (!Number.isFinite(input.costPerUnit) || input.costPerUnit < 0) {
    return { ok: false, error: "Cost per unit must be 0 or greater" };
  }

  // SKU is uniquely indexed — fail fast with a friendly message instead
  // of leaking a Prisma unique-violation error.
  const existing = await prisma.inventoryItem.findUnique({
    where: { sku },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: `SKU "${sku}" is already in use` };
  }

  try {
    const created = await prisma.inventoryItem.create({
      data: {
        name,
        sku,
        category,
        unit: input.unit,
        stock: input.stock,
        reorderLevel: input.reorderLevel,
        costPerUnit: input.costPerUnit,
        supplierId: input.supplierId || null,
        lastRestocked: input.stock > 0 ? new Date() : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
      select: { id: true },
    });

    // If the operator opened the item with stock already on hand,
    // record that as the opening-balance movement so the audit trail
    // matches what the inventory page shows.
    if (input.stock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          inventoryItemId: created.id,
          delta: input.stock,
          reason: "Initial stock on creation",
        },
      });
    }

    revalidatePath("/inventory");

    await logActivity({
      type: "stock",
      title: `New inventory item — ${name}`,
      description: `SKU ${sku} · ${input.stock} ${input.unit} on hand`,
    });

    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createInventoryItemAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create item",
    };
  }
}
