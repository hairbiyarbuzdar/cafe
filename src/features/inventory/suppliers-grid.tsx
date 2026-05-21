"use client";

import * as React from "react";
import { Mail, Phone, Plus, Star } from "lucide-react";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { CreateSupplierDialog } from "@/features/inventory/create-supplier-dialog";
import { SupplierLedgerDialog } from "@/features/inventory/supplier-ledger-dialog";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import type { Supplier } from "@/types";
import { initials } from "@/lib/utils";

/**
 * Inventory-page suppliers panel. Each row is a button that opens the
 * supplier's ledger (purchase history + payments + outstanding +
 * "pay supplier" form). The header carries the "+ Add supplier"
 * button — supplier creation moved here from the New Item sheet so
 * the operator manages vendors in one place.
 */
export function SuppliersGrid({
  suppliers,
  paymentChannels = [],
}: {
  suppliers: Supplier[];
  paymentChannels?: PaymentChannel[];
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [ledgerSupplierId, setLedgerSupplierId] = React.useState<string | null>(
    null,
  );
  const pg = usePagination(suppliers);

  return (
    <>
      <SectionCard
        title="Suppliers"
        description="Tap a supplier to see purchases, payments, and outstanding balance."
        contentClassName="p-0"
        action={
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-md text-[12.5px]"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-3.5" />
            Add supplier
          </Button>
        }
      >
        {suppliers.length === 0 ? (
          <p className="px-4 py-8 text-center text-[12.5px] text-muted-foreground">
            No suppliers yet. Add one above to start tracking purchases and
            payments.
          </p>
        ) : (
          <ul className="divide-y">
            {pg.pageItems.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setLedgerSupplierId(s.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 md:px-5"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-secondary-foreground">
                    {initials(s.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {s.name}
                    </p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {s.contact ?? "—"} · {s.itemsSupplied} item
                      {s.itemsSupplied === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="hidden items-center gap-3 text-[11px] text-muted-foreground md:flex">
                    {s.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3" />
                        {s.email}
                      </span>
                    ) : null}
                    {s.phone ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="size-3" />
                        {s.phone}
                      </span>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-1.5 py-0.5 text-[11px] font-medium text-warning-foreground/85">
                    <Star className="size-3 fill-warning text-warning" />
                    {s.rating.toFixed(1)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {suppliers.length > 0 ? (
          <TablePagination
            page={pg.page}
            pageCount={pg.pageCount}
            shown={pg.shown}
            total={pg.total}
            onPrev={pg.prev}
            onNext={pg.next}
          />
        ) : null}
      </SectionCard>

      <CreateSupplierDialog open={addOpen} onOpenChange={setAddOpen} />

      <SupplierLedgerDialog
        supplierId={ledgerSupplierId}
        paymentChannels={paymentChannels}
        onOpenChange={(open) => {
          if (!open) setLedgerSupplierId(null);
        }}
      />
    </>
  );
}
