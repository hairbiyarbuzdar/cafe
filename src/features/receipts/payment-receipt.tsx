"use client";

import { Barcode } from "@/features/receipts/barcode";
import {
  ReceiptDivider,
  ReceiptRow,
  ReceiptShell,
} from "@/features/receipts/receipt-shell";
import type { PaymentReceiptData } from "@/features/receipts/receipt-models";
import { formatCurrency } from "@/lib/utils";

export function PaymentReceipt({ data }: { data: PaymentReceiptData }) {
  return (
    <ReceiptShell header={data.header}>
      <div className="space-y-0.5">
        <ReceiptRow label={`Order ${data.orderNumber}`} value={data.receiptNumber} />
        <ReceiptRow label="Channel" value={labelCase(data.channel)} />
        {data.table ? <ReceiptRow label="Table" value={data.table} /> : null}
        {data.guests && data.guests > 0 ? (
          <ReceiptRow label="Guests" value={String(data.guests)} />
        ) : null}
        {data.staff ? <ReceiptRow label="Cashier" value={data.staff} /> : null}
        {data.customer?.name ? (
          <ReceiptRow label="Customer" value={data.customer.name} />
        ) : null}
        {data.customer?.phone ? (
          <ReceiptRow label="Phone" value={data.customer.phone} />
        ) : null}
      </div>

      <ReceiptDivider kind="dashed" />

      <ul className="space-y-1">
        {data.items.map((it, i) => (
          <li key={i} className="space-y-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 flex-1">
                <span className="me-1 font-semibold tabular-nums">
                  {it.quantity}×
                </span>
                {it.name}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatCurrency(it.amount)}
              </span>
            </div>
            {it.modifiers && it.modifiers.length > 0 ? (
              <p className="ps-4 text-[9px] text-zinc-700">
                + {it.modifiers.join(", ")}
              </p>
            ) : null}
            {it.note ? (
              <p className="ps-4 text-[9px] italic text-zinc-700">
                note: {it.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <ReceiptDivider />

      <div className="space-y-0.5">
        {data.totals.map((t, i) => (
          <ReceiptRow
            key={i}
            label={t.label}
            value={formatCurrency(t.amount)}
            bold={t.bold}
            muted={t.muted}
          />
        ))}
      </div>

      {data.payment ? (
        <>
          <ReceiptDivider kind="dashed" />
          <ReceiptRow
            label={`Paid via ${labelCase(data.payment.method)}`}
            value={data.payment.channelName ?? ""}
          />
        </>
      ) : null}

      {data.fiscalInvoiceNumber ? (
        <p className="mt-2 text-center text-[9px] uppercase tracking-[0.04em] text-zinc-700">
          FBR / BRA: {data.fiscalInvoiceNumber}
        </p>
      ) : null}

      {data.notes ? (
        <p className="mt-2 text-[9.5px] text-zinc-700">Note: {data.notes}</p>
      ) : null}

      <div className="mt-3 flex justify-center">
        <Barcode value={data.receiptNumber} />
      </div>
    </ReceiptShell>
  );
}

function labelCase(s: string): string {
  return s.replace(/^./, (c) => c.toUpperCase()).replace(/[-_]/g, " ");
}
