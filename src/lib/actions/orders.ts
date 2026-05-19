"use server";

import { revalidatePath } from "next/cache";

import { submitInvoiceToBraAction } from "@/lib/actions/fiscal";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrderById } from "@/lib/queries/orders";
import { publish } from "@/lib/realtime/bus";
import { sendPushInBackground, userIdsWithPermission } from "@/lib/push/server";
import type { Order, OrderChannel, PaymentMethod, ProductModifier } from "@/types";

export type LoadOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

/**
 * Lightweight fetcher used by the POS Pay picker — the cashier picks
 * a held order from the summary list, and the client hydrates the
 * full Order so `TakePaymentDialog` can render line totals + take
 * payment without bouncing through /orders.
 */
export async function loadOrderForPaymentAction(
  orderId: string,
): Promise<LoadOrderResult> {
  const order = await getOrderById(orderId);
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Order is already paid" };
  if (
    order.status === "cancelled" ||
    order.status === "refunded" ||
    order.status === "completed"
  ) {
    return { ok: false, error: `Order is ${order.status} — cannot collect` };
  }
  if (order.status !== "ready") {
    return {
      ok: false,
      error: `Order is ${order.status} — cashier can collect only after the kitchen marks it ready.`,
    };
  }
  return { ok: true, order };
}

/**
 * Lifecycle (see also README "POS workflow"):
 *
 *   placeOrderAction → Order(status=pending, paidAt=null, payment=null)
 *                       + kitchen tickets (pending)
 *                       + inventory deducted
 *                       BRA submission is deferred.
 *
 *   addItemsToHeldOrderAction → appends OrderItems + new station tickets
 *                                + deducts inventory for the additions.
 *
 *   cancelHeldOrderAction → status=cancelled, tickets=cancelled
 *                            (still visible in the kitchen until a cook
 *                            dismisses them), inventory restored, order
 *                            no longer payable.
 *
 *   payOrderAction → captures payment, stamps paidAt, finalises totals
 *                     including any tip, kicks BRA auto-submit. Status
 *                     advances to "completed" so the order leaves the
 *                     "active" lists.
 */

type CheckoutItem = {
  productId: string;
  quantity: number;
  modifiers?: ProductModifier[];
  note?: string;
};

type Priced = {
  line: CheckoutItem;
  name: string;
  unitPrice: number;
  stationId: string;
  recipe: { inventoryItemId: string; quantity: number }[];
};

const ORDER_NUMBER_BASE = 5800;

// ──────────────────────────────────────────────────────────────
// Place a held order
// ──────────────────────────────────────────────────────────────

export type PlaceOrderInput = {
  items: CheckoutItem[];
  channel: OrderChannel;
  tableId?: string;
  /** Party size for dine-in (defaults to 1). Used to bump the
   * table's occupancy by exactly this much; cleared on pay/cancel. */
  guests?: number;
  note?: string;
  /** 0–100, cashier-applied discount percentage. */
  discountPct: number;
  /** Decimal between 0 and 1, e.g. 0.085. */
  taxRate: number;
  customerName?: string;
  customerPhone?: string;
};

export type PlaceOrderResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      total: number;
    }
  | { ok: false; error: string };

