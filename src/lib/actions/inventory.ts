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
  /** Channel to debit when the operator records initial stock with a
   * non-zero cost (i.e. they actually paid for it on the spot). Null
   * = no money moved (opening balance / on-hand reconciliation). */
  paymentChannelId?: string | null;
  /** How much the operator is paying up-front. Defaults to the full
   * cost when omitted (preserves old caller behaviour). Anything
   * less becomes outstanding on the supplier ledger. */
  paidAmount?: number;
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
  /** Channel to debit for whatever portion is paid up-front. */
  paymentChannelId?: string | null;
  /**
   * How much the operator is paying *right now*, in workspace
   * currency. Bounded server-side to `0 ≤ paidAmount ≤ min(cost,
   * channel.currentBalance)`. Anything below cost becomes the
   * outstanding balance on the supplier's ledger.
   */
  paidAmount?: number;
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
    select: {
      id: true,
      name: true,
      unit: true,
      costPerUnit: true,
      supplierId: true,
    },
  });
  if (!item) return { ok: false, error: "Item not found" };

  // Resolve cost-out for this restock. If the operator didn't override
  // the unit cost we fall back to the item's stored cost — same value
  // the dialog previewed so the cashier sees no surprises.
  const unitCost =
    input.costPerUnit !== undefined ? input.costPerUnit : toNumber(item.costPerUnit);
  const outflow = round2(input.quantity * unitCost);

  // Resolve "paid now" against the cost + channel headroom. Default
  // to the full outflow only when the operator didn't pass a value
  // (preserves the old behaviour for callers that don't yet know
  // about partial payments).
  let paidAmount =
    input.paidAmount !== undefined ? round2(Math.max(0, input.paidAmount)) : outflow;
  if (paidAmount > outflow) {
    return {
      ok: false,
      error: "Paid amount can't exceed the restock cost",
    };
  }

  if (paidAmount > 0 && !input.paymentChannelId) {
    return {
      ok: false,
      error: "Pick a payment method to charge the paid amount against",
    };
  }
  if (paidAmount > 0 && input.paymentChannelId) {
    const channel = await prisma.paymentChannel.findUnique({
      where: { id: input.paymentChannelId },
      select: { id: true, archived: true, currentBalance: true },
    });
    if (!channel || channel.archived) {
      return { ok: false, error: "Selected payment method isn't active" };
    }
    const balance = toNumber(channel.currentBalance);
    if (paidAmount > balance) {
      return {
        ok: false,
        error: `Payment method only has ${balance.toLocaleString()} available — pay that or less, the rest will sit as outstanding.`,
      };
    }
  }

  // Resolve supplier snapshot: explicit override wins, else fall back
  // to the item's current supplier so future ledger queries can find
  // this row even when the item later changes supplier.
  const movementSupplierId =
    input.supplierId !== undefined
      ? input.supplierId || null
      : item.supplierId || null;

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
      const useChannel =
        paidAmount > 0 && input.paymentChannelId ? input.paymentChannelId : null;
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          delta: input.quantity,
          reason: input.note?.trim() || `Received ${input.quantity} ${item.unit}`,
          paymentChannelId: useChannel,
          amount: outflow > 0 ? outflow : null,
          paidAmount: outflow > 0 ? paidAmount : null,
          supplierId: movementSupplierId,
        },
      });
      if (useChannel && paidAmount > 0) {
        await tx.paymentChannel.update({
          where: { id: useChannel },
          data: { currentBalance: { decrement: paidAmount } },
        });
      }
      return next;
    });

    revalidatePath("/inventory");
    revalidatePath("/settings");

    const outstandingNow = round2(Math.max(0, outflow - paidAmount));
    await logActivity({
      type: "stock",
      title: `Restock received — ${item.name}`,
      description: `+${input.quantity} ${item.unit}${
        outflow > 0
          ? ` · paid ${paidAmount.toLocaleString()}${
              outstandingNow > 0 ? ` · ${outstandingNow.toLocaleString()} due` : ""
            }`
          : ""
      }${input.note?.trim() ? ` · ${input.note.trim()}` : ""}`,
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

  const outflow = round2(input.stock * input.costPerUnit);
  let paidAmount =
    input.paidAmount !== undefined ? round2(Math.max(0, input.paidAmount)) : outflow;
  if (paidAmount > outflow) {
    return { ok: false, error: "Paid amount can't exceed the purchase cost" };
  }
  if (paidAmount > 0 && !input.paymentChannelId) {
    return {
      ok: false,
      error: "Pick a payment method to charge the paid amount against",
    };
  }
  if (paidAmount > 0 && input.paymentChannelId) {
    const channel = await prisma.paymentChannel.findUnique({
      where: { id: input.paymentChannelId },
      select: { id: true, archived: true, currentBalance: true },
    });
    if (!channel || channel.archived) {
      return { ok: false, error: "Selected payment method isn't active" };
    }
    const balance = toNumber(channel.currentBalance);
    if (paidAmount > balance) {
      return {
        ok: false,
        error: `Payment method only has ${balance.toLocaleString()} available — pay that or less, the rest will sit as outstanding.`,
      };
    }
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.inventoryItem.create({
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

      if (input.stock > 0) {
        const useChannel =
          paidAmount > 0 && input.paymentChannelId ? input.paymentChannelId : null;
        await tx.inventoryMovement.create({
          data: {
            inventoryItemId: row.id,
            delta: input.stock,
            reason:
              outflow > 0
                ? `Initial purchase · ${outflow.toLocaleString()}`
                : "Initial stock on creation",
            paymentChannelId: useChannel,
            amount: outflow > 0 ? outflow : null,
            paidAmount: outflow > 0 ? paidAmount : null,
            supplierId: input.supplierId || null,
          },
        });
        if (useChannel && paidAmount > 0) {
          await tx.paymentChannel.update({
            where: { id: useChannel },
            data: { currentBalance: { decrement: paidAmount } },
          });
        }
      }

      return row;
    });

    revalidatePath("/inventory");
    revalidatePath("/settings");

    await logActivity({
      type: "stock",
      title: `New inventory item — ${name}`,
      description: `SKU ${sku} · ${input.stock} ${input.unit} on hand${
        outflow > 0 ? ` · ${outflow.toLocaleString()} out` : ""
      }`,
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
