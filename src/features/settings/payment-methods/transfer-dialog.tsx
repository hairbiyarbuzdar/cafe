"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
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
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTransferAction } from "@/lib/actions/payment-channels";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

type Form = {
  fromId: string;
  toId: string;
  amount: string;
  occurredAt: string;
  note: string;
};

function todayLocal(): string {
  // YYYY-MM-DD in the user's local zone so the <input type="date">
  // shows today on first open regardless of UTC offset.
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

export function TransferDialog({
  channels,
  open,
  onOpenChange,
  defaultFromId,
}: {
  channels: PaymentChannel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFromId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<Form>(() => initForm(channels, defaultFromId));
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setForm(initForm(channels, defaultFromId));
  }, [open, channels, defaultFromId]);

  const from = channels.find((c) => c.id === form.fromId);
  const to = channels.find((c) => c.id === form.toId);
  const amountNum = Number(form.amount);
  const overdraft =
    Number.isFinite(amountNum) && from ? amountNum > from.currentBalance : false;
  const canTransfer =
    !!from &&
    !!to &&
    form.fromId !== form.toId &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    !overdraft &&
    Boolean(form.occurredAt);

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!canTransfer || submitting) return;
    setSubmitting(true);
    try {
      const result = await createTransferAction({
        fromId: form.fromId,
        toId: form.toId,
        amount: amountNum,
        occurredAt: form.occurredAt,
        note: form.note.trim() || undefined,
      });
      if (!result.ok) {
        toast.error("Transfer failed", { description: result.error });
        return;
      }
      toast.success(
        `${formatCurrency(amountNum)} moved`,
        { description: `${from?.name} → ${to?.name}` },
      );
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Transfer between methods
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Moves balance from one method to another in one atomic
            update — both running totals shift in lockstep so the
            cashbook stays consistent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="space-y-1.5">
              <FieldLabel required>From</FieldLabel>
              <Select
                value={form.fromId}
                onValueChange={(v) => patch("fromId", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a method" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      disabled={c.id === form.toId}
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {from ? (
                <p className="text-[11.5px] text-muted-foreground">
                  Available:{" "}
                  <span className="font-mono tabular-nums text-foreground">
                    {formatCurrency(from.currentBalance)}
                  </span>
                </p>
              ) : null}
            </div>
            <ArrowRight className="mt-7 size-4 text-muted-foreground" />
            <div className="space-y-1.5">
              <FieldLabel required>To</FieldLabel>
              <Select
                value={form.toId}
                onValueChange={(v) => patch("toId", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a method" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      disabled={c.id === form.fromId}
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {to ? (
                <p className="text-[11.5px] text-muted-foreground">
                  Current:{" "}
                  <span className="font-mono tabular-nums text-foreground">
                    {formatCurrency(to.currentBalance)}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="tr-amount" required>
                Amount (Rs)
              </FieldLabel>
              <NumericInput
                id="tr-amount"
                value={form.amount}
                onValueChange={(v) => patch("amount", v)}
                placeholder="0"
                className="h-10 tabular-nums"
              />
              {overdraft && from ? (
                <p className="text-[11.5px] font-medium text-destructive">
                  Exceeds available {formatCurrency(from.currentBalance)}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="tr-date" required>
                Date
              </FieldLabel>
              <Input
                id="tr-date"
                type="date"
                value={form.occurredAt}
                onChange={(e) => patch("occurredAt", e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="tr-note">Note (optional)</FieldLabel>
            <Textarea
              id="tr-note"
              rows={2}
              value={form.note}
              onChange={(e) => patch("note", e.target.value)}
              placeholder="e.g. ATM withdrawal, cash to wallet top-up"
              className="text-[13px]"
            />
          </div>
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
            onClick={submit}
            disabled={!canTransfer || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Transferring…
              </>
            ) : (
              <>Transfer</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function initForm(channels: PaymentChannel[], defaultFromId?: string): Form {
  const from =
    channels.find((c) => c.id === defaultFromId) ?? channels[0];
  const to = channels.find((c) => c.id !== from?.id);
  return {
    fromId: from?.id ?? "",
    toId: to?.id ?? "",
    amount: "",
    occurredAt: todayLocal(),
    note: "",
  };
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
    >
      {children}
      {required ? <span className="ms-0.5 text-destructive">*</span> : null}
    </Label>
  );
}
