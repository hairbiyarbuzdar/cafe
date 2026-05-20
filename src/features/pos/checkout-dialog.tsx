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
import { ReceiptPreviewDialog, type ReceiptPayload } from "@/features/receipts/receipt-preview-dialog";
import type {
  KitchenTicketData,
  ReceiptLineItem,
} from "@/features/receipts/receipt-models";
import {
  addItemsToHeldOrderAction,
  placeOrderAction,
  type PlaceOrderInput,
} from "@/lib/actions/orders";
import {
  enqueueMutation,
  generateLocalId,
  generateLocalOrderNumber,
  type ShadowStation,
} from "@/lib/offline/queue";
import type { KitchenTicketItem } from "@/types";
import { cartSubtotal, useCart } from "@/store/cart-store";
import { useMenu } from "@/store/menu-store";
import { useOfflineOrders } from "@/store/offline-orders-store";
import { useStations } from "@/store/stations-store";
import { useTables } from "@/store/tables-store";
import { useWorkspace } from "@/store/workspace-store";
import { formatCurrency } from "@/lib/utils";

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
export function CheckoutDialog() {
  const router = useRouter();
  const {
    items,
    channel,
    tableId,
    guests,
    note,
    discountPct,
    taxRate,
    attachedOrderId,
    attachedOrderNumber,
    clear,
    detach,
    checkoutOpen,
    setCheckoutOpen,
  } = useCart();

  // Totals are derived from the cart store rather than passed in as
  // props: the dialog is rendered at the page root (not inside the
  // cart panel), so it owns the same computation the panel does.
  const open = checkoutOpen;
  const subtotal = cartSubtotal(items);
  const discount = subtotal * (discountPct / 100);
  const taxable = subtotal - discount;
  const tax = taxable * taxRate;
  const total = taxable + tax;

  const tables = useTables((s) => s.tables);
  const table = tables.find((t) => t.id === tableId)?.name;
  const menuItems = useMenu((s) => s.items);
  const stations = useStations((s) => s.stations);
  const workspace = useWorkspace((s) => s.workspace);
  const [status, setStatus] = React.useState<Status>("review");
  const [success, setSuccess] = React.useState<SuccessInfo | null>(null);
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [receipts, setReceipts] = React.useState<ReceiptPayload[]>([]);

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
    const placeInput: PlaceOrderInput = {
      items: payload,
      channel,
      tableId,
      guests,
      note,
      discountPct,
      taxRate,
    };

    // Append-to-held requires the server (we don't know the real
    // ticket id offline, so we can't queue against it). Block it
    // explicitly with a clear message; placing a new offline order
    // still works.
    if (isAttach && typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error("Adding to a held order needs internet", {
        description: "Detach and place a new order — it will sync when you're back online.",
      });
      setStatus("review");
      return;
    }

    let onlineResult: { ok: true; orderNumber: string; total: number } | null = null;
    let appended = isAttach;
    let usedOfflineFallback = false;

    try {
      const result = isAttach
        ? await addItemsToHeldOrderAction(attachedOrderId!, payload)
        : await placeOrderAction(placeInput);
      if (!result.ok) {
        toast.error(isAttach ? "Couldn't add items" : "Couldn't place order", {
          description: result.error,
        });
        setStatus("review");
        return;
      }
      onlineResult = {
        ok: true,
        orderNumber: result.orderNumber,
        total: result.total,
      };
    } catch (err) {
      // navigator.onLine can lie (captive portal, flaky wifi). If the
      // network actually failed mid-flight and this is a new order,
      // drop into the offline queue. For attach mode we already
      // returned above.
      if (!isAttach && isLikelyNetworkError(err)) {
        usedOfflineFallback = true;
      } else {
        toast.error(isAttach ? "Couldn't add items" : "Couldn't place order", {
          description: err instanceof Error ? err.message : String(err),
        });
        setStatus("review");
        return;
      }
    }

    let resolvedOrderNumber: string;
    let resolvedTotal: number;

    if (onlineResult) {
      resolvedOrderNumber = onlineResult.orderNumber;
      resolvedTotal = onlineResult.total;
    } else {
      // Offline path: queue the mutation, surface a local shadow so
      // the cashier sees the order in the topbar pill count, and use
      // a local order number ("L-…") for the kitchen ticket.
      const localId = generateLocalId();
      resolvedOrderNumber = generateLocalOrderNumber();
      resolvedTotal = total;
      const itemCount = items.reduce((s, i) => s + i.quantity, 0);

      // Per-station breakdown so the kitchen board can render
      // synthetic tickets for this order before it syncs. We map
      // each cart line → its product's `stationId` from the menu
      // store; unknown products are dropped (the cart shouldn't
      // contain them but we don't want a missing menu item to
      // tank the whole place-offline flow).
      const stationsMap = new Map<string, KitchenTicketItem[]>();
      for (const ci of items) {
        const menu = menuItems.find((m) => m.id === ci.productId);
        if (!menu) continue;
        const list = stationsMap.get(menu.stationId) ?? [];
        list.push({
          id: `${localId}__${menu.stationId}__${list.length}`,
          menuItemId: ci.productId,
          name: ci.name,
          quantity: ci.quantity,
          modifiers:
            ci.modifiers && ci.modifiers.length > 0
              ? ci.modifiers.map((m) => m.name)
              : undefined,
        });
        stationsMap.set(menu.stationId, list);
      }
      const shadowStations: ShadowStation[] = Array.from(stationsMap.entries()).map(
        ([stationId, items]) => ({ stationId, items }),
      );
      const shadow = {
        id: localId,
        number: resolvedOrderNumber,
        total: resolvedTotal,
        itemCount,
        channel,
        tableName: table ?? null,
        createdAt: Date.now(),
        stations: shadowStations,
        notes: note?.trim() || null,
      };
      try {
        await enqueueMutation({
          id: localId,
          type: "placeOrder",
          input: placeInput,
          shadow,
          attempts: 0,
        });
        useOfflineOrders.getState().add(shadow);
      } catch (err) {
        toast.error("Couldn't queue offline order", {
          description: err instanceof Error ? err.message : "IndexedDB unavailable",
        });
        setStatus("review");
        return;
      }
      toast.warning(`${resolvedOrderNumber} held offline`, {
        description: usedOfflineFallback
          ? "Network dropped — order saved locally and will sync when reachable."
          : "You're offline — order will sync to the kitchen when the connection returns.",
      });
    }

    setSuccess({
      orderNumber: resolvedOrderNumber,
      total: resolvedTotal,
      appended,
    });
    setStatus("success");
    if (onlineResult) {
      toast.success(
        isAttach
          ? `Items added to ${resolvedOrderNumber}`
          : `Order ${resolvedOrderNumber} sent to kitchen`,
        {
          description: `Running total ${formatCurrency(resolvedTotal)} · payment due at pickup`,
        },
      );
    }

    // Auto-build kitchen tickets per routed station so the cashier
    // can immediately print/send them to the kitchen printer(s).
    // Offline orders still build tickets — the cashier can print
    // them locally so the kitchen has paper while waiting for sync.
    if (workspace && stations.length > 0) {
      const stationById = new Map(stations.map((s) => [s.id, s]));
      const byStation = new Map<string, ReceiptLineItem[]>();
      for (const ci of items) {
        const menu = menuItems.find((m) => m.id === ci.productId);
        if (!menu) continue;
        const list = byStation.get(menu.stationId) ?? [];
        list.push({
          quantity: ci.quantity,
          name: ci.name,
          amount: ci.unitPrice * ci.quantity,
          modifiers:
            ci.modifiers.length > 0
              ? ci.modifiers.map((m) => m.name)
              : undefined,
        });
        byStation.set(menu.stationId, list);
      }
      const placedAt = new Intl.DateTimeFormat("en-GB", {
        timeZone: workspace.timezone || undefined,
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
      const tickets: ReceiptPayload[] = Array.from(byStation.entries()).map(
        ([stationId, lineItems]) => {
          const stationName = stationById.get(stationId)?.name ?? "Kitchen";
          const data: KitchenTicketData = {
            header: {
              workspace: {
                name: workspace.name,
                city: workspace.city,
                addressLine: workspace.addressLine,
                taxId: workspace.taxId,
                legalEntity: workspace.legalEntity,
                receiptFooter: workspace.receiptFooter,
                receiptWidth: workspace.receiptWidth,
              },
              kind: `Kitchen · ${stationName}`,
              printedAt: placedAt,
            },
            orderNumber: resolvedOrderNumber,
            channel,
            table: table ?? null,
            guests: channel === "dine-in" ? guests : null,
            stationName,
            items: lineItems,
            placedAt,
            notes: note?.trim() || null,
          };
          return { kind: "kitchen", data };
        },
      );
      setReceipts(tickets);
      if (tickets.length > 0) setReceiptOpen(true);
    }

    // router.refresh() picks up the new held order from the server.
    // Offline orders don't exist server-side yet, so a refresh would
    // be a no-op — skip it; the OfflineReplay component will refresh
    // when the queue drains.
    if (onlineResult) router.refresh();
  }

  function isLikelyNetworkError(err: unknown): boolean {
    if (err instanceof TypeError) return true;
    const msg = err instanceof Error ? err.message : String(err);
    return /network|fetch|failed to fetch|offline/i.test(msg);
  }

  function dismiss() {
    if (status === "success") {
      clear();
      detach();
    }
    setCheckoutOpen(false);
  }

  return (
    <>
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

    <ReceiptPreviewDialog
      open={receiptOpen}
      onOpenChange={setReceiptOpen}
      title="Kitchen tickets"
      description={
        receipts.length > 1
          ? `One ticket per routed station (${receipts.length}).`
          : "Print to the kitchen printer or download as a PDF."
      }
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
        className={`tabular-nums ${
          muted ? "text-muted-foreground" : bold ? "font-semibold text-foreground" : "text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
