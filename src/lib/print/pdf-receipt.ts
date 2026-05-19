"use client";

import { jsPDF } from "jspdf";

import { BRAND } from "@/constants/nav";
import { formatCurrency } from "@/lib/utils";
import type {
  InventorySlipData,
  KitchenTicketData,
  PaymentReceiptData,
  ReceiptHeader,
  ReceiptLineItem,
} from "@/features/receipts/receipt-models";

/**
 * Thermal-receipt PDFs sized exactly to the configured paper width
 * (80mm or 58mm) AND height (computed from the content). Uses a
 * two-pass approach: first pass accumulates draw ops + measures
 * total height, second pass instantiates the PDF at the right size
 * and replays the ops. jsPDF 4.x has no reliable "resize current
 * page" API so the two-pass keeps page dimensions honest without
 * leaving a trailing blank tail (which manifested as a "blank PDF"
 * because viewers anchored to the bottom of the doc).
 */

const POINTS_PER_MM = 2.83465;

type WidthChoice = "80" | "58";

type Layout = {
  widthPt: number;
  charCols: number;
  fontSize: number;
  rowHeight: number;
  marginX: number;
};

/**
 * Layout knobs are conservative on purpose: Courier 9pt renders at
 * roughly 5.4pt per glyph, so 80mm (≈226pt) only fits ~40 characters
 * after margins. The previous `charCols: 42` overflowed the right
 * edge — every row's price spilled past the page. 80mm: 38 cols,
 * 58mm: 30 cols. ESC/POS keeps its own (correct) printer-native
 * counts since the bitmap font is narrower than Courier.
 */
function layoutFor(width: WidthChoice): Layout {
  if (width === "58") {
    return {
      widthPt: 58 * POINTS_PER_MM,
      charCols: 30,
      fontSize: 8,
      rowHeight: 10,
      marginX: 3,
    };
  }
  return {
    widthPt: 80 * POINTS_PER_MM,
    charCols: 38,
    fontSize: 9,
    rowHeight: 11,
    marginX: 4,
  };
}

type Op = {
  text: string;
  align: "left" | "center" | "right";
  y: number;
  bold: boolean;
  size: number;
};

class ReceiptCanvas {
  layout: Layout;
  ops: Op[] = [];
  cursorY: number;
  // Current style cursor — applied to every emitted op until changed.
  bold = false;
  size: number;

  constructor(width: WidthChoice) {
    this.layout = layoutFor(width);
    this.size = this.layout.fontSize;
    this.cursorY = this.layout.rowHeight;
  }

  setStyle(opts: { bold?: boolean; size?: number } = {}): void {
    if (typeof opts.bold === "boolean") this.bold = opts.bold;
    if (typeof opts.size === "number") this.size = opts.size;
  }

  text(value: string, align: "left" | "center" | "right" = "left"): void {
    this.ops.push({
      text: value,
      align,
      y: this.cursorY,
      bold: this.bold,
      size: this.size,
    });
    this.cursorY += this.layout.rowHeight;
  }

  row(left: string, right: string): void {
    // Two ops at the same Y: left-aligned key, right-aligned value.
    // jsPDF anchors right-aligned text to the X coordinate, so the
    // value always sits flush against the right margin regardless of
    // how long the key is — no more spill-over.
    const leftBudget = Math.max(0, this.layout.charCols - right.length - 1);
    const trimmedLeft =
      left.length > leftBudget ? left.slice(0, leftBudget - 1) + "." : left;
    this.ops.push({
      text: trimmedLeft,
      align: "left",
      y: this.cursorY,
      bold: this.bold,
      size: this.size,
    });
    this.ops.push({
      text: right,
      align: "right",
      y: this.cursorY,
      bold: this.bold,
      size: this.size,
    });
    this.cursorY += this.layout.rowHeight;
  }

  rule(char: string = "-"): void {
    this.text(char.repeat(this.layout.charCols));
  }

  blank(rows: number = 1): void {
    this.cursorY += this.layout.rowHeight * rows;
  }

