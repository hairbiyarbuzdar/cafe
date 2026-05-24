"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

type InventoryUnit = "kg" | "g" | "L" | "ml" | "pcs" | "box";
const UNITS: readonly InventoryUnit[] = ["kg", "g", "L", "ml", "pcs", "box"];

function round2(n: number): number { return Math.round(n * 100) / 100; }

export type CreateInventoryItemInput = {
  name: string; sku: string; category: string; unit: InventoryUnit;
  stock: number; reorderLevel: number; costPerUnit: number;
  supplierId?: string | null; expiresAt?: string | null;
  paymentChannelId?: string | null; paidAmount?: number;
};

export type CreateInventoryItemResult = { ok: true; id: string } | { ok: false; error: string };

export type ReceiveStockInput = {
  inventoryItemId: string; quantity: number; supplierId?: string | null;
  costPerUnit?: number; paymentChannelId?: string | null; paidAmount?: number; note?: string;
};

export type ReceiveStockResult =
  | { ok: true; itemId: string; newStock: number }
  | { ok: false; error: string };

export async function receiveStockAction(
  input: ReceiveStockInput,
): Promise<ReceiveStockResult> {
  if (!input.inventoryItemId) return { ok: false, error: "Pick an inventory item" };
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return { ok: false, error: "Quantity must be greater than zero" };
  }
  if (input.costPerUnit !== undefined && (!Number.isFinite(input.costPerUnit) || input.costPerUnit < 0)) {
    return { ok: false, error: "Cost per unit must be 0 or greater" };
  }

  const { data: item } = await supabase
    .from("InventoryItem")
    .select("id, name, unit, costPerUnit, supplierId, stock")
    .eq("id", input.inventoryItemId)
    .maybeSingle();
  if (!item) return { ok: false, error: "Item not found" };

  const unitCost = input.costPerUnit !== undefined ? input.costPerUnit : Number(item.costPerUnit);
  const outflow = round2(input.quantity * unitCost);
  let paidAmount = input.paidAmount !== undefined ? round2(Math.max(0, input.paidAmount)) : outflow;
  if (paidAmount > outflow) return { ok: false, error: "Paid amount can't exceed the restock cost" };

  if (paidAmount > 0 && !input.paymentChannelId) {
    return { ok: false, error: "Pick a payment method to charge the paid amount against" };
  }
  if (paidAmount > 0 && input.paymentChannelId) {
    const { data: channel } = await supabase
      .from("PaymentChannel")
      .select("id, archived, currentBalance")
      .eq("id", input.paymentChannelId)
      .maybeSingle();
    if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
    const balance = Number(channel.currentBalance);
    if (paidAmount > balance) {
      return { ok: false, error: `Payment method only has ${balance.toLocaleString()} available — pay that or less, the rest will sit as outstanding.` };
    }
  }

  const movementSupplierId = input.supplierId !== undefined ? input.supplierId || null : item.supplierId || null;
  const newStock = round2(Number(item.stock) + input.quantity);

  try {
    await supabase.from("InventoryItem").update({
      stock: newStock,
      lastRestocked: new Date().toISOString(),
      ...(input.supplierId !== undefined ? { supplierId: input.supplierId || null } : {}),
      ...(input.costPerUnit !== undefined ? { costPerUnit: input.costPerUnit } : {}),
    }).eq("id", item.id);

    const useChannel = paidAmount > 0 && input.paymentChannelId ? input.paymentChannelId : null;
    await supabase.from("InventoryMovement").insert({
      inventoryItemId: item.id,
      delta: input.quantity,
      reason: input.note?.trim() || `Received ${input.quantity} ${item.unit}`,
      paymentChannelId: useChannel,
      amount: outflow > 0 ? outflow : null,
      paidAmount: outflow > 0 ? paidAmount : null,
      supplierId: movementSupplierId,
    });

    if (useChannel && paidAmount > 0) {
      const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", useChannel).single();
      await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) - paidAmount }).eq("id", useChannel);
    }

    revalidatePath("/inventory");
    revalidatePath("/settings");

    const outstandingNow = round2(Math.max(0, outflow - paidAmount));
    await logActivity({
      type: "stock",
      title: `Restock received — ${item.name}`,
      description: `+${input.quantity} ${item.unit}${outflow > 0 ? ` · paid ${paidAmount.toLocaleString()}${outstandingNow > 0 ? ` · ${outstandingNow.toLocaleString()} due` : ""}` : ""}${input.note?.trim() ? ` · ${input.note.trim()}` : ""}`,
    });

    return { ok: true, itemId: item.id, newStock };
  } catch (err) {
    console.error("receiveStockAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to receive stock" };
  }
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
  if (!Number.isFinite(input.stock) || input.stock < 0) return { ok: false, error: "Stock must be 0 or greater" };
  if (!Number.isFinite(input.reorderLevel) || input.reorderLevel < 0) return { ok: false, error: "Reorder level must be 0 or greater" };
  if (!Number.isFinite(input.costPerUnit) || input.costPerUnit < 0) return { ok: false, error: "Cost per unit must be 0 or greater" };

  const { data: existing } = await supabase.from("InventoryItem").select("id").eq("sku", sku).maybeSingle();
  if (existing) return { ok: false, error: `SKU "${sku}" is already in use` };

  const outflow = round2(input.stock * input.costPerUnit);
  let paidAmount = input.paidAmount !== undefined ? round2(Math.max(0, input.paidAmount)) : outflow;
  if (paidAmount > outflow) return { ok: false, error: "Paid amount can't exceed the purchase cost" };
  if (paidAmount > 0 && !input.paymentChannelId) {
    return { ok: false, error: "Pick a payment method to charge the paid amount against" };
  }
  if (paidAmount > 0 && input.paymentChannelId) {
    const { data: channel } = await supabase.from("PaymentChannel").select("id, archived, currentBalance").eq("id", input.paymentChannelId).maybeSingle();
    if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
    const balance = Number(channel.currentBalance);
    if (paidAmount > balance) {
      return { ok: false, error: `Payment method only has ${balance.toLocaleString()} available — pay that or less, the rest will sit as outstanding.` };
    }
  }

  try {
    const { data: created, error } = await supabase
      .from("InventoryItem")
      .insert({
        name, sku, category, unit: input.unit, stock: input.stock,
        reorderLevel: input.reorderLevel, costPerUnit: input.costPerUnit,
        supplierId: input.supplierId || null,
        lastRestocked: input.stock > 0 ? new Date().toISOString() : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt).toISOString() : null,
      })
      .select("id")
      .single();
    if (error) throw error;

    if (input.stock > 0) {
      const useChannel = paidAmount > 0 && input.paymentChannelId ? input.paymentChannelId : null;
      await supabase.from("InventoryMovement").insert({
        inventoryItemId: created.id,
        delta: input.stock,
        reason: outflow > 0 ? `Initial purchase · ${outflow.toLocaleString()}` : "Initial stock on creation",
        paymentChannelId: useChannel,
        amount: outflow > 0 ? outflow : null,
        paidAmount: outflow > 0 ? paidAmount : null,
        supplierId: input.supplierId || null,
      });
      if (useChannel && paidAmount > 0) {
        const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", useChannel).single();
        await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) - paidAmount }).eq("id", useChannel);
      }
    }

    revalidatePath("/inventory");
    revalidatePath("/settings");
    await logActivity({
      type: "stock",
      title: `New inventory item — ${name}`,
      description: `SKU ${sku} · ${input.stock} ${input.unit} on hand${outflow > 0 ? ` · ${outflow.toLocaleString()} out` : ""}`,
    });
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createInventoryItemAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create item" };
  }
}
