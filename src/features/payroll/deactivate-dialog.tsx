"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { setWorkerActiveAction } from "@/lib/actions/payroll";
import type { PayrollRow } from "@/lib/queries/payroll";

export function DeactivateDialog({
  open,
  onOpenChange,
  worker,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: PayrollRow;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  // Toggle to the opposite of the worker's current status.
  const willActivate = !worker.active;

  async function confirm() {
    setBusy(true);
    try {
      const res = await setWorkerActiveAction(worker.id, willActivate);
      if (!res.ok) {
        toast.error("Couldn't update status", { description: res.error });
        return;
      }
      toast.success(
        willActivate ? `${worker.name} reactivated` : `${worker.name} deactivated`,
      );
      onOpenChange(false);
      requestAnimationFrame(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] gap-4 rounded-lg p-5">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {willActivate ? "Reactivate Worker?" : "Deactivate Worker?"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px] leading-relaxed">
            {willActivate ? (
              <>
                Restore <span className="font-medium text-foreground">{worker.name}</span>{" "}
                to active status. They&apos;ll reappear in active payroll lists.
              </>
            ) : (
              <>
                Are you sure you want to deactivate{" "}
                <span className="font-medium text-foreground">{worker.name}</span>? This
                changes their status to Inactive. They&apos;ll no longer appear in
                active payroll lists, but their history is preserved.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant={willActivate ? "default" : "destructive"}
            className="h-9 rounded-md text-[12.5px]"
            onClick={confirm}
            disabled={busy}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {willActivate ? "Confirm Reactivation" : "Confirm Deactivation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
