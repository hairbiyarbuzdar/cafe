"use client";

import * as React from "react";
import {
  Bike,
  ChevronDown,
  Clock,
  Link2,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";
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
import { CancelHeldOrderDialog } from "@/features/orders/cancel-held-dialog";
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
  const [cancelTarget, setCancelTarget] = React.useState<
    { id: string; number: string } | null
  >(null);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const attachedOrderId = useCart((s) => s.attachedOrderId);
  const attachedOrderNumber = useCart((s) => s.attachedOrderNumber);
  const attach = useCart((s) => s.attach);
  const detach = useCart((s) => s.detach);

  // Close all expansions when the dialog itself closes — re-opening
  // the picker should start collapsed.
  React.useEffect(() => {
    if (!open) setExpanded(new Set());
  }, [open]);

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

  function requestCancel(e: React.MouseEvent, o: HeldOrderSummary) {
    e.stopPropagation();
    setCancelTarget({ id: o.id, number: o.number });
  }

  function toggleExpanded(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
                const isExpanded = expanded.has(o.id);
                return (
                  <li
                    key={o.id}
                    className={cn(
                      "group rounded-md px-1 transition-colors hover:bg-muted/60",
                      active && "bg-warning/8",
                    )}
                  >
                    <div className="flex items-start gap-1 py-0.5">
                      <button
                        type="button"
                        onClick={(e) => toggleExpanded(e, o.id)}
                        className="mt-2 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={
                          isExpanded
                            ? `Collapse ${o.number} items`
                            : `Show ${o.number} items`
                        }
                        aria-expanded={isExpanded}
                      >
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => pick(o)}
                        className="flex flex-1 items-start gap-3 rounded-md px-1 py-2 text-left"
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
                        <span className="inline-flex items-center gap-1 self-center text-[12.5px] font-semibold tabular-nums">
                          <Clock className="size-3 text-muted-foreground" />
                          {formatCurrency(o.total)}
                        </span>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => requestCancel(e, o)}
                        className="mt-2 shrink-0 rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label={`Cancel ${o.number}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    {isExpanded ? (
                      <ul className="ms-9 me-2 mb-2 rounded-md border bg-card/60 px-3 py-2 text-[11.5px]">
                        {o.items.length === 0 ? (
                          <li className="py-1 text-muted-foreground">
                            No items recorded for this order.
                          </li>
                        ) : (
                          o.items.map((it) => {
                            const line = it.unitPrice * it.quantity;
                            return (
                              <li
                                key={it.id}
                                className="flex items-start justify-between gap-2 py-1"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-foreground">
                                    <span className="font-mono tabular-nums text-muted-foreground">
                                      {it.quantity}×
                                    </span>{" "}
                                    {it.name}
                                  </p>
                                  {it.modifiers.length > 0 ? (
                                    <p className="truncate text-[10.5px] text-muted-foreground">
                                      {it.modifiers.join(" · ")}
                                    </p>
                                  ) : null}
                                  {it.note ? (
                                    <p className="truncate text-[10.5px] italic text-muted-foreground">
                                      {it.note}
                                    </p>
                                  ) : null}
                                </div>
                                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                                  {formatCurrency(line)}
                                </span>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    ) : null}
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

      {cancelTarget ? (
        <CancelHeldOrderDialog
          order={cancelTarget}
          open={cancelTarget !== null}
          onOpenChange={(o) => {
            if (!o) setCancelTarget(null);
          }}
        />
      ) : null}
    </Dialog>
  );
}
