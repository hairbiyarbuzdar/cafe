"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2, RotateCcw } from "lucide-react";
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
import { restorePaymentChannelAction } from "@/lib/actions/payment-channels";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

/**
 * Card for an archived method. Visually muted to match its inactive
 * state — single primary action is Restore, which flips `archived`
 * back to false so the row rejoins the active list.
 */
export function ArchivedMethodCard({ channel }: { channel: PaymentChannel }) {
  const [open, setOpen] = React.useState(false);
  return (
    <article className="rounded-xl border border-dashed border-border bg-card/40 p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold uppercase tracking-[0.04em] text-foreground/85">
            {channel.name}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <Archive className="size-3" />
            Archived{channel.archivedAt ? ` · ${formatArchivedDate(channel.archivedAt)}` : ""}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md text-[12px]"
          onClick={() => setOpen(true)}
        >
          <RotateCcw className="size-3.5" />
          Restore
        </Button>
      </header>

      <div className="my-3 h-px bg-border" />

      <div className="flex items-end justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Last balance
        </span>
        <p className="text-[18px] font-semibold tabular-nums text-muted-foreground">
          {formatCurrency(channel.currentBalance)}
        </p>
      </div>

      <RestoreConfirmDialog
        channel={channel}
        open={open}
        onOpenChange={setOpen}
      />
    </article>
  );
}

function RestoreConfirmDialog({
  channel,
  open,
  onOpenChange,
}: {
  channel: PaymentChannel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function restore() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await restorePaymentChannelAction(channel.id);
      if (!result.ok) {
        toast.error("Couldn't restore", { description: result.error });
        return;
      }
      toast.success(`${channel.name} restored`, {
        description: "It's available again for transfers and cashbook entries.",
      });
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Restore {channel.name}?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            It&apos;ll rejoin the active methods list with its current
            balance of{" "}
            <span className="font-mono tabular-nums text-foreground">
              {formatCurrency(channel.currentBalance)}
            </span>
            . You can use it for transfers immediately.
          </DialogDescription>
        </DialogHeader>

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
            onClick={restore}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Restoring…
              </>
            ) : (
              <>
                <RotateCcw className="size-3.5" />
                Restore
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatArchivedDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
