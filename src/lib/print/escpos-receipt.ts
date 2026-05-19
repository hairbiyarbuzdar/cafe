"use client";

import { BRAND } from "@/constants/nav";
import { formatCurrency } from "@/lib/utils";
import { ALIGN_CENTER, ALIGN_LEFT, EscPosBuilder, columnsFor } from "@/lib/print/escpos";
import type {
  InventorySlipData,
  KitchenTicketData,
  PaymentReceiptData,
  ReceiptHeader,
  ReceiptLineItem,
} from "@/features/receipts/receipt-models";

/**
 * ESC/POS byte payloads — what gets shipped over Web Serial to the
 * thermal printer. Pairs 1:1 with the on-screen React previews + the
 * jspdf generator so what the cashier sees is what comes out the
 * printer.
 *
 * Cutter + cash-drawer kicks are tacked on at the end of payment
 * receipts only (kitchen tickets don't need a drawer kick).
 */

function header(b: EscPosBuilder, h: ReceiptHeader): void {
  b.align(ALIGN_CENTER);
  b.bold(true).big(true).line(h.workspace.name).big(false);
  b.bold(false);
  const addressBits = [h.workspace.addressLine, h.workspace.city].filter(Boolean);
  if (addressBits.length) b.line(addressBits.join(", "));
  if (h.workspace.legalEntity) b.line(h.workspace.legalEntity);
  if (h.workspace.taxId) b.line(`NTN ${h.workspace.taxId}`);
  b.blank(1);
  b.bold(true).line(h.kind.toUpperCase()).bold(false);
  b.line(h.printedAt);
  b.align(ALIGN_LEFT);
  b.rule("=");
}

function footer(b: EscPosBuilder, h: ReceiptHeader): void {
  b.align(ALIGN_LEFT);
  b.rule("=");
  if (h.workspace.receiptFooter) {
    b.align(ALIGN_CENTER);
    b.line(h.workspace.receiptFooter);
    b.align(ALIGN_LEFT);
  }
  b.blank(1);
  b.align(ALIGN_CENTER);
  b.line(`Powered by ${BRAND.name}`);
  b.align(ALIGN_LEFT);
  b.blank(2);
}

function compact(amount: number): string {
  return formatCurrency(amount, { maximumFractionDigits: 0 }).replace(
    /^Rs\.?\s*/,
    "Rs ",
  );
}

function lineItem(b: EscPosBuilder, it: ReceiptLineItem): void {
  const qty = `${it.quantity}x`;
  const price = compact(it.amount);
  const nameBudget = b.columns - qty.length - price.length - 2;
  const name =
    it.name.length > nameBudget
      ? it.name.slice(0, Math.max(0, nameBudget - 1)) + "."
      : it.name;
  b.line(`${qty} ${name.padEnd(nameBudget, " ")} ${price}`);
  if (it.modifiers?.length) {
    b.line(`    + ${it.modifiers.join(", ")}`);
  }
  if (it.note) b.line(`    note: ${it.note}`);
}

function labelCase(s: string): string {
  return s.replace(/^./, (c) => c.toUpperCase()).replace(/[-_]/g, " ");
}

// ──────────────────────────────────────────────────────────────
// Public builders
// ──────────────────────────────────────────────────────────────

export function buildPaymentReceiptBytes(data: PaymentReceiptData): Uint8Array {
  const b = new EscPosBuilder(columnsFor(data.header.workspace.receiptWidth));
  header(b, data.header);
  b.row(`Order ${data.orderNumber}`, data.receiptNumber);
  b.row("Channel", labelCase(data.channel));
  if (data.table) b.row("Table", data.table);
  if (data.guests && data.guests > 0) b.row("Guests", String(data.guests));
  if (data.staff) b.row("Cashier", data.staff);
  if (data.customer?.name) b.row("Customer", data.customer.name);
  if (data.customer?.phone) b.row("Phone", data.customer.phone);
  b.rule();
  for (const item of data.items) lineItem(b, item);
  b.rule();
  for (const t of data.totals) {
    b.bold(!!t.bold).row(t.label, compact(t.amount)).bold(false);
  }
  if (data.payment) {
    b.blank(1).row(
      `Paid via ${labelCase(data.payment.method)}`,
      data.payment.channelName ?? "",
    );
  }
  if (data.fiscalInvoiceNumber) {
    b.blank(1).align(ALIGN_CENTER).line(`FBR / BRA: ${data.fiscalInvoiceNumber}`).align(ALIGN_LEFT);
  }
  if (data.notes) {
    b.blank(1).line(`Note: ${data.notes}`);
  }
  b.blank(1).align(ALIGN_CENTER).barcode(data.receiptNumber).align(ALIGN_LEFT);
  footer(b, data.header);
  b.cut();
  b.kickDrawer();
  return b.build();
}

export function buildKitchenTicketBytes(data: KitchenTicketData): Uint8Array {
  const h: ReceiptHeader = { ...data.header, kind: `KITCHEN ${data.stationName}` };
  const b = new EscPosBuilder(columnsFor(h.workspace.receiptWidth));
  header(b, h);

  b.align(ALIGN_CENTER).bold(true).big(true).line(`#${data.orderNumber}`).big(false);
  b.bold(false).align(ALIGN_LEFT);

  b.row("Placed", data.placedAt);
  b.row("Channel", labelCase(data.channel));
  if (data.table) b.row("Table", data.table);
  if (data.guests && data.guests > 0) b.row("Guests", String(data.guests));
  b.rule();

  for (const it of data.items) {
    b.bold(true).line(`${it.quantity}x  ${it.name.toUpperCase()}`).bold(false);
    if (it.modifiers?.length) b.line(`    + ${it.modifiers.join(", ")}`);
    if (it.note) b.line(`    ! ${it.note}`);
    b.blank(1);
  }

  if (data.notes) {
    b.rule().align(ALIGN_CENTER).bold(true).line("ORDER NOTE").bold(false).align(ALIGN_LEFT);
    b.line(data.notes);
  }

  b.blank(1).align(ALIGN_CENTER).barcode(data.orderNumber.replace(/^#/, "")).align(ALIGN_LEFT);
  footer(b, h);
  b.cut();
  return b.build();
}

export function buildInventorySlipBytes(data: InventorySlipData): Uint8Array {
  const h: ReceiptHeader = {
    ...data.header,
    kind: data.direction === "IN" ? "STOCK RECEIVED" : "STOCK OUT",
  };
  const b = new EscPosBuilder(columnsFor(h.workspace.receiptWidth));
  header(b, h);
  b.row("Slip", data.movementId);
  b.row("Recorded", data.recordedAt);
  if (data.staff) b.row("By", data.staff);
  if (data.supplier) b.row("Supplier", data.supplier);
  if (data.reason) b.row("Reason", data.reason);
  b.rule();
  for (const it of data.items) {
    const line = it.unitCost != null ? compact(it.unitCost * it.quantity) : "";
    b.row(it.name, line);
    b.line(`  ${it.quantity} ${it.unit}${it.unitCost != null ? ` @ ${compact(it.unitCost)}` : ""}`);
  }
  if (data.total != null) {
    b.rule().bold(true).row("Total", compact(data.total)).bold(false);
  }
  if (data.notes) b.blank(1).line(`Note: ${data.notes}`);
  b.blank(1).align(ALIGN_CENTER).barcode(data.movementId).align(ALIGN_LEFT);
  footer(b, h);
  b.cut();
  return b.build();
}
