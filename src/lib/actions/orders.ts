"use server";

import { revalidatePath } from "next/cache";

import { submitInvoiceToBraAction } from "@/lib/actions/fiscal";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getOrderById } from "@/lib/queries/orders";
import { publish } from "@/lib/realtime/bus";
import { sendPushInBackground, userIdsWithPermission } from "@/lib/push/server";
import type { Order, OrderChannel, PaymentMethod, ProductModifier } from "@/types";

export type LoadOrderResult = { ok: true; order: Order } | { ok: false; error: string };

export async function loadOrderForPaymentAction(orderId: string): Promise<LoadOrderResult> {
  const order = await getOrderById(orderId);
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Order is already paid" };
  if (order.status === "cancelled" || order.status === "refunded" || order.status === "completed") {
    return { ok: false, error: `Order is ${order.status} — cannot collect` };
  }
  if (order.status !== "ready") {
    return { ok: false, error: `Order is ${order.status} — cashier can collect only after the kitchen marks it ready.` };
  }
  return { ok: true, order };
}

type CheckoutItem = { productId: string; quantity: number; modifiers?: ProductModifier[]; note?: string };

type Priced = {
  line: CheckoutItem; name: string; unitPrice: number; stationId: string;
  recipe: { inventoryItemId: string; quantity: number }[];
};

const ORDER_NUMBER_BASE = 5800;
const PAYMENT_METHODS: readonly PaymentMethod[] = ["card", "cash", "wallet", "online"];

function round2(n: number) { return Math.round(n * 100) / 100; }
function sumPriced(lines: Priced[]) { return lines.reduce((sum, p) => sum + p.unitPrice * p.line.quantity, 0); }
function collectIngredientDelta(lines: Priced[]): Map<string, number> {
  const delta = new Map<string, number>();
  for (const p of lines) {
    for (const r of p.recipe) {
      delta.set(r.inventoryItemId, (delta.get(r.inventoryItemId) ?? 0) + r.quantity * p.line.quantity);
    }
  }
  return delta;
}
function toOrderItemCreate(p: Priced) {
  return {
    menuItemId: p.line.productId, name: p.name, quantity: p.line.quantity, unitPrice: p.unitPrice,
    modifiers: p.line.modifiers && p.line.modifiers.length ? p.line.modifiers.map((m) => m.name) : undefined,
    note: p.line.note ?? null,
  };
}
function receiptNumberFor(orderNumber: string) { return `BR-${orderNumber.replace(/^#/, "")}`; }

async function priceCart(items: CheckoutItem[]): Promise<{ ok: true; lines: Priced[] } | { ok: false; error: string }> {
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const { data: menuItems } = await supabase
    .from("MenuItem")
    .select("id, name, price, stationId, RecipeIngredient(inventoryItemId, quantity)")
    .in("id", productIds);
  const menuById = new Map((menuItems ?? []).map((m) => [m.id, m]));
  const missing = productIds.filter((id) => !menuById.has(id));
  if (missing.length) return { ok: false, error: `Unknown menu item(s): ${missing.join(", ")}` };
  const lines: Priced[] = items.map((line) => {
    const product = menuById.get(line.productId)!;
    const modPrice = (line.modifiers ?? []).reduce((sum, m) => sum + (typeof m.priceDelta === "number" ? m.priceDelta : 0), 0);
    const recipe = (Array.isArray(product.RecipeIngredient) ? product.RecipeIngredient : []) as { inventoryItemId: string; quantity: number }[];
    return { line, name: product.name, unitPrice: Number(product.price) + modPrice, stationId: product.stationId, recipe: recipe.map((r) => ({ inventoryItemId: r.inventoryItemId, quantity: Number(r.quantity) })) };
  });
  return { ok: true, lines };
}

