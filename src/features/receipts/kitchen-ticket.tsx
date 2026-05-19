"use client";

import {
  ReceiptDivider,
  ReceiptRow,
  ReceiptShell,
} from "@/features/receipts/receipt-shell";
import type { KitchenTicketData } from "@/features/receipts/receipt-models";

export function KitchenTicket({ data }: { data: KitchenTicketData }) {
  return (
    <ReceiptShell
      header={{ ...data.header, kind: `KITCHEN · ${data.stationName}` }}
    >
      <p className="text-center text-[20px] font-extrabold tracking-tight">
        #{data.orderNumber}
      </p>

      <div className="mt-1 space-y-0.5">
        <ReceiptRow label="Placed" value={data.placedAt} />
        <ReceiptRow label="Channel" value={labelCase(data.channel)} />
        {data.table ? <ReceiptRow label="Table" value={data.table} /> : null}
        {data.guests && data.guests > 0 ? (
          <ReceiptRow label="Guests" value={String(data.guests)} />
        ) : null}
      </div>

      <ReceiptDivider />

      <ul className="space-y-2">
        {data.items.map((it, i) => (
          <li key={i}>
            <p className="text-[12px] font-bold uppercase">
              <span className="me-1 tabular-nums">{it.quantity}×</span>
              {it.name}
            </p>
            {it.modifiers && it.modifiers.length > 0 ? (
              <p className="ps-4 text-[10px]">
                + {it.modifiers.join(", ")}
              </p>
            ) : null}
            {it.note ? (
              <p className="ps-4 text-[10px] font-semibold italic">
                ! {it.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {data.notes ? (
        <>
          <ReceiptDivider kind="dashed" />
          <p className="text-center text-[10px] font-bold uppercase">
            Order note
          </p>
          <p className="text-[10px] italic">{data.notes}</p>
        </>
      ) : null}
    </ReceiptShell>
  );
}

function labelCase(s: string): string {
  return s.replace(/^./, (c) => c.toUpperCase()).replace(/[-_]/g, " ");
}
