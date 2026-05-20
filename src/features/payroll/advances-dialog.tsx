"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, TrendingDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChannelSelect } from "@/features/payroll/pay-salary-dialog";
import {
  deleteStaffAdvanceAction,
  recordStaffAdvanceAction,
} from "@/lib/actions/payroll";
import type { PayrollRow } from "@/lib/queries/payroll";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

export function AdvancesDialog({
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
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(today);
  const [channelId, setChannelId] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const channel = active.find((c) => c.id === channelId) ?? active[0] ?? null;
  const remaining = Math.max(0, worker.salary - worker.advances);
  const amt = Number(amount) || 0;
  const canRecord =
    amt > 0 && amt <= remaining && Boolean(channel) && !busy;

  async function record() {
    if (!canRecord || !channel) return;
    setBusy(true);
    try {
      const res = await recordStaffAdvanceAction({
        userId: worker.id,
        month,
        amount: amt,
        date,
        paymentChannelId: channel.id,
        notes: notes.trim() || null,
      });
      if (!res.ok) {
        toast.error("Couldn't record advance", { description: res.error });
        return;
      }
      toast.success(`${formatCurrency(amt)} advance recorded`);
      setAmount("");
      setNotes("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const res = await deleteStaffAdvanceAction(id);
    if (!res.ok) {
      toast.error("Couldn't remove advance", { description: res.error });
      return;
    }
    toast.success("Advance removed");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] gap-0 overflow-hidden rounded-lg p-0">
        <DialogHeader className="flex-row items-start gap-3 border-b px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600">
            <TrendingDown className="size-4.5" />
          </span>
          <div>
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Worker Advances
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Manage cash advances for{" "}
              <span className="font-medium text-foreground">{worker.name}</span> ({month})
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Monthly history
            </span>
            <span className="text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Limit remaining{" "}
              <span className="ms-1 text-[13px] font-semibold normal-case text-primary">
                {formatCurrency(remaining)}
              </span>
            </span>
          </div>

          {worker.advanceEntries.length === 0 ? (
            <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed text-[12.5px] text-muted-foreground">
              No advances recorded for this month
            </div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {worker.advanceEntries.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-[12.5px]"
                >
                  <div className="min-w-0">
                    <span className="font-semibold tabular-nums text-foreground">
                      {formatCurrency(a.amount)}
                    </span>
                    <span className="ms-2 text-muted-foreground">
                      {new Date(a.date).toLocaleDateString()}
                      {a.channelName ? ` · ${a.channelName}` : ""}
                      {a.notes ? ` · ${a.notes}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label="Remove advance"
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 border-t bg-surface-1 px-5 py-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Record new advance
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Amount (Rs) *</Label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-10 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 text-[13px]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Paid via *</Label>
            <ChannelSelect
              channels={active}
              value={channel?.id ?? ""}
              onChange={setChannelId}
            />
            <p className="text-[11px] text-muted-foreground">
              Available: {formatCurrency(channel?.currentBalance ?? 0)}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Notes (optional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for advance…"
              className="h-10 text-[13px]"
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              className="h-10 rounded-md bg-amber-600 text-[12.5px] text-white hover:bg-amber-700"
              onClick={record}
              disabled={!canRecord}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Record Advance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