async function applyInventoryDelta(delta: Map<string, number>, ctx: { orderId: string; sign: 1 | -1; reason: string }) {
  for (const [inventoryItemId, qty] of delta) {
    if (qty <= 0) continue;
    const { data: item } = await supabase.from("InventoryItem").select("stock").eq("id", inventoryItemId).maybeSingle();
    const current = Number(item?.stock ?? 0);
    const newStock = ctx.sign < 0 ? Math.max(0, current - qty) : current + qty;
    await supabase.from("InventoryItem").update({ stock: newStock }).eq("id", inventoryItemId);
    await supabase.from("InventoryMovement").insert({ inventoryItemId, delta: qty * ctx.sign, reason: ctx.reason, orderId: ctx.orderId });
  }
}

async function nextOrderNumber(): Promise<string> {
  const { data: rows } = await supabase.from("Order").select("number").like("number", "#%");
  const nums = (rows ?? []).map((r) => { const m = /^#(\d+)$/.exec(r.number); return m ? parseInt(m[1]!, 10) : 0; });
  const top = nums.length > 0 ? Math.max(...nums) : ORDER_NUMBER_BASE;
  let candidate = Math.max(top + 1, ORDER_NUMBER_BASE + 1);
  for (let attempt = 0; attempt < 50; attempt++) {
    const { data: taken } = await supabase.from("Order").select("id").eq("number", `#${candidate}`).maybeSingle();
    if (!taken) return `#${candidate}`;
    candidate += 1;
  }
  throw new Error("Could not allocate a unique order number");
}

async function maybeSubmitToBra(orderId: string): Promise<string | null> {
  try {
    const { data: cfg } = await supabase.from("FiscalConfig").select("enabled, autoSubmit, mode").eq("id", "default").maybeSingle();
    if (!cfg?.enabled || !cfg.autoSubmit || cfg.mode === "disabled") return null;
    const result = await submitInvoiceToBraAction(orderId);
    return result.ok ? result.data.fiscalInvoiceNumber : null;
  } catch (err) {
    console.error("Auto-submit to BRA failed", err);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────
// Place a held order
// ──────────────────────────────────────────────────────────────

export type PlaceOrderInput = {
  items: CheckoutItem[]; channel: OrderChannel; tableId?: string; guests?: number;
  note?: string; discountPct: number; taxRate: number;
  customerName?: string; customerPhone?: string; assignedStaffId?: string | null;
  prepay?: { payment: PaymentMethod; paymentChannelId: string };
};

export type PlaceOrderResult =
  | { ok: true; orderId: string; orderNumber: string; total: number; paid?: boolean; receiptNumber?: string; fiscalInvoiceNumber?: string }
  | { ok: false; error: string };

export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!input.items.length) return { ok: false, error: "Cart is empty" };
  if (input.discountPct < 0 || input.discountPct > 100) return { ok: false, error: "Invalid discount" };
  if (input.taxRate < 0 || input.taxRate > 1) return { ok: false, error: "Invalid tax rate" };
  if (input.channel === "dine-in" && !input.tableId) {
    return { ok: false, error: "Pick a table before placing a dine-in order" };
  }

  const isDineIn = input.channel === "dine-in" && !!input.tableId;
  const requestedGuests = isDineIn ? Math.max(1, Math.floor(input.guests ?? 1)) : 0;

  if (isDineIn) {
    const { data: table } = await supabase.from("Table").select("id, name, capacity, occupancy").eq("id", input.tableId!).maybeSingle();
    if (!table) return { ok: false, error: "Table not found" };
    const free = Math.max(0, table.capacity - table.occupancy);
    if (requestedGuests > free) {
      return { ok: false, error: free === 0 ? `${table.name} is full (${table.capacity}/${table.capacity})` : `${table.name} only has ${free} seat${free === 1 ? "" : "s"} free` };
    }
  }

  const session = await getServerSession();
  const priced = await priceCart(input.items);
  if (!priced.ok) return priced;

  const subtotal = sumPriced(priced.lines);
  const discount = round2(subtotal * (input.discountPct / 100));
  const tax = round2((subtotal - discount) * input.taxRate);
  const total = round2(subtotal - discount + tax);

  const prepay = input.prepay;
  let prepayChannelId: string | null = null;
  if (prepay) {
    if (!PAYMENT_METHODS.includes(prepay.payment)) return { ok: false, error: "Invalid payment method" };
    const { data: channel } = await supabase.from("PaymentChannel").select("id, archived, kind").eq("id", prepay.paymentChannelId).maybeSingle();
    if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
    if (channel.kind !== prepay.payment) return { ok: false, error: "Payment method doesn't match the selected channel" };
    prepayChannelId = channel.id;
  }

  let assignedStaffId: string | null = null;
  if (input.assignedStaffId) {
    const { data: assignee } = await supabase.from("User").select("id").eq("id", input.assignedStaffId).maybeSingle();
    assignedStaffId = assignee?.id ?? null;
  }

  const ingredientDelta = collectIngredientDelta(priced.lines);
  const stationIds = Array.from(new Set(priced.lines.map((p) => p.stationId)));
  const orderNumber = await nextOrderNumber();

  try {
    const { data: created, error: orderError } = await supabase.from("Order").insert({
      number: orderNumber, status: "pending", channel: input.channel,
      customerName: input.customerName?.trim() || null, customerPhone: input.customerPhone?.trim() || null,
      tableId: input.tableId ?? null, guests: requestedGuests,
      staffId: session?.user.id ?? null, assignedStaffId,
      subtotal: round2(subtotal), tax, tip: null, discount: discount > 0 ? discount : null, total,
      payment: prepay ? prepay.payment : null, paymentChannelId: prepayChannelId,
      paidAt: prepay ? new Date().toISOString() : null, notes: input.note?.trim() || null,
    }).select("id, number").single();
    if (orderError) throw orderError;

    await supabase.from("OrderItem").insert(priced.lines.map((p) => ({ orderId: created.id, ...toOrderItemCreate(p) })));
    await supabase.from("KitchenTicket").insert(stationIds.map((stationId) => ({ orderId: created.id, stationId, status: "pending" })));

    if (isDineIn) {
      const { data: t } = await supabase.from("Table").select("occupancy").eq("id", input.tableId!).single();
      await supabase.from("Table").update({ occupancy: Number(t?.occupancy ?? 0) + requestedGuests }).eq("id", input.tableId!);
    }

    await applyInventoryDelta(ingredientDelta, { orderId: created.id, sign: -1, reason: `Placed via order ${orderNumber}` });

    if (prepayChannelId && total > 0) {
      const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", prepayChannelId).single();
      await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) + total }).eq("id", prepayChannelId);
    }

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    if (isDineIn) revalidatePath("/pos");

    await publish({ type: "order.placed", orderId: created.id, orderNumber: created.number });

    void userIdsWithPermission("kitchen.view").then((userIds) =>
      sendPushInBackground(userIds, {
        title: `New order · ${created.number}`,
        body: `${priced.lines.reduce((s, p) => s + p.line.quantity, 0)} items · ${input.channel}`,
        url: "/kitchen", tag: "order.placed",
      }),
    );

    const itemCount = priced.lines.reduce((s, p) => s + p.line.quantity, 0);
    await logActivity({ type: "order", title: `Order ${created.number} started`, description: `${itemCount} item${itemCount === 1 ? "" : "s"} · ${input.channel}`, orderId: created.id });

    let fiscalInvoiceNumber: string | undefined;
    if (prepay) {
      await publish({ type: "order.paid", orderId: created.id });
      await logActivity({ type: "order", title: `Order ${created.number} paid`, description: `${prepay.payment} · Rs. ${total.toLocaleString()} · prepaid at placement`, orderId: created.id, metadata: { payment: prepay.payment, total, prepaid: true } });
      try { fiscalInvoiceNumber = (await maybeSubmitToBra(created.id)) ?? undefined; } catch { /* swallow */ }
    }

    return { ok: true, orderId: created.id, orderNumber: created.number, total, paid: prepay ? true : undefined, receiptNumber: prepay ? receiptNumberFor(created.number) : undefined, fiscalInvoiceNumber };
  } catch (err) {
    console.error("placeOrderAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to place order" };
  }
}