export async function placeOrderAction(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  if (!input.items.length) return { ok: false, error: "Cart is empty" };
  if (input.discountPct < 0 || input.discountPct > 100) {
    return { ok: false, error: "Invalid discount" };
  }
  if (input.taxRate < 0 || input.taxRate > 1) {
    return { ok: false, error: "Invalid tax rate" };
  }

  // Dine-in must always carry a table — otherwise the order has no
  // surface to sit on and the floor team can't find it. Surfaced as
  // a clean reject so the client toasts the right thing rather than
  // silently downgrading to a tableless order.
  if (input.channel === "dine-in" && !input.tableId) {
    return { ok: false, error: "Pick a table before placing a dine-in order" };
  }

  // Normalise guests: dine-in defaults to 1; other channels store 0.
  const isDineIn = input.channel === "dine-in" && !!input.tableId;
  const requestedGuests = isDineIn ? Math.max(1, Math.floor(input.guests ?? 1)) : 0;

  // Capacity guard — block over-seating with a clear message.
  if (isDineIn) {
    const table = await prisma.table.findUnique({
      where: { id: input.tableId! },
      select: { id: true, name: true, capacity: true, occupancy: true },
    });
    if (!table) return { ok: false, error: "Table not found" };
    const free = Math.max(0, table.capacity - table.occupancy);
    if (requestedGuests > free) {
      return {
        ok: false,
        error:
          free === 0
            ? `${table.name} is full (${table.capacity}/${table.capacity})`
            : `${table.name} only has ${free} seat${free === 1 ? "" : "s"} free`,
      };
    }
  }

  const session = await getServerSession();
  const priced = await priceCart(input.items);
  if (!priced.ok) return priced;

  const subtotal = sumPriced(priced.lines);
  const discount = round2(subtotal * (input.discountPct / 100));
  const tax = round2((subtotal - discount) * input.taxRate);
  const total = round2(subtotal - discount + tax);

  const ingredientDelta = collectIngredientDelta(priced.lines);
  const stationIds = Array.from(new Set(priced.lines.map((p) => p.stationId)));
  const orderNumber = await nextOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          number: orderNumber,
          status: "pending",
          channel: input.channel,
          customerName: input.customerName?.trim() || null,
          customerPhone: input.customerPhone?.trim() || null,
          tableId: input.tableId ?? null,
          guests: requestedGuests,
          staffId: session?.user.id ?? null,
          subtotal: round2(subtotal),
          tax,
          tip: null,
          discount: discount > 0 ? discount : null,
          total,
          payment: null,
          paidAt: null,
          notes: input.note?.trim() || null,
          items: { create: priced.lines.map(toOrderItemCreate) },
          tickets: {
            create: stationIds.map((stationId) => ({
              stationId,
              status: "pending" as const,
            })),
          },
        },
      });
      if (isDineIn) {
        // Atomically bump the table's occupancy — the capacity guard
        // above keeps us within bounds, and doing it inside the
        // transaction means the row only exists if seats were taken.
        await tx.table.update({
          where: { id: input.tableId! },
          data: { occupancy: { increment: requestedGuests } },
        });
      }
      await applyInventoryDelta(tx, ingredientDelta, {
        orderId: created.id,
        sign: -1,
        reason: `Placed via order ${orderNumber}`,
      });
      return created;
    });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    if (isDineIn) revalidatePath("/pos");

    publish({
      type: "order.placed",
      orderId: order.id,
      orderNumber: order.number,
    });

    // Ping every device whose role can see /kitchen so the kitchen
    // tablet wakes the screen on a new order even if Brewline's tab
    // isn't focused. Fire-and-forget so push latency doesn't sit on
    // the cashier's response path.
    void userIdsWithPermission("kitchen.view").then((userIds) =>
      sendPushInBackground(userIds, {
        title: `New order · ${order.number}`,
        body: `${priced.lines.reduce((s, p) => s + p.line.quantity, 0)} item${priced.lines.reduce((s, p) => s + p.line.quantity, 0) === 1 ? "" : "s"} · ${input.channel}${input.tableId ? ` · table` : ""}`,
        url: "/kitchen",
        tag: "order.placed",
      }),
    );

    const itemCount = priced.lines.reduce((s, p) => s + p.line.quantity, 0);
    await logActivity({
      type: "order",
      title: `Order ${order.number} started`,
      description: `${itemCount} item${itemCount === 1 ? "" : "s"} · ${input.channel}${
        input.tableId ? ` · table ${input.tableId}${isDineIn ? ` · ${requestedGuests} guest${requestedGuests === 1 ? "" : "s"}` : ""}` : ""
      }`,
      orderId: order.id,
    });

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      total,
    };
  } catch (err) {
    console.error("placeOrderAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to place order",
    };
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

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      number: true,
      status: true,
      paidAt: true,
      discount: true,
      subtotal: true,
      tax: true,
    },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Order is already paid" };
  if (order.status === "cancelled" || order.status === "refunded") {
    return { ok: false, error: "Order is no longer open" };
  }

  const priced = await priceCart(items);
  if (!priced.ok) return priced;

  // Recompute totals from existing subtotal + the additions, preserving
  // the existing discount percentage. We keep tax rate fresh from the
  // recompute so a settings change between adds doesn't drift the math.
  const existingSubtotal = toNumber(order.subtotal);
  const existingTax = toNumber(order.tax);
  const existingDiscount = toNumber(order.discount);
  const taxRate =
    existingSubtotal - existingDiscount > 0
      ? existingTax / (existingSubtotal - existingDiscount)
      : 0;
  const discountPct =
    existingSubtotal > 0 ? (existingDiscount / existingSubtotal) * 100 : 0;

  const addedSubtotal = sumPriced(priced.lines);
  const nextSubtotal = round2(existingSubtotal + addedSubtotal);
  const nextDiscount = round2(nextSubtotal * (discountPct / 100));
  const nextTax = round2((nextSubtotal - nextDiscount) * taxRate);
  const nextTotal = round2(nextSubtotal - nextDiscount + nextTax);

  const ingredientDelta = collectIngredientDelta(priced.lines);
  const newStationIds = Array.from(new Set(priced.lines.map((p) => p.stationId)));

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          subtotal: nextSubtotal,
          discount: nextDiscount > 0 ? nextDiscount : null,
          tax: nextTax,
          total: nextTotal,
          items: { create: priced.lines.map(toOrderItemCreate) },
        },
      });

      // For each station the additions touch, either create a fresh
      // ticket or reopen an existing one that the kitchen had served
      // (so cooks see "+ items added" rather than nothing).
      for (const stationId of newStationIds) {
        const existing = await tx.kitchenTicket.findUnique({
          where: { orderId_stationId: { orderId: order.id, stationId } },
        });
        if (!existing) {
          await tx.kitchenTicket.create({
            data: { orderId: order.id, stationId, status: "pending" },
          });
        } else if (
          existing.status === "served" ||
          existing.status === "cancelled"
        ) {
          await tx.kitchenTicket.update({
            where: { id: existing.id },
            data: { status: "pending" },
          });
        }
      }

      await applyInventoryDelta(tx, ingredientDelta, {
        orderId: order.id,
        sign: -1,
        reason: `Added to order ${order.number}`,
      });
    });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");

    publish({ type: "order.updated", orderId: order.id });

    const addedQty = priced.lines.reduce((s, p) => s + p.line.quantity, 0);
    await logActivity({
      type: "order",
      title: `Items added to ${order.number}`,
      description: `+${addedQty} item${addedQty === 1 ? "" : "s"}`,
      orderId: order.id,
    });

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      total: nextTotal,
    };
  } catch (err) {
    console.error("addItemsToHeldOrderAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add items",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Cancel a held order
// ──────────────────────────────────────────────────────────────

export type CancelHeldOrderResult =
  | { ok: true }
  | { ok: false; error: string };

export async function cancelHeldOrderAction(
  orderId: string,
  reason?: string,
): Promise<CancelHeldOrderResult> {
  if (!orderId) return { ok: false, error: "Missing order id" };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      number: true,
      status: true,
      paidAt: true,
      notes: true,
      tableId: true,
      guests: true,
    },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paidAt) return { ok: false, error: "Paid orders can't be cancelled" };
  if (order.status === "cancelled") return { ok: true };
  if (order.status === "refunded") {
    return { ok: false, error: "Order is already refunded" };
  }

  // Restore inventory for every consumption movement we wrote against
  // this order. Net out by inventory item so a re-stock entry has the
  // right magnitude.
  const consumed = await prisma.inventoryMovement.findMany({
    where: { orderId: order.id, delta: { lt: 0 } },
    select: { inventoryItemId: true, delta: true },
  });
  const restoreByItem = new Map<string, number>();
  for (const m of consumed) {
    const restore = -toNumber(m.delta); // positive
    restoreByItem.set(
      m.inventoryItemId,
      (restoreByItem.get(m.inventoryItemId) ?? 0) + restore,
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "cancelled",
          notes: reason?.trim()
            ? [order.notes, `Cancelled: ${reason.trim()}`]
                .filter(Boolean)
                .join("\n")
            : order.notes,
        },
      });
      await tx.kitchenTicket.updateMany({
        where: { orderId: order.id, status: { not: "cancelled" } },
        data: { status: "cancelled" },
      });
      for (const [inventoryItemId, qty] of restoreByItem) {
        await tx.inventoryItem.update({
          where: { id: inventoryItemId },
          data: { stock: { increment: qty } },
        });
        await tx.inventoryMovement.create({
          data: {
            inventoryItemId,
            delta: qty,
            reason: `Cancelled order ${order.number}`,
            orderId: order.id,
          },
        });
      }
      // Free the seats the cancelled order had been holding.
      if (order.tableId && order.guests > 0) {
        await tx.$executeRaw`UPDATE "Table" SET "occupancy" = GREATEST(0, "occupancy" - ${order.guests}) WHERE "id" = ${order.tableId}`;
      }
    });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");
    if (order.tableId) revalidatePath("/pos");

    publish({ type: "order.cancelled", orderId: order.id });

    await logActivity({
      type: "order",
      title: `Order ${order.number} cancelled`,
      description: reason?.trim() || "Cancelled before payment · inventory restored",
      orderId: order.id,
    });

    return { ok: true };
  } catch (err) {
    console.error("cancelHeldOrderAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to cancel",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Take payment and finalise the order
// ──────────────────────────────────────────────────────────────

export type PayOrderInput = {
  orderId: string;
  payment: PaymentMethod;
  tip?: number;
};

export type PayOrderResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      receiptNumber: string;
      total: number;
      fiscalInvoiceNumber?: string;
    }
  | { ok: false; error: string };

const PAYMENT_METHODS: readonly PaymentMethod[] = [
  "card",
  "cash",
  "wallet",
  "online",
];

export async function payOrderAction(
  input: PayOrderInput,
): Promise<PayOrderResult> {
  if (!input.orderId) return { ok: false, error: "Missing order id" };
  if (!PAYMENT_METHODS.includes(input.payment)) {
    return { ok: false, error: "Invalid payment method" };
  }
  const tipAmount =
    input.tip != null && Number.isFinite(input.tip) && input.tip >= 0
      ? round2(input.tip)
      : 0;

  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: {
      id: true,
      number: true,
      status: true,
      paidAt: true,
      subtotal: true,
      tax: true,
      discount: true,
      tableId: true,
      guests: true,
    },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status === "cancelled" || order.status === "refunded") {
    return { ok: false, error: "Order is no longer payable" };
  }
  if (order.paidAt) {
    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      receiptNumber: receiptNumberFor(order.number),
      total: round2(toNumber(order.subtotal) - toNumber(order.discount) + toNumber(order.tax)),
    };
  }
  if (order.status !== "ready") {
    return {
      ok: false,
      error: `Order is ${order.status}. Wait for the kitchen to mark it ready before collecting payment.`,
    };
  }

  const subtotal = toNumber(order.subtotal);
  const discount = toNumber(order.discount);
  const tax = toNumber(order.tax);
  const total = round2(subtotal - discount + tax + tipAmount);

  try {
    // Same transaction: stamp the order paid AND free the seats it
    // occupied. occupancy is clamped to 0 via `Math.max` in raw SQL
    // so an out-of-band manual reset earlier in the day can't push
    // us negative.
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          payment: input.payment,
          paidAt: new Date(),
          tip: tipAmount > 0 ? tipAmount : null,
          total,
          status: "completed",
        },
      });
      if (order.tableId && order.guests > 0) {
        await tx.$executeRaw`UPDATE "Table" SET "occupancy" = GREATEST(0, "occupancy" - ${order.guests}) WHERE "id" = ${order.tableId}`;
      }
    });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/dashboard");
    if (order.tableId) revalidatePath("/pos");

    publish({ type: "order.paid", orderId: order.id });

    await logActivity({
      type: "order",
      title: `Order ${order.number} paid`,
      description: `${input.payment} · Rs. ${total.toLocaleString()}`,
      orderId: order.id,
      metadata: { payment: input.payment, tip: tipAmount, total },
    });

    // BRA auto-submit happens once we've actually collected payment.
    // Fire-and-(non-strictly)-forget — the order is already paid, any
    // BRA outage just gets logged + retryable from the drawer.
    let fiscal: string | undefined;
    try {
      const result = await maybeSubmitToBra(order.id);
      fiscal = result ?? undefined;
    } catch {
      // swallow; logged inside maybeSubmitToBra
    }

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      receiptNumber: receiptNumberFor(order.number),
      total,
      fiscalInvoiceNumber: fiscal,
    };
  } catch (err) {
    console.error("payOrderAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to pay",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

async function priceCart(
  items: CheckoutItem[],
): Promise<
  | { ok: true; lines: Priced[] }
  | { ok: false; error: string }
> {
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: productIds } },
    include: { recipe: true },
  });
  const menuById = new Map(menuItems.map((m) => [m.id, m]));
  const missing = productIds.filter((id) => !menuById.has(id));
  if (missing.length) {
    return { ok: false, error: `Unknown menu item(s): ${missing.join(", ")}` };
  }

  const lines: Priced[] = items.map((line) => {
    const product = menuById.get(line.productId)!;
    const modPrice = (line.modifiers ?? []).reduce(
      (sum, m) => sum + (typeof m.priceDelta === "number" ? m.priceDelta : 0),
      0,
    );
    return {
      line,
      name: product.name,
      unitPrice: Number(product.price) + modPrice,
      stationId: product.stationId,
      recipe: product.recipe.map((r) => ({
        inventoryItemId: r.inventoryItemId,
        quantity: Number(r.quantity),
      })),
    };
  });
  return { ok: true, lines };
}

