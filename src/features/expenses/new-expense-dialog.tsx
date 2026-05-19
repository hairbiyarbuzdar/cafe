"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Loader2, ReceiptText, Tag, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { recordExpenseAction } from "@/lib/actions/expenses";
import type { ExpenseHead } from "@/lib/queries/expenses";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  heads: ExpenseHead[];
  paymentChannels: PaymentChannel[];
};

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Record-expense modal. The trigger button is rendered inside this
 * component so the parent's only responsibility is to pass the
 * heads + channels props through; submit validation mirrors the
 * server action (amount > 0, ≤ channel balance) so a disabled
 * button is the only visible feedback the operator needs.
 */
export function NewExpenseDialog({ heads, paymentChannels }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const activeHeads = React.useMemo(
    () => heads.filter((h) => !h.archived),
    [heads],
  );
  const activeChannels = React.useMemo(
    () => paymentChannels.filter((c) => !c.archived),
    [paymentChannels],
  );

  const [headId, setHeadId] = React.useState(activeHeads[0]?.id ?? "");
  const [channelId, setChannelId] = React.useState(activeChannels[0]?.id ?? "");
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(todayIso());
  const [detail, setDetail] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setHeadId(activeHeads[0]?.id ?? "");
    setChannelId(activeChannels[0]?.id ?? "");
    setAmount("");
    setDate(todayIso());
    setDetail("");
  }, [open, activeHeads, activeChannels]);

  const channel = activeChannels.find((c) => c.id === channelId);
  const balance = channel ? Number(channel.currentBalance) : 0;
  const amountNum = Number(amount);
  const overBalance = channel ? amountNum > balance + 0.001 : false;
  const canSave =
    !!headId &&
    !!channelId &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    !overBalance &&
    !submitting;

  const blocked = activeHeads.length === 0 || activeChannels.length === 0;

  async function submit() {
    if (!canSave) return;
    setSubmitting(true);
    try {
      const result = await recordExpenseAction({
        expenseHeadId: headId,
        paymentChannelId: channelId,
        amount: amountNum,
        detail: detail || undefined,
        occurredAt: date,
      });
      if (!result.ok) {
        toast.error("Couldn't record expense", { description: result.error });
        return;
      }
      toast.success(`${formatCurrency(amountNum)} recorded`);
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
          disabled={blocked}
          title={
            activeHeads.length === 0
              ? "Add an expense head first"
              : activeChannels.length === 0
                ? "Add an active payment method first"
                : undefined
          }
        >
          <ReceiptText className="size-3.5" />
          New Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[560px] gap-0 rounded-lg p-0">
        <DialogHeader className="flex flex-row items-start gap-3 border-b px-5 py-4">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ReceiptText className="size-4" />
          </span>
          <div className="space-y-0.5">
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Record expense
            </DialogTitle>
            <DialogDescription className="text-[12px]">
              Track outgoing spending and debit the chosen payment source.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              icon={<Tag className="size-3" />}
              label="Expense head"
              required
            >
              <Select value={headId} onValueChange={setHeadId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a head" />
                </SelectTrigger>
                <SelectContent>
                  {activeHeads.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              icon={<CalendarDays className="size-3" />}
              label="Expense date"
              required
            >
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Amount (Rs)"
              required
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-10 text-end tabular-nums"
              />
            </Field>
            <Field
              icon={<Wallet className="size-3" />}
              label="Payment source"
              required
            >
              <Select value={channelId} onValueChange={setChannelId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a source" />
                </SelectTrigger>
                <SelectContent>
                  {activeChannels.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} —{" "}
                      <span className="tabular-nums text-muted-foreground">
                        {formatCurrency(Number(c.currentBalance))}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {channel ? (
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    overBalance ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  Available: {formatCurrency(balance)}
                </p>
              ) : null}
            </Field>
          </div>

          <Field
            icon={<FileText className="size-3" />}
            label="Expense detail (optional)"
          >
            <Textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. Electricity bill — September, vendor name, invoice ref."
              rows={3}
              maxLength={500}
              className="text-[13px]"
            />
          </Field>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={submit}
            disabled={!canSave}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Recording…
              </>
            ) : (
              <>
                <ReceiptText className="size-3.5" />
                Record Expense
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
        {required ? <span className="ms-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