// ──────────────────────────────────────────────────────────────
// Append items to an existing held order
// ──────────────────────────────────────────────────────────────

export async function addItemsToHeldOrderAction(
  orderId: string,
  items: CheckoutItem[],
): Promise<PlaceOrderResult> {
  if (!orderId) return { ok: false, error: "Missing order id" };
  if (!items.length) return { ok: false, error: "Nothing to add" };

  const { data: order } = await supabase.from("Order").select("id, number, status, paidAt, discount, subtotal, tax").eq("id", orderId).maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Order is already paid" };
  if (order.status === "cancelled" || order.status === "refunded") return { ok: false, error: "Order is no longer open" };

  const priced = await priceCart(items);
  if (!priced.ok) return priced;

  const existingSubtotal = Number(order.subtotal);
  const existingTax = Number(order.tax);
  const existingDiscount = Number(order.discount ?? 0);
  const taxRate = existingSubtotal - existingDiscount > 0 ? existingTax / (existingSubtotal - existingDiscount) : 0;
  const discountPct = existingSubtotal > 0 ? (existingDiscount / existingSubtotal) * 100 : 0;

  const addedSubtotal = sumPriced(priced.lines);
  const nextSubtotal = round2(existingSubtotal + addedSubtotal);
  const nextDiscount = round2(nextSubtotal * (discountPct / 100));
  const nextTax = round2((nextSubtotal - nextDiscount) * taxRate);
  const nextTotal = round2(nextSubtotal - nextDiscount + nextTax);

  const ingredientDelta = collectIngredientDelta(priced.lines);
  const newStationIds = Array.from(new Set(priced.lines.map((p) => p.stationId)));

  try {
    await supabase.from("Order").update({ subtotal: nextSubtotal, discount: nextDiscount > 0 ? nextDiscount : null, tax: nextTax, total: nextTotal }).eq("id", order.id);
    await supabase.from("OrderItem").insert(priced.lines.map((p) => ({ orderId: order.id, ...toOrderItemCreate(p) })));

    for (const stationId of newStationIds) {
      const { data: existing } = await supabase.from("KitchenTicket").select("id, status").eq("orderId", order.id).eq("stationId", stationId).maybeSingle();
      if (!existing) {
        await supabase.from("KitchenTicket").insert({ orderId: order.id, stationId, status: "pending" });
      } else if (existing.status !== "pending" && existing.status !== "preparing") {
        await supabase.from("KitchenTicket").update({ status: "pending" }).eq("id", existing.id);
      }
    }

    const { data: allTickets } = await supabase.from("KitchenTicket").select("status").eq("orderId", order.id);
    const activeTickets = (allTickets ?? []).filter((t) => t.status !== "cancelled" && t.status !== "served");
    const nextOrderStatus = activeTickets.length === 0 ? "pending"
      : activeTickets.every((t) => t.status === "ready") ? "ready"
      : activeTickets.some((t) => t.status === "preparing") ? "preparing"
      : "pending";
    await supabase.from("Order").update({ status: nextOrderStatus }).eq("id", order.id);

    await applyInventoryDelta(ingredientDelta, { orderId: order.id, sign: -1, reason: `Added to order ${order.number}` });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");

    await publish({ type: "order.updated", orderId: order.id });

    const addedQty = priced.lines.reduce((s, p) => s + p.line.quantity, 0);
    await logActivity({ type: "order", title: `Items added to ${order.number}`, description: `+${addedQty} item${addedQty === 1 ? "" : "s"}`, orderId: order.id });

    return { ok: true, orderId: order.id, orderNumber: order.number, total: nextTotal };
  } catch (err) {
    console.error("addItemsToHeldOrderAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to add items" };
  }
}

