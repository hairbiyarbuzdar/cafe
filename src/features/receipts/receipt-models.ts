/**
 * Plain data shapes the receipt components + PDF/ESC-POS generators
 * all consume. Keeps the render layer pure and the call sites simple:
 * fetch on the server, hand the shape to the dialog, done.
 */

import type { Workspace } from "@/lib/queries/workspace";

export type ReceiptHeader = {
  workspace: Pick<
    Workspace,
    "name" | "city" | "addressLine" | "taxId" | "legalEntity" | "receiptFooter" | "receiptWidth"
  >;
  printedAt: string;
  /** Tag shown under the workspace name, e.g. "PAYMENT RECEIPT". */
  kind: string;
};

export type MoneyLine = {
  label: string;
  amount: number;
  /** Renders as a subtotal/secondary row in muted weight. */
  muted?: boolean;
  /** Renders as the grand total in bold. */
  bold?: boolean;
};

export type ReceiptLineItem = {
  /** Quantity displayed at the front of the row. */
  quantity: number;
  /** Product name. Truncated if it overflows the column width. */
  name: string;
  /** Line total in workspace currency (Decimal already applied). */
  amount: number;
  /** Modifier names, joined with `+`. */
  modifiers?: string[];
  /** Short note (allergies, prep notes). */
  note?: string;
};

export type PaymentReceiptData = {
  header: ReceiptHeader;
  orderNumber: string;
  receiptNumber: string;
  channel: string;
  table?: string | null;
  guests?: number | null;
  staff?: string | null;
  customer?: { name?: string; phone?: string } | null;
  items: ReceiptLineItem[];
  totals: MoneyLine[];
  payment: {
    method: string;
    channelName?: string | null;
  } | null;
  fiscalInvoiceNumber?: string | null;
  notes?: string | null;
};

export type KitchenTicketData = {
  header: ReceiptHeader;
  orderNumber: string;
  channel: string;
  table?: string | null;
  guests?: number | null;
  stationName: string;
  items: ReceiptLineItem[];
  /** When the order was placed — printed at the top of the ticket. */
  placedAt: string;
  notes?: string | null;
};

export type InventorySlipData = {
  header: ReceiptHeader;
  /** "IN" for purchases/receipts, "OUT" for write-offs/sales. */
  direction: "IN" | "OUT";
  movementId: string;
  supplier?: string | null;
  reason?: string | null;
  recordedAt: string;
  staff?: string | null;
  items: {
    name: string;
    quantity: number;
    unit: string;
    unitCost?: number | null;
  }[];
  total?: number | null;
  notes?: string | null;
};
