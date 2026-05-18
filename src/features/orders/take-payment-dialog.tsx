"use client";

import * as React from "react";
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
import { payOrderAction } from "@/lib/actions/orders";
import { cn, formatCurrency } from "@/lib/utils";
import type { Order, PaymentMethod } from "@/types";

const METHODS: { value: PaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "wallet", label: "Wallet", icon: Smartphone },
  { value: "online", label: "Online", icon: Wifi },
];

export function TakePaymentDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [method, setMethod] = React.useState<PaymentMethod>("card");
  const [tipStr, setTipStr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMethod("card");
      setTipStr("");
    }
  }, [open]);

  const tipNum = tipStr ? Number(tipStr) : 0;
  const tipValid = Number.isFinite(tipNum) && tipNum >= 0;
  const baseTotal =
    order.subtotal - (order.discount ?? 0) + order.tax;
  const grandTotal = baseTotal + (tipValid ? tipNum : 0);

  async function takePayment() {
    if (!tipValid || submitting) return;
    setSubmitting(true);
    try {
      const result = await payOrderAction({
        orderId: order.id,
        payment: method,
        tip: tipNum > 0 ? tipNum : undefined,
      });
      if (!result.ok) {
        toast.error("Payment failed", { description: result.error });
        return;
      }
      toast.success(`${formatCurrency(result.total)} captured`, {
        description: `Receipt ${result.receiptNumber}${
          result.fiscalInvoiceNumber
            ? ` · BRA ${result.fiscalInvoiceNumber}`
            : ""
        }`,
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
            <div className="grid grid-cols-4 gap-1.5">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.value;
                return (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md border bg-card py-2 text-[11.5px] font-medium transition",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {m.label}
                  </button>
                );
              })}
            </div>
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
            disabled={!tipValid || submitting}
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
