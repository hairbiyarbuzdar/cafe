"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cancelHeldOrderAction } from "@/lib/actions/orders";
import type { Order } from "@/types";

export function CancelHeldOrderDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setReason("");
  }, [open]);

  async function cancel() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await cancelHeldOrderAction(order.id, reason.trim() || undefined);
      if (!result.ok) {
        toast.error("Couldn't cancel", { description: result.error });
        return;
      }
      toast.success(`${order.number} cancelled`, {
        description: "Kitchen tickets marked cancelled · inventory restored",
      });
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Cancel {order.number}?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Kitchen tickets at every routed station are marked
            cancelled (cooks see them struck-out until they dismiss).
            Ingredient deductions are reversed, and the order is
            archived as <span className="font-medium text-foreground">Cancelled</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 pb-1">
          <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/8 p-3 text-[12px] text-warning-foreground/85">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              This can&apos;t be undone. Once cancelled the order can&apos;t be
              paid or have items added.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="cn-reason"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              Reason (optional)
            </Label>
            <Textarea
              id="cn-reason"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. customer left, wrong item, kitchen issue"
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
            Keep order
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={cancel}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Cancelling…
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                Cancel order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