  multiline(text: string, indent: number = 0): void {
    const usable = this.layout.charCols - indent;
    const words = text.split(/\s+/);
    let line = "";
    for (const word of words) {
      if (!line.length) {
        line = word;
        continue;
      }
      if (line.length + 1 + word.length > usable) {
        this.text(" ".repeat(indent) + line);
        line = word;
      } else {
        line += " " + word;
      }
    }
    if (line.length) this.text(" ".repeat(indent) + line);
  }

  finalise(): jsPDF {
    const finalHeight = Math.max(80, this.cursorY + this.layout.rowHeight * 1.5);
    const doc = new jsPDF({
      unit: "pt",
      format: [this.layout.widthPt, finalHeight],
      orientation: "portrait",
    });

    let lastBold: boolean | null = null;
    let lastSize: number | null = null;

    for (const op of this.ops) {
      if (op.bold !== lastBold) {
        doc.setFont("courier", op.bold ? "bold" : "normal");
        lastBold = op.bold;
      }
      if (op.size !== lastSize) {
        doc.setFontSize(op.size);
        lastSize = op.size;
      }
      const x =
        op.align === "center"
          ? this.layout.widthPt / 2
          : op.align === "right"
            ? this.layout.widthPt - this.layout.marginX
            : this.layout.marginX;
      doc.text(op.text, x, op.y, { align: op.align });
    }

    return doc;
  }
}

// ──────────────────────────────────────────────────────────────
// Shared header / footer
// ──────────────────────────────────────────────────────────────

function drawHeader(c: ReceiptCanvas, header: ReceiptHeader): void {
  c.setStyle({ bold: true, size: c.layout.fontSize + 2 });
  c.text(header.workspace.name.toUpperCase(), "center");
  c.setStyle({ bold: false, size: c.layout.fontSize });

  const address = [header.workspace.addressLine, header.workspace.city]
    .filter(Boolean)
    .join(", ");
  if (address) c.text(address, "center");
  if (header.workspace.legalEntity) c.text(header.workspace.legalEntity, "center");
  if (header.workspace.taxId) c.text(`NTN ${header.workspace.taxId}`, "center");

  c.blank(0.5);
  c.setStyle({ bold: true });
  c.text(header.kind.toUpperCase(), "center");
  c.setStyle({ bold: false });
  c.text(header.printedAt, "center");
  c.rule("=");
}

function drawFooter(c: ReceiptCanvas, header: ReceiptHeader): void {
  c.rule("=");
  if (header.workspace.receiptFooter) {
    c.blank(0.25);
    c.multiline(header.workspace.receiptFooter);
  }
  c.blank(0.25);
  c.setStyle({ size: c.layout.fontSize - 1 });
  c.text(`Powered by ${BRAND.name}`, "center");
  c.setStyle({ size: c.layout.fontSize });
}

function drawLineItem(c: ReceiptCanvas, item: ReceiptLineItem): void {
  const qty = `${item.quantity}x`;
  const price = formatCurrencyCompact(item.amount);
  // "row" anchors `price` flush right, so qty + name flow on the
  // left without us having to pad/measure the column count.
  c.row(`${qty} ${item.name}`, price);
  if (item.modifiers && item.modifiers.length > 0) {
    c.multiline(`+ ${item.modifiers.join(", ")}`, 4);
  }
  if (item.note) c.multiline(`note: ${item.note}`, 4);
}

// ──────────────────────────────────────────────────────────────
// Public generators
// ──────────────────────────────────────────────────────────────