// ──────────────────────────────────────────────────────────────
// Cancel a held order
// ──────────────────────────────────────────────────────────────

export type CancelHeldOrderResult = { ok: true } | { ok: false; error: string };

export async function cancelHeldOrderAction(orderId: string, reason?: string): Promise<CancelHeldOrderResult> {
  if (!orderId) return { ok: false, error: "Missing order id" };
  const { data: order } = await supabase.from("Order").select("id, number, status, paidAt, notes, tableId, guests").eq("id", orderId).maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Paid orders can't be cancelled" };
  if (order.status === "cancelled") return { ok: true };
  if (order.status === "refunded") return { ok: false, error: "Order is already refunded" };

  const { data: consumed } = await supabase.from("InventoryMovement").select("inventoryItemId, delta").eq("orderId", order.id).lt("delta", 0);
  const restoreByItem = new Map<string, number>();
  for (const m of consumed ?? []) {
    restoreByItem.set(m.inventoryItemId, (restoreByItem.get(m.inventoryItemId) ?? 0) + Math.abs(Number(m.delta)));
  }

  try {
    const updatedNotes = reason?.trim()
      ? [order.notes, `Cancelled: ${reason.trim()}`].filter(Boolean).join("\n")
      : order.notes;
    await supabase.from("Order").update({ status: "cancelled", notes: updatedNotes }).eq("id", order.id);
    await supabase.from("KitchenTicket").update({ status: "cancelled" }).eq("orderId", order.id).not("status", "eq", "cancelled");

    for (const [inventoryItemId, qty] of restoreByItem) {
      const { data: item } = await supabase.from("InventoryItem").select("stock").eq("id", inventoryItemId).maybeSingle();
      await supabase.from("InventoryItem").update({ stock: Number(item?.stock ?? 0) + qty }).eq("id", inventoryItemId);
      await supabase.from("InventoryMovement").insert({ inventoryItemId, delta: qty, reason: `Cancelled order ${order.number}`, orderId: order.id });
    }

    if (order.tableId && order.guests > 0) {
      const { data: t } = await supabase.from("Table").select("occupancy").eq("id", order.tableId).maybeSingle();
      await supabase.from("Table").update({ occupancy: Math.max(0, Number(t?.occupancy ?? 0) - order.guests) }).eq("id", order.tableId);
    }

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");
    if (order.tableId) revalidatePath("/pos");

    await publish({ type: "order.cancelled", orderId: order.id });
    await logActivity({ type: "order", title: `Order ${order.number} cancelled`, description: reason?.trim() || "Cancelled before payment · inventory restored", orderId: order.id });

    return { ok: true };
  } catch (err) {
    console.error("cancelHeldOrderAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to cancel" };
  }
}

