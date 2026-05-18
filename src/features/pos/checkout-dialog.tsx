"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ReceiptText, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  addItemsToHeldOrderAction,
  placeOrderAction,
} from "@/lib/actions/orders";
import { useCart } from "@/store/cart-store";
import { useTables } from "@/store/tables-store";
import { formatCurrency } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
};

type Status = "review" | "processing" | "success";

type SuccessInfo = {
  orderNumber: string;
  total: number;
  appended: boolean;
};

/**
 * Renamed from "checkout" in spirit — this dialog confirms placement
 * of a held order (no payment captured). When the cart is attached to
 * an existing held order, it appends the new items instead.
 *
 * Payment happens later, from the Order Detail drawer's "Take payment"
 * button (or the cancellation flow if the customer changes their mind).
 */
export function CheckoutDialog({
  open,
  onOpenChange,
  total,
  subtotal,
  tax,
  discount,
}: Props) {
  const router = useRouter();
  const {
    items,
    channel,
    tableId,
    note,
    discountPct,
    taxRate,
    attachedOrderId,
    attachedOrderNumber,
    clear,
    detach,
  } = useCart();
  const tables = useTables((s) => s.tables);
  const table = tables.find((t) => t.id === tableId)?.name;
  const [status, setStatus] = React.useState<Status>("review");
  const [success, setSuccess] = React.useState<SuccessInfo | null>(null);

  React.useEffect(() => {
    if (open) {
      setStatus("review");
      setSuccess(null);
    }
  }, [open]);

  const isAttach = Boolean(attachedOrderId);

  async function submit() {
    setStatus("processing");

    const payload = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      modifiers: i.modifiers,
    }));

    const result = isAttach
      ? await addItemsToHeldOrderAction(attachedOrderId!, payload)
      : await placeOrderAction({
          items: payload,
          channel,
          tableId,
          note,
          discountPct,
          taxRate,
        });

    if (!result.ok) {
      toast.error(isAttach ? "Couldn't add items" : "Couldn't place order", {
        description: result.error,
      });
      setStatus("review");
      return;
    }

    setSuccess({
      orderNumber: result.orderNumber,
      total: result.total,
      appended: isAttach,
    });
    setStatus("success");
    toast.success(
      isAttach
        ? `Items added to ${result.orderNumber}`
        : `Order ${result.orderNumber} sent to kitchen`,
      {
        description: `Running total ${formatCurrency(result.total)} · payment due at pickup`,
      },
    );
    router.refresh();
  }

  function dismiss() {
    if (status === "success") {
      clear();
      detach();
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {status === "success"
              ? isAttach
                ? "Items added"
                : "Order on hold"
              : isAttach
                ? `Add to ${attachedOrderNumber ?? "held order"}`
                : "Place order"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            {status === "success"
              ? "Kitchen has the ticket. Collect payment from the order detail drawer when the customer's ready."
              : `Send to kitchen — payment collected later. ${channel}${table ? ` · ${table}` : ""}.`}
          </DialogDescription>
        </DialogHeader>

        {status === "success" && success ? (
          <div className="flex flex-col items-center gap-3 px-5 py-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-5" />
            </div>
            <p className="text-[18px] font-semibold tabular-nums">
              {formatCurrency(success.total)}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {success.appended ? "Added to" : "Held as"} order {success.orderNumber}
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Payment due at pickup / served
            </p>
          </div>
        ) : (
          <div className="space-y-3 px-5 py-2">
            <ul className="max-h-[180px] space-y-1.5 overflow-y-auto pr-1 text-[12.5px]">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between">
                  <span className="truncate text-foreground">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(i.unitPrice * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <dl className="space-y-1 text-[12.5px]">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              {discount > 0 ? (
                <Row label="Discount" value={`−${formatCurrency(discount)}`} muted />
              ) : null}
              <Row label="Tax" value={formatCurrency(tax)} muted />
              <Separator className="my-1" />
              <Row label="Total (due on pickup)" value={formatCurrency(total)} bold />
            </dl>
          </div>
        )}

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          {status === "success" ? (
            <>
              <span />
              <Button size="sm" className="h-9 rounded-md text-[12.5px]" onClick={dismiss}>
                <Send className="size-3.5" />
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md text-[12.5px]"
                onClick={dismiss}
                disabled={status === "processing"}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-9 rounded-md text-[12.5px]"
                onClick={submit}
                disabled={status === "processing"}
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {isAttach ? "Adding…" : "Placing…"}
                  </>
                ) : (
                  <>
                    <ReceiptText className="size-3.5" />
                    {isAttach ? "Add to order" : "Send to kitchen"}
                  </>
                )}
              </Button>
            </>
          )}
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
        className={`tabular-nums ${
          muted ? "text-muted-foreground" : bold ? "font-semibold text-foreground" : "text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
