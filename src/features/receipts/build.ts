"use client";

/**
 * Adapters that turn the shapes we already query from Postgres
 * (`Order`, `KitchenStation`, `InventoryMovement`-likes) into the
 * plain `*Data` payloads the receipt renderer + ESC/POS + PDF
 * generators all consume. Keeps the dialog call-sites trivial.
 */

import type {
  InventorySlipData,
  KitchenTicketData,
  PaymentReceiptData,
  ReceiptHeader,
  ReceiptLineItem,
} from "@/features/receipts/receipt-models";
import type { Workspace } from "@/lib/queries/workspace";
import type { Order, OrderItem } from "@/types";

function headerFor(
  workspace: Workspace,
  kind: string,
  printedAt: Date = new Date(),
): ReceiptHeader {
  return {
    workspace: {
      name: workspace.name,
      city: workspace.city,
      addressLine: workspace.addressLine,
      taxId: workspace.taxId,
      legalEntity: workspace.legalEntity,
      receiptFooter: workspace.receiptFooter,
      receiptWidth: workspace.receiptWidth,
    },
    kind,
    printedAt: formatDateTime(printedAt, workspace.timezone),
  };
}

function toLineItem(item: OrderItem): ReceiptLineItem {
  return {
    quantity: item.quantity,
    name: item.name,
    amount: item.unitPrice * item.quantity,
    modifiers: item.modifiers && item.modifiers.length > 0 ? item.modifiers : undefined,
    note: item.note,
  };
}

export function buildPaymentReceipt({
  order,
  workspace,
  receiptNumber,
  paymentChannelName,
}: {
  order: Order;
  workspace: Workspace;
  receiptNumber: string;
  paymentChannelName?: string | null;
}): PaymentReceiptData {
  const items = order.items.map(toLineItem);

  const totals: PaymentReceiptData["totals"] = [
    { label: "Subtotal", amount: order.subtotal, muted: true },
  ];
  if (order.discount && order.discount > 0) {
    totals.push({ label: "Discount", amount: -order.discount, muted: true });
  }
  if (order.tax > 0) totals.push({ label: "Tax", amount: order.tax, muted: true });
  if (order.tip && order.tip > 0) totals.push({ label: "Tip", amount: order.tip, muted: true });
  totals.push({ label: "Total", amount: order.total, bold: true });

  return {
    header: headerFor(workspace, "Payment receipt"),
    orderNumber: order.number,
    receiptNumber,
    channel: order.channel,
    table: order.table,
    guests: undefined,
    staff: order.staff,
    customer: order.customer
      ? { name: order.customer.name, phone: order.customer.phone }
      : null,
    items,
    totals,
    payment: order.payment
      ? { method: order.payment, channelName: paymentChannelName ?? null }
      : null,
    fiscalInvoiceNumber: order.fiscalInvoiceNumber ?? null,
    notes: order.notes ?? null,
  };
}

export function buildKitchenTickets({
  order,
  workspace,
  stations,
  /** Routing table: menu item id → station id. The caller usually
   * derives this from `useMenu()` since OrderItem only stores
   * `menuItemId`. Items not found in the map are skipped. */
  routing,
  /** Optional: when set, only build a ticket for these station ids. */
  stationFilter,
}: {
  order: Order;
  workspace: Workspace;
  stations: { id: string; name: string }[];
  routing: Record<string, string>;
  stationFilter?: string[];
}): KitchenTicketData[] {
  const stationById = new Map(stations.map((s) => [s.id, s]));
  const buckets = new Map<string, ReceiptLineItem[]>();
  for (const item of order.items) {
    const stationId = routing[item.productId];
    if (!stationId) continue;
    if (stationFilter && !stationFilter.includes(stationId)) continue;
    const list = buckets.get(stationId) ?? [];
    list.push(toLineItem(item));
    buckets.set(stationId, list);
  }

  return Array.from(buckets.entries()).map(([stationId, items]) => ({
    header: headerFor(
      workspace,
      `Kitchen · ${stationById.get(stationId)?.name ?? stationId}`,
    ),
    orderNumber: order.number,
    channel: order.channel,
    table: order.table,
    guests: undefined,
    stationName: stationById.get(stationId)?.name ?? stationId,
    items,
    placedAt: formatDateTime(new Date(order.createdAt), workspace.timezone),
    notes: order.notes ?? null,
  }));
}

export type InventorySlipInput = {
  workspace: Workspace;
  movementId: string;
  direction: "IN" | "OUT";
  recordedAt: Date | string;
  staff?: string | null;
  supplier?: string | null;
  reason?: string | null;
  items: {
    name: string;
    quantity: number;
    unit: string;
    unitCost?: number | null;
  }[];
  total?: number | null;
  notes?: string | null;
};

export function buildInventorySlip(input: InventorySlipInput): InventorySlipData {
  const recordedAt =
    input.recordedAt instanceof Date
      ? input.recordedAt
      : new Date(input.recordedAt);
  return {
    header: headerFor(
      input.workspace,
      input.direction === "IN" ? "Stock received" : "Stock out",
      recordedAt,
    ),
    direction: input.direction,
    movementId: input.movementId,
    recordedAt: formatDateTime(recordedAt, input.workspace.timezone),
    staff: input.staff ?? null,
    supplier: input.supplier ?? null,
    reason: input.reason ?? null,
    items: input.items,
    total: input.total ?? null,
    notes: input.notes ?? null,
  };
}

// ──────────────────────────────────────────────────────────────
// Formatting
// ──────────────────────────────────────────────────────────────

function formatDateTime(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone || undefined,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
