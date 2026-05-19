"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Loader2,
  Receipt,
  Smartphone,
  Wallet,
  Wifi,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { buildPaymentReceipt } from "@/features/receipts/build";
import {
  ReceiptPreviewDialog,
  type ReceiptPayload,
} from "@/features/receipts/receipt-preview-dialog";
import { payOrderAction } from "@/lib/actions/orders";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { useWorkspace } from "@/store/workspace-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { Order, PaymentMethod } from "@/types";

const KIND_ICON: Record<PaymentMethod, typeof Wallet> = {
  card: CreditCard,
  cash: Wallet,
  wallet: Smartphone,
  online: Wifi,
};

export function TakePaymentDialog({
  order,
  channels = [],
  open,
  onOpenChange,
}: {
  order: Order;
  /** Active payment methods configured in Settings → Payment methods.
   * If empty, the dialog shows a friendly empty state pointing the
   * operator at settings instead of guessing a default. */
  channels?: PaymentChannel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const activeChannels = React.useMemo(
    () => channels.filter((c) => !c.archived),
    [channels],
  );

  const workspace = useWorkspace((s) => s.workspace);
  const [channelId, setChannelId] = React.useState<string>(
    activeChannels[0]?.id ?? "",
  );
  const [tipStr, setTipStr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [receipts, setReceipts] = React.useState<ReceiptPayload[]>([]);

  React.useEffect(() => {
    if (open) {
      setChannelId(activeChannels[0]?.id ?? "");
      setTipStr("");
    }
  }, [open, activeChannels]);

  const selectedChannel = activeChannels.find((c) => c.id === channelId);
  const tipNum = tipStr ? Number(tipStr) : 0;
  const tipValid = Number.isFinite(tipNum) && tipNum >= 0;
  const baseTotal =
    order.subtotal - (order.discount ?? 0) + order.tax;
  const grandTotal = baseTotal + (tipValid ? tipNum : 0);

  async function takePayment() {
    if (!tipValid || submitting || !selectedChannel) return;
    setSubmitting(true);
    try {
      const result = await payOrderAction({
        orderId: order.id,
        payment: selectedChannel.kind,
        tip: tipNum > 0 ? tipNum : undefined,
      });
      if (!result.ok) {
        toast.error("Payment failed", { description: result.error });
        return;
      }
      toast.success(`${formatCurrency(result.total)} captured`, {
        description: `Receipt ${result.receiptNumber} · ${selectedChannel.name}${
          result.fiscalInvoiceNumber
            ? ` · BRA ${result.fiscalInvoiceNumber}`
            : ""
        }`,
      });

      // Auto-open the printable payment receipt. We hydrate it from
      // the order we already have on the client + the just-completed
      // payment outcome — no extra round-trip.
      if (workspace) {
        const payload = buildPaymentReceipt({
          order: {
            ...order,
            payment: selectedChannel.kind,
            paidAt: new Date().toISOString(),
            tip: tipNum > 0 ? tipNum : undefined,
            total: result.total,
            fiscalInvoiceNumber:
              result.fiscalInvoiceNumber ?? order.fiscalInvoiceNumber,
          },
          workspace,
          receiptNumber: result.receiptNumber,
          paymentChannelName: selectedChannel.name,
        });
        setReceipts([{ kind: "payment", data: payload }]);
        setReceiptOpen(true);
      } else {
        onOpenChange(false);
      }

      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Take payment · {order.number}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Closes the order, fires BRA fiscalization (if enabled), and
            unlocks the final receipt for printing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Payment method
            </Label>
            {activeChannels.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/30 px-3 py-4 text-center text-[12px] text-muted-foreground">
                No payment methods configured.{" "}
                <Link
                  href="/settings"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Add one in Settings
                </Link>{" "}
                to take payments.
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-1.5",
                  activeChannels.length <= 2
                    ? "grid-cols-2"
                    : activeChannels.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-4",
                )}
              >
                {activeChannels.map((c) => {
                  const Icon = KIND_ICON[c.kind];
                  const active = channelId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setChannelId(c.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-md border bg-card px-1.5 py-2 text-[11.5px] font-medium transition",
                        active
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="size-3.5" />
                      <span className="line-clamp-1 px-0.5 text-center">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="tp-tip"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              Tip (Rs)
            </Label>
            <Input
              id="tp-tip"
              type="number"
              min={0}
              step="0.01"
              value={tipStr}
              onChange={(e) => setTipStr(e.target.value)}
              placeholder="0"
              className="h-10 tabular-nums"
            />
          </div>

          <div className="space-y-1 rounded-md border bg-muted/30 px-3 py-2.5 text-[12.5px]">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            {order.discount ? (
              <Row
                label="Discount"
                value={`−${formatCurrency(order.discount)}`}
                muted
              />
            ) : null}
            <Row label="Tax" value={formatCurrency(order.tax)} muted />
            {tipValid && tipNum > 0 ? (
              <Row label="Tip" value={formatCurrency(tipNum)} muted />
            ) : null}
            <Separator className="my-1" />
            <Row label="Charge" value={formatCurrency(grandTotal)} bold />
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
            onClick={takePayment}
            disabled={!tipValid || submitting || !selectedChannel}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Charging…
              </>
            ) : (
              <>
                <Receipt className="size-3.5" />
                Charge {formatCurrency(grandTotal)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ReceiptPreviewDialog
      open={receiptOpen}
      onOpenChange={(o) => {
        setReceiptOpen(o);
        if (!o) onOpenChange(false);
      }}
      title="Payment receipt"
      description="Print to thermal, OS print, or download as a PDF."
      receipts={receipts}
    />
    </>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</dt>
      <dd
        className={cn(
          "tabular-nums",
          muted ? "text-muted-foreground" : "text-foreground",
          bold && "text-[14.5px] font-semibold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
