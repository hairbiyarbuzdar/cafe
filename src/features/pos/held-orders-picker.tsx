"use client";

import * as React from "react";
import { Bike, Clock, Link2, ShoppingBag, Utensils } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HeldOrderSummary } from "@/lib/queries/orders";
import { useCart } from "@/store/cart-store";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { OrderChannel } from "@/types";

const CHANNEL_ICON: Record<OrderChannel, typeof Utensils> = {
  "dine-in": Utensils,
  takeaway: ShoppingBag,
  delivery: Bike,
  online: ShoppingBag,
};

/**
 * Lists every held order; tapping one binds the POS cart to it. The
 * cart panel then renders "Adding to #X" and posts new items via
 * `addItemsToHeldOrderAction` instead of placing a new order.
 */
export function HeldOrdersPicker({ orders }: { orders: HeldOrderSummary[] }) {
  const [open, setOpen] = React.useState(false);
  const attachedOrderId = useCart((s) => s.attachedOrderId);
  const attachedOrderNumber = useCart((s) => s.attachedOrderNumber);
  const attach = useCart((s) => s.attach);
  const detach = useCart((s) => s.detach);

  function pick(o: HeldOrderSummary) {
    attach(o.id, o.number);
    toast.success(`Attached to ${o.number}`, {
      description: "Items you add now will be appended to the held order.",
    });
    setOpen(false);
  }

  function clearAttach() {
    detach();
    toast.success("Detached", { description: "Starting a new order" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-10 rounded-md text-[12.5px]",
            attachedOrderId && "border-warning/40 bg-warning/10 text-warning-foreground/90",
          )}
        >
          <Link2 className="size-3.5" />
          {attachedOrderId ? `Editing ${attachedOrderNumber}` : "Add to held"}
          {!attachedOrderId && orders.length > 0 ? (
            <span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {orders.length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] gap-0 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Held orders
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Pick the order the customer is adding to. New items skip the
            new-order flow and append directly to that ticket.
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
                const active = o.id === attachedOrderId;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => pick(o)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/60",
                        active && "bg-warning/8",
                      )}
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[13px] font-medium">
                          <span className="font-mono tabular-nums">{o.number}</span>
                          {o.table ? (
                            <Badge
                              variant="outline"
                              className="rounded-md text-[10.5px] font-normal text-muted-foreground"
                            >
                              {o.table}
                            </Badge>
                          ) : null}
                          {active ? (
                            <Badge className="rounded-md border-warning/40 bg-warning/15 text-warning-foreground/90">
                              Attached
                            </Badge>
                          ) : null}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                          {o.customerName ?? "Walk-in"} ·{" "}
                          {o.itemCount} item{o.itemCount === 1 ? "" : "s"} ·{" "}
                          {formatRelativeTime(o.createdAt)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold tabular-nums">
                        <Clock className="size-3 text-muted-foreground" />
                        {formatCurrency(o.total)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}

        {attachedOrderId ? (
          <div className="flex items-center justify-end gap-2 border-t bg-surface-1 px-5 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-md text-[12.5px] text-muted-foreground"
              onClick={clearAttach}
            >
              Detach
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
