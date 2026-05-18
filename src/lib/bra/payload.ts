// Intentionally not `server-only`: this is a pure transformation module
// (no Prisma, no next/headers) so it can also be invoked from CLI test
// scripts and unit tests. The HTTP client in `client.ts` is server-only.
import type {
  BraInvoiceItem,
  BraInvoicePayload,
  BraInvoiceType,
  BraPaymentMode,
} from "@/lib/bra/types";
import type { Order, OrderItem, PaymentMethod } from "@/types";

/**
 * Map our internal `PaymentMethod` to the integer enum BRA expects.
 *
 * BRA's list (1=Cash, 2=Card, 3=Gift Voucher, 4=Loyalty Card,
 * 5=Mixed, 6=Cheque) doesn't have a 1:1 for "wallet" or "online"
 * since those are conceptually card-like settlements. We funnel
 * them to 2 (Card) so the cashbook stays consistent — flag with
 * BRA later if they want a more specific bucket.
 */
const PAYMENT_MODE: Record<PaymentMethod, BraPaymentMode> = {
  cash: 1,
  card: 2,
  wallet: 2,
  online: 2,
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "YYYY-MM-DD HH:mm:ss" in local time — matches the spec's sample. */
export function formatBraDateTime(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

type BuildArgs = {
  order: Pick<
    Order,
    | "number"
    | "channel"
    | "customer"
    | "subtotal"
    | "tax"
    | "tip"
    | "discount"
    | "total"
    | "payment"
    | "createdAt"
    | "items"
  > & {
    /** Optional, surfaced from DB columns added for BRA. */
    buyerNtn?: string | null;
    buyerCnic?: string | null;
  };
  posId: string;
  /** Default PCT code from FiscalConfig — applied to items missing one. */
  defaultPctCode: string;
  /** Map of menuItemId → MenuItem (for pctCode lookup). */
  pctCodeByMenuItemId?: Map<string, string | null | undefined>;
  /** Tax rate used to compute per-item TaxRate. Decimal (e.g. 0.085 = 8.5%). */
  taxRate: number;
  /** "New" for fresh sales, "Credit" for refunds. */
  invoiceType?: BraInvoiceType;
  /** Reference USIN for credit notes (the original order's number). */
  refUsin?: string | null;
};

/**
 * Convert one of our orders into the BRA invoice payload. Pure: all
 * data comes in via args so the caller controls what fields are
 * captured (e.g. buyer NTN may not yet be on the order schema in
 * older deployments).
 */
export function buildBraInvoicePayload(args: BuildArgs): BraInvoicePayload {
  const {
    order,
    posId,
    defaultPctCode,
    pctCodeByMenuItemId,
    taxRate,
    invoiceType = 1,
    refUsin = null,
  } = args;

  const posIdNumber = Number(posId);
  if (!Number.isFinite(posIdNumber)) {
    throw new Error(`POSID must be numeric — got ${posId}`);
  }

  const items: BraInvoiceItem[] = order.items.map((line) =>
    buildItem(line, {
      pctCode:
        pctCodeByMenuItemId?.get(line.productId)?.trim() ||
        defaultPctCode,
      taxRatePct: taxRate * 100,
      invoiceType,
      refUsin,
    }),
  );

  const totalQuantity = items.reduce((sum, i) => sum + i.Quantity, 0);

  return {
    InvoiceNumber: "",
    POSID: posIdNumber,
    USIN: stripHash(order.number),
    RefUSIN: refUsin ? stripHash(refUsin) : null,
    DateTime: formatBraDateTime(order.createdAt),
    BuyerName: order.customer?.name?.trim() ?? "",
    BuyerNTN: args.order.buyerNtn?.trim() ?? "",
    BuyerCNIC: args.order.buyerCnic?.trim() ?? "",
    BuyerPhoneNumber: order.customer?.phone?.trim() ?? "",
    TotalBillAmount: round2(order.total),
    TotalQuantity: totalQuantity,
    TotalSaleValue: round2(order.subtotal),
    TotalTaxCharged: round2(order.tax),
    Discount: round2(order.discount ?? 0),
    FurtherTax: 0,
    PaymentMode: PAYMENT_MODE[order.payment],
    InvoiceType: invoiceType,
    Items: items,
  };
}

function buildItem(
  line: OrderItem,
  ctx: {
    pctCode: string;
    taxRatePct: number;
    invoiceType: BraInvoiceType;
    refUsin: string | null;
  },
): BraInvoiceItem {
  const saleValue = round2(line.unitPrice * line.quantity);
  const taxCharged = round2(saleValue * (ctx.taxRatePct / 100));
  return {
    ItemCode: line.productId,
    ItemName: line.name,
    PCTCode: ctx.pctCode.replace(/\./g, ""), // BRA wants "01010000" not "01.010000"
    Quantity: line.quantity,
    TaxRate: ctx.taxRatePct,
    SaleValue: saleValue,
    Discount: 0, // discount is applied at the order header level
    FurtherTax: 0,
    TaxCharged: taxCharged,
    TotalAmount: round2(saleValue + taxCharged),
    InvoiceType: ctx.invoiceType,
    RefUSIN: ctx.refUsin ? stripHash(ctx.refUsin) : null,
  };
}

function stripHash(value: string): string {
  return value.startsWith("#") ? value.slice(1) : value;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