// ──────────────────────────────────────────────────────────────
// Take payment and finalise the order
// ──────────────────────────────────────────────────────────────

export type PayOrderInput = { orderId: string; payment: PaymentMethod; paymentChannelId?: string | null; tip?: number };

export type PayOrderResult =
  | { ok: true; orderId: string; orderNumber: string; receiptNumber: string; total: number; fiscalInvoiceNumber?: string }
  | { ok: false; error: string };

export async function payOrderAction(input: PayOrderInput): Promise<PayOrderResult> {
  if (!input.orderId) return { ok: false, error: "Missing order id" };
  if (!PAYMENT_METHODS.includes(input.payment)) return { ok: false, error: "Invalid payment method" };
  const tipAmount = input.tip != null && Number.isFinite(input.tip) && input.tip >= 0 ? round2(input.tip) : 0;

  const { data: order } = await supabase.from("Order").select("id, number, status, paidAt, subtotal, tax, discount, tableId, guests").eq("id", input.orderId).maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status === "cancelled" || order.status === "refunded") return { ok: false, error: "Order is no longer payable" };
  if (order.paidAt) {
    return { ok: true, orderId: order.id, orderNumber: order.number, receiptNumber: receiptNumberFor(order.number), total: round2(Number(order.subtotal) - Number(order.discount ?? 0) + Number(order.tax)) };
  }
  if (order.status !== "ready") {
    return { ok: false, error: `Order is ${order.status}. Wait for the kitchen to mark it ready before collecting payment.` };
  }

  const subtotal = Number(order.subtotal);
  const discount = Number(order.discount ?? 0);
  const tax = Number(order.tax);
  const total = round2(subtotal - discount + tax + tipAmount);

  let paymentChannelId: string | null = null;
  if (input.paymentChannelId) {
    const { data: channel } = await supabase.from("PaymentChannel").select("id, archived, kind").eq("id", input.paymentChannelId).maybeSingle();
    if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
    if (channel.kind !== input.payment) return { ok: false, error: "Payment method doesn't match the selected channel's kind" };
    paymentChannelId = channel.id;
  }

  try {
    await supabase.from("Order").update({ payment: input.payment, paymentChannelId, paidAt: new Date().toISOString(), tip: tipAmount > 0 ? tipAmount : null, total, status: "completed" }).eq("id", order.id);

    if (order.tableId && order.guests > 0) {
      const { data: t } = await supabase.from("Table").select("occupancy").eq("id", order.tableId).maybeSingle();
      await supabase.from("Table").update({ occupancy: Math.max(0, Number(t?.occupancy ?? 0) - order.guests) }).eq("id", order.tableId);
    }

    if (paymentChannelId && total > 0) {
      const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", paymentChannelId).single();
      await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) + total }).eq("id", paymentChannelId);
    }

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    if (order.tableId) revalidatePath("/pos");

    await publish({ type: "order.paid", orderId: order.id });
    await logActivity({ type: "order", title: `Order ${order.number} paid`, description: `${input.payment} · Rs. ${total.toLocaleString()}`, orderId: order.id, metadata: { payment: input.payment, tip: tipAmount, total } });

    let fiscal: string | undefined;
    try { const r = await maybeSubmitToBra(order.id); fiscal = r ?? undefined; } catch { /* swallow */ }

    return { ok: true, orderId: order.id, orderNumber: order.number, receiptNumber: receiptNumberFor(order.number), total, fiscalInvoiceNumber: fiscal };
  } catch (err) {
    console.error("payOrderAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to pay" };
  }
}

