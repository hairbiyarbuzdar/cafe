"use client";

import * as React from "react";

import { BRAND } from "@/constants/nav";
import { cn } from "@/lib/utils";
import type { ReceiptHeader } from "@/features/receipts/receipt-models";

/**
 * On-screen preview frame for every receipt variant. Renders inside
 * `ReceiptPreviewDialog` and is also what `window.print()` ships to
 * the OS print queue — the parent dialog hides everything else via a
 * print stylesheet so the printer only sees this container.
 *
 * The frame width matches the workspace's configured roll size so
 * what the cashier sees is exactly what the thermal printer puts
 * on paper.
 */
export function ReceiptShell({
  header,
  children,
}: {
  header: ReceiptHeader;
  children: React.ReactNode;
}) {
  const width = header.workspace.receiptWidth;
  const widthClass = width === "58" ? "max-w-[58mm]" : "max-w-[80mm]";

  return (
    <div
      id="receipt-printable"
      data-receipt
      className={cn(
        "mx-auto w-full bg-white px-3 py-4 font-mono text-[10px] leading-snug text-black shadow-elevated",
        widthClass,
      )}
    >
      <header className="space-y-0.5 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.04em]">
          {header.workspace.name}
        </p>
        {(header.workspace.addressLine || header.workspace.city) ? (
          <p className="text-[9.5px] text-zinc-700">
            {[header.workspace.addressLine, header.workspace.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        ) : null}
        {header.workspace.legalEntity ? (
          <p className="text-[9.5px] text-zinc-600">
            {header.workspace.legalEntity}
          </p>
        ) : null}
        {header.workspace.taxId ? (
          <p className="text-[9.5px] text-zinc-600">
            NTN {header.workspace.taxId}
          </p>
        ) : null}
      </header>

      <div className="my-1.5 border-t-2 border-dashed border-zinc-900" />

      <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.08em]">
        {header.kind}
      </p>
      <p className="text-center text-[9.5px] text-zinc-700">
        {header.printedAt}
      </p>

      <div className="my-1.5 border-t border-zinc-900" />

      {children}

      <div className="mt-2 border-t-2 border-dashed border-zinc-900" />

      {header.workspace.receiptFooter ? (
        <p className="mt-2 text-center text-[9.5px] italic text-zinc-700">
          {header.workspace.receiptFooter}
        </p>
      ) : null}

      <p className="mt-2 text-center text-[8.5px] uppercase tracking-[0.12em] text-zinc-500">
        Powered by {BRAND.name}
      </p>
    </div>
  );
}

/**
 * Two-column row with label on the left and value on the right.
 * Pads with `·` dot leaders so prices line up under each other.
 */
export function ReceiptRow({
  label,
  value,
  bold,
  muted,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  bold?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-2 text-[10px]",
        bold && "text-[10.5px] font-bold",
        muted && "text-zinc-600",
        className,
      )}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="shrink-0 tabular-nums">{value}</span>
    </div>
  );
}

export function ReceiptDivider({
  kind = "solid",
}: {
  kind?: "solid" | "dashed";
}) {
  return (
    <div
      className={cn(
        "my-1 border-t",
        kind === "dashed"
          ? "border-dashed border-zinc-700"
          : "border-zinc-900",
      )}
    />
  );
}
