"use client";

import * as React from "react";
import { Archive, ArrowLeftRight, History, Plus, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddPaymentMethodDialog } from "@/features/settings/payment-methods/add-method-dialog";
import { ArchivedMethodCard } from "@/features/settings/payment-methods/archived-method-card";
import { PaymentMethodCard } from "@/features/settings/payment-methods/method-card";
import { TransferDialog } from "@/features/settings/payment-methods/transfer-dialog";
import { TransferHistory } from "@/features/settings/payment-methods/transfer-history";
import type {
  PaymentChannel,
  Transfer,
} from "@/lib/queries/payment-channels";

export function PaymentMethodsPanel({
  channels,
  transfers,
}: {
  channels: PaymentChannel[];
  transfers: Transfer[];
}) {
  const active = channels.filter((c) => !c.archived);
  const archived = channels.filter((c) => c.archived);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [transferDefaultFrom, setTransferDefaultFrom] = React.useState<
    string | undefined
  >();

  function openTransfer(fromId?: string) {
    setTransferDefaultFrom(fromId);
    setTransferOpen(true);
  }

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div>
          <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
            Payment Methods
          </h2>
          <p className="mt-1 max-w-3xl text-[12.5px] text-muted-foreground">
            Configure the cash, wallet, and bank channels available
            across invoices, cashbook, and supplier payments. Each
            method tracks its own running balance starting from the
            opening you enter.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => openTransfer()}
            disabled={active.length < 2}
          >
            <ArrowLeftRight className="size-3.5" />
            Transfer
          </Button>
          <AddPaymentMethodDialog
            trigger={
              <Button size="sm" className="h-9 rounded-md text-[12.5px]">
                <Plus className="size-3.5" />
                Add method
              </Button>
            }
          />
        </div>
      </header>

      <section className="space-y-3">
        <SectionHeading
          icon={Wallet}
          label="Active methods"
          count={active.length}
        />
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/40 p-8 text-center">
            <Wallet className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-[13px] font-medium">No payment methods yet</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Add one above — Cash, EasyPaisa, your bank — and we&apos;ll
              start tracking the balance from the opening you enter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {active.map((c) => (
              <PaymentMethodCard
                key={c.id}
                channel={c}
                onTransfer={() => openTransfer(c.id)}
                canTransfer={active.length >= 2}
              />
            ))}
          </div>
        )}
      </section>

      {archived.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading
            icon={Archive}
            label="Archived methods"
            count={archived.length}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {archived.map((c) => (
              <ArchivedMethodCard key={c.id} channel={c} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionHeading
          icon={History}
          label="Transfer history"
          count={transfers.length}
        />
        <TransferHistory transfers={transfers} />
      </section>

      <TransferDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        channels={active}
        defaultFromId={transferDefaultFrom}
      />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof Wallet;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

