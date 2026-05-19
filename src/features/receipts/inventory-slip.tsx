"use client";

import {
  ReceiptDivider,
  ReceiptRow,
  ReceiptShell,
} from "@/features/receipts/receipt-shell";
import type { InventorySlipData } from "@/features/receipts/receipt-models";
import { formatCurrency } from "@/lib/utils";

export function InventorySlip({ data }: { data: InventorySlipData }) {
  return (
    <ReceiptShell
      header={{
        ...data.header,
        kind: data.direction === "IN" ? "STOCK RECEIVED" : "STOCK OUT",
      }}
    >
      <div className="space-y-0.5">
        <ReceiptRow label="Slip" value={data.movementId} />
        <ReceiptRow label="Recorded" value={data.recordedAt} />
        {data.staff ? <ReceiptRow label="By" value={data.staff} /> : null}
        {data.supplier ? (
          <ReceiptRow label="Supplier" value={data.supplier} />
        ) : null}
        {data.reason ? <ReceiptRow label="Reason" value={data.reason} /> : null}
      </div>

      <ReceiptDivider kind="dashed" />

      <ul className="space-y-1">
        {data.items.map((it, i) => {
          const line = it.unitCost != null ? it.unitCost * it.quantity : null;
          return (
            <li key={i} className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 flex-1 truncate font-medium">
                  {it.name}
                </span>
                {line != null ? (
                  <span className="shrink-0 tabular-nums">
                    {formatCurrency(line)}
                  </span>
                ) : null}
              </div>
              <p className="ps-1 text-[9.5px] text-zinc-700">
                <span className="tabular-nums">
                  {it.quantity} {it.unit}
                </span>
                {it.unitCost != null ? (
                  <>
                    {" "}
                    @ <span className="tabular-nums">{formatCurrency(it.unitCost)}</span>
                  </>
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>

      {data.total != null ? (
        <>
          <ReceiptDivider />
          <ReceiptRow label="Total" value={formatCurrency(data.total)} bold />
        </>
      ) : null}

      {data.notes ? (
        <p className="mt-2 text-[9.5px] text-zinc-700">Note: {data.notes}</p>
      ) : null}
    </ReceiptShell>
  );
}