export function generatePaymentReceiptPdf(data: PaymentReceiptData): jsPDF {
  const c = new ReceiptCanvas(data.header.workspace.receiptWidth);
  drawHeader(c, data.header);

  c.row(`Order ${data.orderNumber}`, data.receiptNumber);
  c.row("Channel", labelCase(data.channel));
  if (data.table) c.row("Table", data.table);
  if (data.guests && data.guests > 0) c.row("Guests", String(data.guests));
  if (data.staff) c.row("Cashier", data.staff);
  if (data.customer?.name) c.row("Customer", data.customer.name);
  if (data.customer?.phone) c.row("Phone", data.customer.phone);
  c.rule();

  for (const item of data.items) drawLineItem(c, item);
  c.rule();

  for (const t of data.totals) {
    c.setStyle({ bold: !!t.bold });
    c.row(t.label, formatCurrencyCompact(t.amount));
    c.setStyle({ bold: false });
  }

  if (data.payment) {
    c.blank(0.25);
    c.row(
      `Paid via ${labelCase(data.payment.method)}`,
      data.payment.channelName ?? "",
    );
  }

  if (data.fiscalInvoiceNumber) {
    c.blank(0.25);
    c.text(`FBR / BRA: ${data.fiscalInvoiceNumber}`, "center");
  }

  if (data.notes) {
    c.blank(0.25);
    c.multiline(`Note: ${data.notes}`);
  }

  drawFooter(c, data.header);
  return c.finalise();
}

export function generateKitchenTicketPdf(data: KitchenTicketData): jsPDF {
  const c = new ReceiptCanvas(data.header.workspace.receiptWidth);
  drawHeader(c, { ...data.header, kind: `KITCHEN · ${data.stationName}` });

  c.setStyle({ bold: true, size: c.layout.fontSize + 4 });
  c.text(`#${data.orderNumber}`, "center");
  c.setStyle({ bold: false, size: c.layout.fontSize });

  c.row("Placed", data.placedAt);
  c.row("Channel", labelCase(data.channel));
  if (data.table) c.row("Table", data.table);
  if (data.guests && data.guests > 0) c.row("Guests", String(data.guests));
  c.rule();

  for (const item of data.items) {
    c.setStyle({ bold: true, size: c.layout.fontSize + 1 });
    c.text(`${item.quantity}x  ${item.name.toUpperCase()}`);
    c.setStyle({ bold: false, size: c.layout.fontSize });
    if (item.modifiers && item.modifiers.length > 0) {
      c.multiline(`+ ${item.modifiers.join(", ")}`, 4);
    }
    if (item.note) c.multiline(`! ${item.note}`, 4);
    c.blank(0.25);
  }

  if (data.notes) {
    c.rule();
    c.setStyle({ bold: true });
    c.text("ORDER NOTE", "center");
    c.setStyle({ bold: false });
    c.multiline(data.notes);
  }

  drawFooter(c, { ...data.header, kind: `KITCHEN · ${data.stationName}` });
  return c.finalise();
}

export function generateInventorySlipPdf(data: InventorySlipData): jsPDF {
  const c = new ReceiptCanvas(data.header.workspace.receiptWidth);
  drawHeader(c, {
    ...data.header,
    kind: data.direction === "IN" ? "STOCK RECEIVED" : "STOCK OUT",
  });

  c.row("Slip", data.movementId);
  c.row("Recorded", data.recordedAt);
  if (data.staff) c.row("By", data.staff);
  if (data.supplier) c.row("Supplier", data.supplier);
  if (data.reason) c.row("Reason", data.reason);
  c.rule();

  for (const it of data.items) {
    const cost = it.unitCost != null ? formatCurrencyCompact(it.unitCost * it.quantity) : "";
    c.row(`${it.name}`, cost);
    c.text(`  ${it.quantity} ${it.unit}${it.unitCost != null ? ` @ ${formatCurrencyCompact(it.unitCost)}` : ""}`);
  }

  if (data.total != null) {
    c.rule();
    c.setStyle({ bold: true });
    c.row("Total", formatCurrencyCompact(data.total));
    c.setStyle({ bold: false });
  }

  if (data.notes) {
    c.blank(0.25);
    c.multiline(`Note: ${data.notes}`);
  }

  drawFooter(c, data.header);
  return c.finalise();
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function labelCase(s: string): string {
  return s.replace(/^./, (c) => c.toUpperCase()).replace(/[-_]/g, " ");
}

function formatCurrencyCompact(value: number): string {
  return formatCurrency(value, { maximumFractionDigits: 0 }).replace(/^Rs\.?\s*/, "Rs ");
}
