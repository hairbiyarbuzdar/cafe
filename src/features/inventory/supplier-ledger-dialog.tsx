"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  loadSupplierLedgerAction,
  paySupplierAction,
} from "@/lib/actions/suppliers";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import type { SupplierLedger } from "@/lib/queries/suppliers";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  supplierId: string | null;
  paymentChannels: PaymentChannel[];
  onOpenChange: (open: boolean) => void;
};

/**
 * Supplier ledger + pay-dues UI. Open is driven by `supplierId !==
 * null` so the parent (SuppliersGrid) stays a simple state machine
 * — clicking a row sets the id, closing reverts to null.
 *
 * On mount it loads the ledger via a server action so the inventory
 * page bundle stays small; the data refreshes after every successful
 * pay so the totals + entry list stay coherent.
 */
export function SupplierLedgerDialog({
  supplierId,
  paymentChannels,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const open = supplierId !== null;
  const [ledger, setLedger] = React.useState<SupplierLedger | null>(null);
  const [loading, setLoading] = React.useState(false);
  const activeChannels = React.useMemo(
    () => paymentChannels.filter((c) => !c.archived),
    [paymentChannels],
  );

  const refresh = React.useCallback(async (id: string) => {
    setLoading(true);
    try {
      const result = await loadSupplierLedgerAction(id);
      if (result.ok) {
        setLedger(result.ledger);
      } else {
        toast.error("Couldn't load supplier", { description: result.error });
        setLedger(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!supplierId) {
      setLedger(null);
      return;
    }
    void refresh(supplierId);
  }, [supplierId, refresh]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onOpenChange(false);
      }}
    >
      <DialogContent className="flex max-h-[90dvh] w-[min(640px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-lg p-0 sm:max-w-[640px]">
        <DialogHeader className="border-b px-5 pb-3 pt-4">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {ledger?.supplier.name ?? "Supplier"}
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Purchase history, payments, and outstanding balance.
          </DialogDescription>
        </DialogHeader>

        {loading || !ledger ? (
          <div className="flex flex-1 items-center justify-center px-5 py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 px-5 py-4">
              <section className="grid grid-cols-3 gap-2">
                <Stat label="Purchased" value={ledger.totals.purchased} />
                <Stat label="Paid" value={ledger.totals.paid} tone="success" />
                <Stat
                  label="Outstanding"
                  value={ledger.totals.outstanding}
                  tone={ledger.totals.outstanding > 0 ? "warning" : "muted"}
                />
              </section>

              {(ledger.supplier.phone || ledger.supplier.address) ? (
                <p className="rounded-md border bg-card/50 px-3 py-2 text-[11.5px] text-muted-foreground">
                  {ledger.supplier.phone ? (
                    <span className="me-2 text-foreground">
                      {ledger.supplier.phone}
                    </span>
                  ) : null}
                  {ledger.supplier.address ?? ""}
                </p>
              ) : null}

              {ledger.totals.outstanding > 0 ? (
                <PayForm
                  supplierId={ledger.supplier.id}
                  outstanding={ledger.totals.outstanding}
                  channels={activeChannels}
                  onSettled={() => {
                    void refresh(ledger.supplier.id);
                    router.refresh();
                  }}
                />
              ) : null}

              <section className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Ledger
                </h3>
                {ledger.entries.length === 0 ? (
                  <p className="rounded-md border border-dashed bg-card/50 px-3 py-5 text-center text-[12px] text-muted-foreground">
                    Nothing recorded for this supplier yet.
                  </p>
                ) : (
                  <ul className="divide-y rounded-md border bg-card">
                    {ledger.entries.map((entry) => (
                      <LedgerRow key={`${entry.kind}-${entry.id}`} entry={entry} />
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: number;
  tone?: "muted" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card px-3 py-2",
        tone === "success" && "border-success/30 bg-success/5",
        tone === "warning" && "border-warning/30 bg-warning/5",
      )}
    >
      <p className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold tabular-nums">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function LedgerRow({
  entry,
}: {
  entry: SupplierLedger["entries"][number];
}) {
  const date = new Date(entry.occurredAt);
  const when = date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (entry.kind === "purchase") {
    return (
      <li className="flex items-start gap-3 px-3 py-2.5">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-warning/15 text-warning-foreground/85">
          <ArrowDownCircle className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[12.5px] font-medium">
            <span className="truncate">{entry.itemName}</span>
            <span className="font-mono text-[10.5px] text-muted-foreground">
              ×{entry.quantity} {entry.unit}
            </span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {when}
            {entry.channelName ? ` · ${entry.channelName}` : ""}
          </p>
        </div>
        <div className="text-end text-[11.5px] tabular-nums">
          <p className="font-semibold">{formatCurrency(entry.cost)}</p>
          <p className="text-muted-foreground">
            {entry.paid > 0 ? `paid ${formatCurrency(entry.paid)}` : "unpaid"}
          </p>
          {entry.outstanding > 0 ? (
            <p className="text-warning-foreground/85">
              due {formatCurrency(entry.outstanding)}
            </p>
          ) : null}
        </div>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-3 px-3 py-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
        <ArrowUpCircle className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium">
          Payment to supplier
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {when} · {entry.channelName}
          {entry.note ? ` · ${entry.note}` : ""}
        </p>
      </div>
      <span className="text-end text-[12px] font-semibold tabular-nums text-success">
        −{formatCurrency(entry.amount)}
      </span>
    </li>
  );
}

function PayForm({
  supplierId,
  outstanding,
  channels,
  onSettled,
}: {
  supplierId: string;
  outstanding: number;
  channels: PaymentChannel[];
  onSettled: () => void;
}) {
  const [amount, setAmount] = React.useState<string>(() =>
    pickInitialAmount(outstanding, channels),
  );
  const [channelId, setChannelId] = React.useState<string>(
    () => pickInitialChannel(channels) ?? "",
  );
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setAmount(pickInitialAmount(outstanding, channels));
    setChannelId((current) =>
      current && channels.some((c) => c.id === current)
        ? current
        : pickInitialChannel(channels) ?? "",
    );
  }, [outstanding, channels]);

  const channel = channels.find((c) => c.id === channelId);
  const amountNum = Number(amount);
  const balance = channel ? Number(channel.currentBalance) : 0;
  const overOutstanding = amountNum > outstanding + 0.001;
  const overBalance = channel ? amountNum > balance + 0.001 : false;
  const canPay =
    !!channelId &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    !overOutstanding &&
    !overBalance &&
    !submitting;

  async function submit() {
    if (!canPay) return;
    setSubmitting(true);
    try {
      const result = await paySupplierAction({
        supplierId,
        amount: amountNum,
        paymentChannelId: channelId,
        note: note.trim() || undefined,
      });
      if (!result.ok) {
        toast.error("Couldn't record payment", { description: result.error });
        return;
      }
      toast.success(
        `Paid ${formatCurrency(amountNum)}${
          result.outstanding > 0
            ? ` · ${formatCurrency(result.outstanding)} still due`
            : " · cleared"
        }`,
      );
      setNote("");
      onSettled();
    } finally {
      setSubmitting(false);
    }
  }

  if (channels.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-muted/30 px-3 py-3 text-[12px] text-muted-foreground">
        Add an active payment method in Settings to settle outstanding
        balances.
      </div>
    );
  }

  return (
    <section className="space-y-2.5 rounded-md border bg-card p-3">
      <h3 className="flex items-center gap-1.5 text-[12px] font-semibold">
        <Receipt className="size-3.5" />
        Pay {formatCurrency(outstanding)} outstanding
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <Label
            htmlFor="sup-pay-amount"
            className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
          >
            Amount
          </Label>
          <NumericInput
            id="sup-pay-amount"
            value={amount}
            onValueChange={setAmount}
            className="h-9 text-end tabular-nums"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            From
          </Label>
          <Select value={channelId} onValueChange={setChannelId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Pick a channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ·{" "}
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrency(Number(c.currentBalance))}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="sup-pay-note"
          className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
        >
          Note (optional)
        </Label>
        <Textarea
          id="sup-pay-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Cheque #, settle invoice, …"
          className="text-[12.5px]"
        />
      </div>

      <p className="text-[11px] text-muted-foreground">
        {overOutstanding ? (
          <span className="text-destructive">
            Amount can&apos;t exceed outstanding ({formatCurrency(outstanding)}).
          </span>
        ) : overBalance ? (
          <span className="text-destructive">
            {channel?.name} only has {formatCurrency(balance)} available.
          </span>
        ) : channel ? (
          <>Will debit {formatCurrency(amountNum || 0)} from {channel.name}.</>
        ) : (
          "Pick a channel to charge."
        )}
      </p>

      <Button
        type="button"
        size="sm"
        className="h-9 w-full rounded-md text-[12.5px]"
        onClick={submit}
        disabled={!canPay}
      >
        {submitting ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            Recording…
          </>
        ) : (
          <>
            <Receipt className="size-3.5" />
            Record payment
          </>
        )}
      </Button>
    </section>
  );
}

function pickInitialAmount(outstanding: number, channels: PaymentChannel[]): string {
  const topBalance = channels.reduce(
    (max, c) => Math.max(max, Number(c.currentBalance)),
    0,
  );
  const suggest = Math.max(0, Math.min(outstanding, topBalance));
  return String(suggest > 0 ? suggest : outstanding);
}

function pickInitialChannel(channels: PaymentChannel[]): string | undefined {
  // Pick the channel with the highest balance — most likely the
  // operator wants to pay from whichever till has cash on hand.
  return [...channels]
    .sort((a, b) => Number(b.currentBalance) - Number(a.currentBalance))[0]?.id;
}
