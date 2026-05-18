"use server";

import { revalidatePath } from "next/cache";

import { submitInvoiceToBraAction } from "@/lib/actions/fiscal";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderChannel, PaymentMethod, ProductModifier } from "@/types";

/**
 * The cart payload the POS sends server-side at checkout. Modifiers
 * come over with their name only — the price impact is reapplied
 * server-side, so the client can't pad totals.
 */
type CheckoutItem = {
  productId: string;
  quantity: number;
  modifiers?: ProductModifier[];
  note?: string;
};

type CheckoutInput = {
  items: CheckoutItem[];
  channel: OrderChannel;
  payment: PaymentMethod;
  tableId?: string;
  note?: string;
  /** 0–100, the cashier-applied discount percentage. */
  discountPct: number;
  /** Decimal between 0 and 1, e.g. 0.085. */
  taxRate: number;
  customerName?: string;
  customerPhone?: string;
};

export type CheckoutResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      receiptNumber: string;
      total: number;
    }
  | { ok: false; error: string };

const ORDER_NUMBER_BASE = 5800;

export async function createOrderAction(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  if (!input.items.length) {
    return { ok: false, error: "Cart is empty" };
  }
  if (input.discountPct < 0 || input.discountPct > 100) {
    return { ok: false, error: "Invalid discount" };
  }
  if (input.taxRate < 0 || input.taxRate > 1) {
    return { ok: false, error: "Invalid tax rate" };
  }

  const session = await getServerSession();

  // Pull every referenced menu item (with its recipe) in one go so
  // we can validate, price, route to stations, and deduct stock from
  // a single trusted server-side snapshot.
  const productIds = Array.from(new Set(input.items.map((i) => i.productId)));
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: productIds } },
    include: { recipe: true },
  });
  const menuById = new Map(menuItems.map((m) => [m.id, m]));

  const missing = productIds.filter((id) => !menuById.has(id));
  if (missing.length) {
    return { ok: false, error: `Unknown menu item(s): ${missing.join(", ")}` };
  }

  type Priced = {
    line: CheckoutItem;
    name: string;
    unitPrice: number;
    stationId: string;
    recipe: { inventoryItemId: string; quantity: number }[];
  };
  const priced: Priced[] = input.items.map((line) => {
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

  const subtotal = priced.reduce(
    (sum, p) => sum + p.unitPrice * p.line.quantity,
    0,
  );
  const discount = round2(subtotal * (input.discountPct / 100));
  const tax = round2((subtotal - discount) * input.taxRate);
  const total = round2(subtotal - discount + tax);

  // Aggregate per-ingredient consumption across the order so each
  // inventory item is decremented exactly once.
  const ingredientDelta = new Map<string, number>();
  for (const p of priced) {
    for (const r of p.recipe) {
      ingredientDelta.set(
        r.inventoryItemId,
        (ingredientDelta.get(r.inventoryItemId) ?? 0) + r.quantity * p.line.quantity,
      );
    }
  }

  const stationIds = Array.from(new Set(priced.map((p) => p.stationId)));
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
          staffId: session?.user.id ?? null,
          subtotal: round2(subtotal),
          tax,
          tip: null,
          discount: discount > 0 ? discount : null,
          total,
          payment: input.payment,
          notes: input.note?.trim() || null,
          items: {
            create: priced.map((p) => ({
              menuItemId: p.line.productId,
              name: p.name,
              quantity: p.line.quantity,
              unitPrice: p.unitPrice,
              modifiers:
                p.line.modifiers && p.line.modifiers.length
                  ? p.line.modifiers.map((m) => m.name)
                  : undefined,
              note: p.line.note ?? null,
            })),
          },
          tickets: {
            create: stationIds.map((stationId) => ({
              stationId,
              status: "pending" as const,
            })),
          },
        },
      });

      for (const [inventoryItemId, delta] of ingredientDelta) {
        if (delta <= 0) continue;
        await tx.inventoryItem.update({
          where: { id: inventoryItemId },
          data: { stock: { decrement: delta } },
        });
        await tx.inventoryMovement.create({
          data: {
            inventoryItemId,
            delta: -delta,
            reason: `Sold via order ${orderNumber}`,
            orderId: created.id,
          },
        });
      }

      return created;
    });

    revalidatePath("/orders");
    revalidatePath("/kitchen");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    // Fire-and-(non-strictly)-forget submission to BRA when enabled.
    // We await so the receipt-side UI sees the fiscal number, but any
    // network/validation failure is swallowed — the sale itself is
    // already committed and the failure is captured in FiscalSubmission
    // for retry from the order detail drawer.
    await maybeSubmitToBra(order.id);

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      receiptNumber: `BR-${order.number.replace(/^#/, "")}`,
      total,
    };
  } catch (err) {
    console.error("createOrderAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Checkout failed",
    };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Sequential-ish order numbers without a dedicated sequence table.
 * Picks `count + 1 + base` and bumps on conflict to absorb the rare
 * race where two cashiers hit checkout at the exact same moment.
 */
async function nextOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  let candidate = count + 1 + ORDER_NUMBER_BASE;
  for (let attempt = 0; attempt < 5; attempt++) {
    const taken = await prisma.order.findUnique({
      where: { number: `#${candidate}` },
      select: { id: true },
    });
    if (!taken) return `#${candidate}`;
    candidate += 1;
  }
  return `#${candidate}`;
}

/**
 * Try to push the order to BRA after checkout. Short-circuits if
 * fiscal config has auto-submit off or BRA isn't configured. Any
 * failure is intentionally swallowed — the sale must succeed even
 * when BRA is unreachable; the operator can retry from the order
 * detail drawer.
 */
async function maybeSubmitToBra(orderId: string): Promise<void> {
  try {
    const cfg = await prisma.fiscalConfig.findUnique({
      where: { id: "default" },
      select: { enabled: true, autoSubmit: true, mode: true },
    });
    if (!cfg?.enabled || !cfg.autoSubmit || cfg.mode === "disabled") return;
    await submitInvoiceToBraAction(orderId);
  } catch (err) {
    console.error("Auto-submit to BRA failed", err);
  }
}