// ──────────────────────────────────────────────────────────────
// Hand off a prepaid order
// ──────────────────────────────────────────────────────────────

export type CompleteOrderResult = { ok: true } | { ok: false; error: string };

export async function completeOrderAction(orderId: string): Promise<CompleteOrderResult> {
  if (!orderId) return { ok: false, error: "Missing order id" };
  const { data: order } = await supabase.from("Order").select("id, number, status, paidAt, tableId, guests").eq("id", orderId).maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status === "cancelled" || order.status === "refunded") return { ok: false, error: "Order is no longer active" };
  if (order.status === "completed") return { ok: true };
  if (!order.paidAt) return { ok: false, error: "Order isn't paid yet — collect payment to complete it." };

  try {
    await supabase.from("Order").update({ status: "completed" }).eq("id", order.id);
    if (order.tableId && order.guests > 0) {
      const { data: t } = await supabase.from("Table").select("occupancy").eq("id", order.tableId).maybeSingle();
      await supabase.from("Table").update({ occupancy: Math.max(0, Number(t?.occupancy ?? 0) - order.guests) }).eq("id", order.tableId);
    }
    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/dashboard");
    await publish({ type: "order.updated", orderId: order.id });
    await logActivity({ type: "order", title: `Order ${order.number} handed off`, description: "Marked picked up / delivered", orderId: order.id });
    return { ok: true };
  } catch (err) {
    console.error("completeOrderAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to complete order" };
  }
}

export const createOrderAction = placeOrderAction;
export type CheckoutResult = PlaceOrderResult;
