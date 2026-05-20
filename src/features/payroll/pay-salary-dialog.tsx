"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paySalaryAction } from "@/lib/actions/payroll";
import type { PayrollRow } from "@/lib/queries/payroll";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

export function PaySalaryDialog({
  open,
  onOpenChange,
  worker,
  month,
  channels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: PayrollRow;
  month: string;
  channels: PaymentChannel[];
}) {
  const router = useRouter();
  const active = React.useMemo(
    () => channels.filter((c) => !c.archived),
    [channels],
  );
  const [date, setDate] = React.useState(today);
  const [absentStr, setAbsentStr] = React.useState("");
  const [channelId, setChannelId] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const channel =
    active.find((c) => c.id === channelId) ?? active[0] ?? null;
  const absentDays = Math.max(0, Number(absentStr) || 0);
  const perDay =
    worker.standardWorkingDays > 0
      ? worker.salary / worker.standardWorkingDays
      : 0;
  const absenceDeduction = round2(absentDays * perDay);
  const adjustedGross = round2(
    worker.salary + worker.overtimeEarned - absenceDeduction,
  );
  const net = round2(adjustedGross - worker.advances);
  const available = channel?.currentBalance ?? 0;
  const insufficient = !channel || available < net;
  const canPay = !worker.paid && net > 0 && !insufficient && !submitting;

  async function handlePay() {
    if (!canPay || !channel) return;
    setSubmitting(true);
    try {
      const result = await paySalaryAction({
        userId: worker.id,
        month,
        paymentDate: date,
        absentDays,
        paymentChannelId: channel.id,
        notes: notes.trim() || null,
      });
      if (!result.ok) {
        toast.error("Couldn't pay salary", { description: result.error });
        return;
      }
      toast.success(`${formatCurrency(result.net)} paid to ${worker.name}`, {
        description: `${channel.name} · ${month}`,
      });
      onOpenChange(false);
      requestAnimationFrame(() => router.refresh());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] gap-4 rounded-lg p-0">
        <DialogHeader className="flex-row items-start gap-3 px-5 pt-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
            <Wallet className="size-4.5" />
          </span>
          <div>
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Finalize Payment
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Pay salary to <span className="font-medium text-foreground">{worker.name}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          {worker.paid ? (
            <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[12px] text-success">
              Salary for {month} is already paid.
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Pay for month</FieldLabel>
              <Input value={month} readOnly className="h-10 bg-muted/40 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Payment date</FieldLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 text-[13px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Absent days</FieldLabel>
              <Input
                type="number"
                min={0}
                step="0.5"
                value={absentStr}
                onChange={(e) => setAbsentStr(e.target.value)}
                placeholder="0.0"
                className="h-10 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Paid via</FieldLabel>
              <ChannelSelect
                channels={active}
                value={channel?.id ?? ""}
                onChange={setChannelId}
              />
              <p
                className={
                  insufficient
                    ? "text-[11px] font-medium text-destructive"
                    : "text-[11px] text-muted-foreground"
                }
              >
                Available: {formatCurrency(available)}
              </p>
            </div>
          </div>

          {insufficient && channel ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2 text-[12px] font-medium text-destructive">
              Insufficient balance in {channel.name}. Need {formatCurrency(net)},
              available {formatCurrency(available)}.
            </p>
          ) : null}

          <div className="space-y-1.5">
            <FieldLabel>Notes (optional)</FieldLabel>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any remarks…"
              className="h-10 text-[13px]"
            />
          </div>

          <dl className="space-y-1.5 rounded-md border bg-muted/30 px-3.5 py-3 text-[12.5px]">
            <SummaryRow label="Monthly Salary" value={formatCurrency(worker.salary)} />
            <SummaryRow
              label={`Extra Hours (${worker.overtimeHours}h, ${worker.overtimeEntries.length} entries)`}
              value={`+${formatCurrency(worker.overtimeEarned)}`}
              tone="accent"
            />
            <SummaryRow
              label={`Absence (${absentDays} × ${formatCurrency(round2(perDay))}/day)`}
              value={`-${formatCurrency(absenceDeduction)}`}
              tone="destructive"
            />
            <div className="my-1 border-t border-border/70" />
            <SummaryRow label="Adjusted Gross" value={formatCurrency(adjustedGross)} />
            <SummaryRow
              label={`Advances (${worker.advanceEntries.length})`}
              value={`-${formatCurrency(worker.advances)}`}
              tone="warning"
            />
            <div className="my-1 border-t border-border/70" />
            <div className="flex items-center justify-between pt-0.5">
              <dt className="text-[13px] font-semibold text-foreground">NET TO PAY</dt>
              <dd className="text-[18px] font-semibold tabular-nums text-primary">
                {formatCurrency(Math.max(0, net))}
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={handlePay}
            disabled={!canPay}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Paying…
              </>
            ) : insufficient && !worker.paid ? (
              "Insufficient funds"
            ) : (
              `Pay ${formatCurrency(Math.max(0, net))}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChannelSelect({
  channels,
  value,
  onChange,
}: {
  channels: PaymentChannel[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full text-[13px]">
        <SelectValue placeholder="Pick a method" />
      </SelectTrigger>
      <SelectContent>
        {channels.length === 0 ? (
          <SelectItem value="__none__" disabled>
            No payment methods
          </SelectItem>
        ) : (
          channels.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name} — {formatCurrency(c.currentBalance)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </Label>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "accent" | "destructive" | "warning";
}) {
  const valueClass =
    tone === "accent"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : tone === "warning"
          ? "text-warning-foreground/90"
          : "text-foreground";
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`tabular-nums font-medium ${valueClass}`}>{value}</dd>
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
