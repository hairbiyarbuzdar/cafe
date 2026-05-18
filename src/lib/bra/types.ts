/**
 * BRA (Balochistan Revenue Authority) invoice payload — verbatim
 * from the PRAL "Technical Specification for Data Sharing through
 * Software Fiscal Device with BRA" (v1.0).
 *
 * Field names match the spec casing exactly because the BRA endpoint
 * is case-sensitive about the JSON keys.
 */

export type BraPaymentMode =
  | 1 // Cash
  | 2 // Card
  | 3 // Gift Voucher
  | 4 // Loyalty Card
  | 5 // Mixed
  | 6; // Cheque

export type BraInvoiceType =
  | 1 // New
  | 2 // Debit
  | 3; // Credit (returns/cancellations)

export type BraInvoiceItem = {
  ItemCode: string;
  ItemName: string;
  /** Pakistan Customs Tariff code, 8 digits, "00000000" as default. */
  PCTCode: string;
  Quantity: number;
  TaxRate: number;
  /** Pre-tax, pre-discount line value. */
  SaleValue: number;
  Discount: number;
  FurtherTax: number;
  TaxCharged: number;
  /** Inclusive of tax. */
  TotalAmount: number;
  InvoiceType: BraInvoiceType;
  RefUSIN: string | null;
};

export type BraInvoicePayload = {
  /** Always empty on submission; BRA fills it. */
  InvoiceNumber: "";
  /** Numeric POSID issued by BRA on registration. */
  POSID: number;
  /** Our own invoice identifier (Order.number, without "#"). */
  USIN: string;
  RefUSIN: string | null;
  /** "YYYY-MM-DD HH:mm:ss" in the spec's example. */
  DateTime: string;
  BuyerName: string;
  BuyerNTN: string;
  BuyerCNIC: string;
  BuyerPhoneNumber: string;
  TotalBillAmount: number;
  TotalQuantity: number;
  TotalSaleValue: number;
  TotalTaxCharged: number;
  Discount: number;
  FurtherTax: number;
  PaymentMode: BraPaymentMode;
  InvoiceType: BraInvoiceType;
  Items: BraInvoiceItem[];
};

/**
 * BRA response envelope. Code "100" = accepted; anything else is an
 * error we surface back to the operator.
 */
export type BraResponse = {
  InvoiceNumber?: string;
  Code?: string;
  Response?: string;
  Errors?: unknown;
};

export type BraSubmissionResult =
  | {
      ok: true;
      fiscalInvoiceNumber: string;
      responseCode: string;
      responseMessage: string;
      raw: BraResponse;
    }
  | {
      ok: false;
      error: string;
      responseCode?: string;
      responseMessage?: string;
      raw?: BraResponse | string;
    };
