"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  addStaffOvertimeAction,
  deleteStaffOvertimeAction,
} from "@/lib/actions/payroll";
import type { PayrollRow } from "@/lib/queries/payroll";
import { formatCurrency } from "@/lib/utils";

export function OvertimeDialog({
  open,
  onOpenChange,
  worker,
  month,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: PayrollRow;
  month: string;
}) {
  const router = useRouter();
  const [hours, setHours] = React.useState("");
  const [rate, setRate] = React.useState(() =>
    worker.overtimeRate ? String(worker.overtimeRate) : "100",
  );
  const [busy, setBusy] = React.useState(false);

  const hrs = Number(hours) || 0;
  const rt = Number(rate) || 0;
  const canAdd = hrs > 0 && rt >= 0 && !busy;

  async function add() {
    if (!canAdd) return;
    setBusy(true);
    try {
      const res = await addStaffOvertimeAction({
        userId: worker.id,
        month,
        hours: hrs,
        rate: rt,
      });
      if (!res.ok) {
        toast.error("Couldn't add overtime", { description: res.error });
        return;
      }
      toast.success(`${hrs}h overtime added`);
      setHours("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const res = await deleteStaffOvertimeAction(id);
    if (!res.ok) {
      toast.error("Couldn't remove entry", { description: res.error });
      return;
    }
    toast.success("Entry removed");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] gap-0 overflow-hidden rounded-lg p-0">
        <DialogHeader className="flex-row items-start gap-3 border-b px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-600">
            <Clock className="size-4.5" />
          </span>
          <div>
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Overtime / Extra Hours
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Manage extra hours for{" "}
              <span className="font-medium text-foreground">{worker.name}</span> ({month})
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Monthly logs
            </span>
            <span className="text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Total earned{" "}
              <span className="ms-1 text-[13px] font-semibold normal-case text-violet-600">
                {formatCurrency(worker.overtimeEarned)}
              </span>
            </span>
          </div>

          {worker.overtimeEntries.length === 0 ? (
            <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed text-[12.5px] text-muted-foreground">
              No extra hours recorded this month
            </div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {worker.overtimeEntries.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-[12.5px]"
                >
                  <div className="min-w-0">
                    <span className="font-semibold tabular-nums text-foreground">
                      {o.hours}h × {formatCurrency(o.rate)}
                    </span>
                    <span className="ms-2 tabular-nums text-violet-600">
                      = {formatCurrency(o.earned)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(o.id)}
                    aria-label="Remove entry"
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
            Record extra hours
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Hours</Label>
              <NumericInput
                value={hours}
                onValueChange={setHours}
                placeholder="0.0"
                className="h-10 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Rate (Rs/hr)</Label>
              <NumericInput
                value={rate}
                onValueChange={setRate}
                placeholder="100"
                className="h-10 text-[13px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              className="h-10 rounded-md bg-violet-600 text-[12.5px] text-white hover:bg-violet-700"
              onClick={add}
              disabled={!canAdd}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Overtime
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
