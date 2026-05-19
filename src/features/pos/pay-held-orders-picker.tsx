"use client";

import * as React from "react";
import {
  Bike,
  Loader2,
  Receipt,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TakePaymentDialog } from "@/features/orders/take-payment-dialog";
import { loadOrderForPaymentAction } from "@/lib/actions/orders";
import type { HeldOrderSummary } from "@/lib/queries/orders";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { Order, OrderChannel } from "@/types";

const CHANNEL_ICON: Record<OrderChannel, typeof Utensils> = {
  "dine-in": Utensils,
  takeaway: ShoppingBag,
  delivery: Bike,
  online: ShoppingBag,
};

/**
 * POS-side "Pay" entry point. Lists held orders; picking one
 * hydrates the full Order (server action) and opens the existing
 * `TakePaymentDialog`. Lets cashiers close out a tab without
 * jumping to /orders.
 */
export function PayHeldOrdersPicker({
  orders,
  channels = [],
  className,
}: {
  orders: HeldOrderSummary[];
  channels?: PaymentChannel[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [target, setTarget] = React.useState<Order | null>(null);

  async function pick(o: HeldOrderSummary) {
    if (loadingId) return;
    setLoadingId(o.id);
    try {
      const result = await loadOrderForPaymentAction(o.id);
      if (!result.ok) {
        toast.error("Couldn't open payment", { description: result.error });
        return;
      }
      setTarget(result.order);
      setOpen(false);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "shrink-0 rounded-md px-3 text-[13px] font-semibold",
              className,
            )}
            disabled={orders.length === 0}
            title={
              orders.length === 0 ? "No held orders to pay" : undefined
            }
          >
            <Receipt className="size-4" />
            Pay
            {orders.length > 0 ? (
              <span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {orders.length}
              </span>
            ) : null}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[480px] gap-0 rounded-lg p-0">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Take payment
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Pick the held order to close out. We&apos;ll open the payment
              method picker next.
            </DialogDescription>
          </DialogHeader>

          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center text-[12.5px] text-muted-foreground">
              No held orders right now.
            </div>
          ) : (
            <ScrollArea className="max-h-[420px] px-5 pb-1 pt-3">
              <ul className="divide-y">
                {orders.map((o) => {
                  const Icon = CHANNEL_ICON[o.channel];
                  const isLoading = loadingId === o.id;
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => pick(o)}
                        disabled={isLoading}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/60 disabled:opacity-60",
                        )}
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Icon className="size-3.5" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-[13px] font-medium">
                            <span className="font-mono tabular-nums">
                              {o.number}
                            </span>
                            {o.table ? (
                              <Badge
                                variant="outline"
                                className="rounded-md text-[10.5px] font-normal text-muted-foreground"
                              >
                                {o.table}
                              </Badge>
                            ) : null}
                          </p>
                          <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                            {o.customerName ?? "Walk-in"} ·{" "}
                            {o.itemCount} item{o.itemCount === 1 ? "" : "s"} ·{" "}
                            {formatRelativeTime(o.createdAt)}
                          </p>
                        </div>
                        <span className="self-center text-[12.5px] font-semibold tabular-nums">
                          {formatCurrency(o.total)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {target ? (
        <TakePaymentDialog
          order={target}
          channels={channels}
          open={target !== null}
          onOpenChange={(o) => {
            if (!o) setTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
