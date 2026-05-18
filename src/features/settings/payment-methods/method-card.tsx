"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Archive, ArrowLeftRight, Loader2, Pencil } from "lucide-react";
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
  archivePaymentChannelAction,
  renamePaymentChannelAction,
} from "@/lib/actions/payment-channels";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

/**
 * Single payment method card. Shows opening (read-only) and current
 * balance with the three operator actions: transfer, edit (name
 * only), archive.
 */
export function PaymentMethodCard({
  channel,
  onTransfer,
  canTransfer,
}: {
  channel: PaymentChannel;
  onTransfer: () => void;
  canTransfer: boolean;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const diff = channel.currentBalance - channel.openingBalance;
  const positive = diff >= 0;

  return (
    <article className="ring-highlight rounded-xl border border-border/70 bg-card p-4 shadow-elevated">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold uppercase tracking-[0.04em] text-foreground">
            {channel.name}
          </h3>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Opening ·{" "}
            <span className="font-mono tabular-nums text-foreground/85">
              {formatCurrency(channel.openingBalance)}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconAction
            label={`Transfer from ${channel.name}`}
            onClick={onTransfer}
            disabled={!canTransfer}
          >
            <ArrowLeftRight className="size-3.5" />
          </IconAction>
          <IconAction
            label={`Rename ${channel.name}`}
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5" />
          </IconAction>
          <IconAction
            label={`Archive ${channel.name}`}
            onClick={() => setArchiveOpen(true)}
          >
            <Archive className="size-3.5" />
          </IconAction>
        </div>
      </header>

      <div className="my-3 h-px bg-border" />

      <div className="flex items-end justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Current
        </span>
        <div className="text-right">
          <p className="text-[20px] font-semibold tabular-nums text-success">
            {formatCurrency(channel.currentBalance)}
          </p>
          {diff !== 0 ? (
            <p
              className={`text-[10.5px] font-medium tabular-nums ${
                positive ? "text-success/70" : "text-destructive/80"
              }`}
            >
              {positive ? "+" : ""}
              {formatCurrency(diff)} since opening
            </p>
          ) : null}
        </div>
      </div>

      <EditMethodDialog
        channel={channel}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ArchiveMethodDialog
        channel={channel}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
      />
    </article>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="size-8 rounded-md border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </Button>
  );
}

function EditMethodDialog({
  channel,
  open,
  onOpenChange,
}: {
  channel: PaymentChannel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = React.useState(channel.name);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setName(channel.name);
  }, [open, channel.name]);

  const canSave = name.trim().length > 1 && name.trim() !== channel.name;

  async function save() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = await renamePaymentChannelAction(channel.id, name.trim());
      if (!result.ok) {
        toast.error("Couldn't rename", { description: result.error });
        return;
      }
      toast.success(`Renamed to ${name.trim()}`);
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
            Rename payment method
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Only the name is editable. Balances change through transfers
            and (eventually) sales — never by hand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 pb-1">
          <div className="space-y-1.5">
            <Label
              htmlFor="pm-rename"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pm-rename"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
              autoFocus
            />
          </div>
          <p className="rounded-md border bg-muted/30 px-3 py-2 text-[11.5px] text-muted-foreground">
            Current balance:{" "}
            <span className="font-mono tabular-nums text-foreground">
              {formatCurrency(channel.currentBalance)}
            </span>{" "}
            (not editable)
          </p>
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
            onClick={save}
            disabled={!canSave || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ArchiveMethodDialog({
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

  async function archive() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await archivePaymentChannelAction(channel.id);
      if (!result.ok) {
        toast.error("Couldn't archive", { description: result.error });
        return;
      }
      toast.success(`${channel.name} archived`, {
        description: "Past transfers stay visible in the history.",
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
            Archive {channel.name}?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            It&apos;ll be hidden from the active methods list and can no
            longer be used as the source or destination of a transfer.
            Past transfers stay intact for the history.
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
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={archive}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Archiving…
              </>
            ) : (
              <>
                <Archive className="size-3.5" />
                Archive
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