function sumPriced(lines: Priced[]): number {
  return lines.reduce((sum, p) => sum + p.unitPrice * p.line.quantity, 0);
}

function collectIngredientDelta(lines: Priced[]): Map<string, number> {
  const delta = new Map<string, number>();
  for (const p of lines) {
    for (const r of p.recipe) {
      delta.set(
        r.inventoryItemId,
        (delta.get(r.inventoryItemId) ?? 0) + r.quantity * p.line.quantity,
      );
    }
  }
  return delta;
}

function toOrderItemCreate(p: Priced) {
  return {
    menuItemId: p.line.productId,
    name: p.name,
    quantity: p.line.quantity,
    unitPrice: p.unitPrice,
    modifiers:
      p.line.modifiers && p.line.modifiers.length
        ? p.line.modifiers.map((m) => m.name)
        : undefined,
    note: p.line.note ?? null,
  };
}

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function applyInventoryDelta(
  tx: TxClient,
  delta: Map<string, number>,
  ctx: { orderId: string; sign: 1 | -1; reason: string },
): Promise<void> {
  for (const [inventoryItemId, qty] of delta) {
    if (qty <= 0) continue;
    await tx.inventoryItem.update({
      where: { id: inventoryItemId },
      data:
        ctx.sign < 0
          ? { stock: { decrement: qty } }
          : { stock: { increment: qty } },
    });
    await tx.inventoryMovement.create({
      data: {
        inventoryItemId,
        delta: qty * ctx.sign,
        reason: ctx.reason,
        orderId: ctx.orderId,
      },
    });
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
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

function receiptNumberFor(orderNumber: string): string {
  return `BR-${orderNumber.replace(/^#/, "")}`;
}

/**
 * Sequential-ish order numbers without a dedicated sequence table.
 *
 * Uses `MAX(number) + 1` rather than `count + 1` because deleted rows
 * (e.g. cancelled test orders) leave gaps that a count-based scheme
 * doesn't account for — you'd compute an already-taken number and
 * collide on insert. The follow-up `findUnique` loop is a defensive
 * race-guard for the rare case where two cashiers checkout at the
 * exact same moment; on the *very* unlikely persistent collision we
 * throw so the caller surfaces a clear error instead of silently
 * looping on a P2002.
 */
async function nextOrderNumber(): Promise<string> {
  const rows = await prisma.$queryRaw<{ max: number | null }[]>`
    SELECT MAX(CAST(SUBSTRING(number FROM 2) AS INTEGER)) AS max
    FROM "Order"
    WHERE number ~ '^#[0-9]+$'
  `;
  const top = rows[0]?.max ?? ORDER_NUMBER_BASE;
  let candidate = Math.max(top + 1, ORDER_NUMBER_BASE + 1);
  for (let attempt = 0; attempt < 50; attempt++) {
    const taken = await prisma.order.findUnique({
      where: { number: `#${candidate}` },
      select: { id: true },
    });
    if (!taken) return `#${candidate}`;
    candidate += 1;
  }
  throw new Error(
    `Could not allocate a unique order number (50 candidates collided starting from #${top + 1})`,
  );
}

/**
 * Try to push the order to BRA after payment is captured. Short-circuits
 * if fiscal config has auto-submit off or BRA isn't configured. Any
 * failure is intentionally swallowed — the sale is already paid and the
 * failure is captured in FiscalSubmission for retry.
 */
async function maybeSubmitToBra(orderId: string): Promise<string | null> {
  try {
    const cfg = await prisma.fiscalConfig.findUnique({
      where: { id: "default" },
      select: { enabled: true, autoSubmit: true, mode: true },
    });
    if (!cfg?.enabled || !cfg.autoSubmit || cfg.mode === "disabled") return null;
    const result = await submitInvoiceToBraAction(orderId);
    return result.ok ? result.data.fiscalInvoiceNumber : null;
  } catch (err) {
    console.error("Auto-submit to BRA failed", err);
    return null;
  }
}

// Legacy alias for any caller still importing `createOrderAction`.
export const createOrderAction = placeOrderAction;
export type CheckoutResult = PlaceOrderResult;
