"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  Loader2,
  ReceiptText,
  Send,
  Smartphone,
  Wallet,
  Wifi,
} from "lucide-react";
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
  PaymentReceiptData,
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
import { tryAutoPrintReceipts } from "@/lib/print/print-receipts";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import type { KitchenTicketItem, PaymentMethod } from "@/types";
import { cartSubtotal, useCart } from "@/store/cart-store";
import { useMenu } from "@/store/menu-store";
import { useOfflineOrders } from "@/store/offline-orders-store";
import { useStations } from "@/store/stations-store";
import { useTables } from "@/store/tables-store";
import { useWorkspace } from "@/store/workspace-store";
import { cn, formatCurrency } from "@/lib/utils";

type Status = "review" | "processing" | "success";

type SuccessInfo = {
  orderNumber: string;
  total: number;
  appended: boolean;
  /** Payment was captured at placement (takeaway / delivery pay-now). */
  paid: boolean;
  /** Delivery order placed unpaid — cash collected on delivery. */
  cod: boolean;
};

const KIND_ICON: Record<PaymentMethod, typeof Wallet> = {
  card: CreditCard,
  cash: Wallet,
  wallet: Smartphone,
  online: Wifi,
};

/**
 * Confirms placement of an order. Behaviour depends on the cart channel:
 *
 *   - dine-in            → held, unpaid (payment collected later).
 *   - takeaway           → place + capture payment now, print receipt.
 *   - delivery (COD)     → held, unpaid; cash collected on delivery.
 *   - delivery (pay now) → place + capture payment with a non-cash
 *                          method (cash is COD's job), print receipt.
 *
 * Kitchen tickets (one per routed station) print on every placement.
 * When the cart is attached to an existing held order it appends items
 * instead and never takes payment here.
 */
export function CheckoutDialog({
  channels = [],
}: {
  channels?: PaymentChannel[];
}) {
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
  const [deliveryMode, setDeliveryMode] = React.useState<"cod" | "paynow">(
    "cod",
  );
  const [payChannelId, setPayChannelId] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setStatus("review");
      setSuccess(null);
    }
  }, [open]);

  const isAttach = Boolean(attachedOrderId);
  const isTakeaway = channel === "takeaway";
  const isDelivery = channel === "delivery";

  const activeChannels = React.useMemo(
    () => channels.filter((c) => !c.archived),
    [channels],
  );
  const nonCashChannels = React.useMemo(
    () => activeChannels.filter((c) => c.kind !== "cash"),
    [activeChannels],
  );

  // Which methods are offered, by channel: takeaway → all; delivery
  // pay-now → non-cash only (cash-on-delivery is the COD path).
  const channelOptions = isAttach
    ? []
    : isTakeaway
      ? activeChannels
      : isDelivery && deliveryMode === "paynow"
        ? nonCashChannels
        : [];

  // Default the highlighted method to the first option without an
  // effect (avoids a setState-in-effect): an explicit pick wins, else
  // fall back to the first available method.
  const selectedChannel =
    channelOptions.find((c) => c.id === payChannelId) ??
    channelOptions[0] ??
    null;

  const payNow =
    !isAttach && (isTakeaway || (isDelivery && deliveryMode === "paynow"));

  async function submit() {
    if (payNow && !selectedChannel) {
      toast.error("Pick a payment method");
      return;
    }
    if (
      payNow &&
      typeof navigator !== "undefined" &&
      !navigator.onLine
    ) {
      toast.error("Taking payment needs internet", {
        description:
          "Use Cash on delivery, or place a held order and collect payment later.",
      });
      return;
    }

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
      ...(payNow && selectedChannel
        ? {
            prepay: {
              payment: selectedChannel.kind,
              paymentChannelId: selectedChannel.id,
            },
          }
        : {}),
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

    let onlineResult: {
      orderNumber: string;
      total: number;
      paid: boolean;
      receiptNumber?: string;
      fiscalInvoiceNumber?: string;
    } | null = null;
    const appended = isAttach;
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
        orderNumber: result.orderNumber,
        total: result.total,
        paid: Boolean(result.paid),
        receiptNumber: result.receiptNumber,
        fiscalInvoiceNumber: result.fiscalInvoiceNumber,
      };
    } catch (err) {
      // navigator.onLine can lie (captive portal, flaky wifi). If the
      // network actually failed mid-flight and this is a new held order,
      // drop into the offline queue. Prepaid orders can't go offline
      // (no payment capture), so they error out instead.
      if (!isAttach && !payNow && isLikelyNetworkError(err)) {
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

    const paid = Boolean(onlineResult?.paid);
    const cod = isDelivery && !payNow && !isAttach && Boolean(onlineResult);

    setSuccess({
      orderNumber: resolvedOrderNumber,
      total: resolvedTotal,
      appended,
      paid,
      cod,
    });
    setStatus("success");
    if (onlineResult) {
      if (paid) {
        toast.success(`Order ${resolvedOrderNumber} placed & paid`, {
          description: `${formatCurrency(resolvedTotal)} charged${
            selectedChannel ? ` · ${selectedChannel.name}` : ""
          }`,
        });
      } else {
        toast.success(
          isAttach
            ? `Items added to ${resolvedOrderNumber}`
            : `Order ${resolvedOrderNumber} sent to kitchen`,
          {
            description: cod
              ? "Cash on delivery — collect when delivered"
              : `Running total ${formatCurrency(resolvedTotal)} · payment due at pickup`,
          },
        );
      }
    }

    // Build receipts: a payment receipt for prepaid orders, plus one
    // kitchen ticket per routed station. Auto-print to a paired thermal
    // printer if one is connected; otherwise fall back to the preview
    // modal (OS print / PDF / dev with no printer). Pairing a printer
    // activates auto-print with no further code change.
    if (workspace) {
      const wsHeader = {
        name: workspace.name,
        city: workspace.city,
        addressLine: workspace.addressLine,
        taxId: workspace.taxId,
        legalEntity: workspace.legalEntity,
        receiptFooter: workspace.receiptFooter,
        receiptWidth: workspace.receiptWidth,
      };
      const placedAt = new Intl.DateTimeFormat("en-GB", {
        timeZone: workspace.timezone || undefined,
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

      const toPrint: ReceiptPayload[] = [];

      if (paid && selectedChannel) {
        const lineItems: ReceiptLineItem[] = items.map((ci) => ({
          quantity: ci.quantity,
          name: ci.name,
          amount: ci.unitPrice * ci.quantity,
          modifiers:
            ci.modifiers.length > 0
              ? ci.modifiers.map((m) => m.name)
              : undefined,
        }));
        const totals: PaymentReceiptData["totals"] = [
          { label: "Subtotal", amount: subtotal, muted: true },
        ];
        if (discount > 0) {
          totals.push({ label: "Discount", amount: -discount, muted: true });
        }
        if (tax > 0) totals.push({ label: "Tax", amount: tax, muted: true });
        totals.push({ label: "Total", amount: total, bold: true });

        const paymentData: PaymentReceiptData = {
          header: { workspace: wsHeader, kind: "Payment receipt", printedAt: placedAt },
          orderNumber: resolvedOrderNumber,
          receiptNumber:
            onlineResult?.receiptNumber ??
            `BR-${resolvedOrderNumber.replace(/^#/, "")}`,
          channel,
          table: table ?? null,
          guests: undefined,
          staff: null,
          customer: null,
          items: lineItems,
          totals,
          payment: {
            method: selectedChannel.kind,
            channelName: selectedChannel.name,
          },
          fiscalInvoiceNumber: onlineResult?.fiscalInvoiceNumber ?? null,
          notes: note?.trim() || null,
        };
        toPrint.push({ kind: "payment", data: paymentData });
      }

      if (stations.length > 0) {
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
        for (const [stationId, lineItems] of byStation.entries()) {
          const stationName = stationById.get(stationId)?.name ?? "Kitchen";
          const data: KitchenTicketData = {
            header: {
              workspace: wsHeader,
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
          toPrint.push({ kind: "kitchen", data });
        }
      }

      if (toPrint.length > 0) {
        try {
          const printed = await tryAutoPrintReceipts(toPrint);
          if (printed) {
            toast.success(
              toPrint.length > 1
                ? `${toPrint.length} receipts sent to printer`
                : "Receipt sent to printer",
            );
          } else {
            setReceipts(toPrint);
            setReceiptOpen(true);
          }
        } catch (err) {
          toast.error("Couldn't reach the printer", {
            description: err instanceof Error ? err.message : "Print failed",
          });
          setReceipts(toPrint);
          setReceiptOpen(true);
        }
      }
    }

    // router.refresh() picks up the new order from the server. Offline
    // orders don't exist server-side yet, so a refresh would be a no-op
    // — skip it; OfflineReplay refreshes when the queue drains.
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
    setDeliveryMode("cod");
    setPayChannelId("");
    setCheckoutOpen(false);
  }

  const totalLabel = payNow
    ? "Total (charged now)"
    : isDelivery
      ? "Total (cash on delivery)"
      : "Total (due on pickup)";

  const confirmLabel = isAttach
    ? "Add to order"
    : payNow
      ? `Place & charge ${formatCurrency(total)}`
      : isDelivery
        ? "Place · COD"
        : "Send to kitchen";

  const showPaymentPicker = payNow;
  const showDeliveryToggle = isDelivery && !isAttach;
  const disableConfirm =
    status === "processing" || (payNow && !selectedChannel);

  return (
    <>
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {status === "success"
              ? success?.paid
                ? "Paid"
                : isAttach
                  ? "Items added"
                  : success?.cod
                    ? "Order placed · COD"
                    : "Order on hold"
              : isAttach
                ? `Add to ${attachedOrderNumber ?? "held order"}`
                : "Place order"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            {status === "success"
              ? success?.paid
                ? "Payment captured. Kitchen has the ticket — hand it over once it's ready."
                : success?.cod
                  ? "Kitchen has the ticket. Collect cash when the order is delivered."
                  : "Kitchen has the ticket. Collect payment from the order detail drawer when ready."
              : payNow
                ? `Send to kitchen and charge now · ${channel}${table ? ` · ${table}` : ""}.`
                : isDelivery
                  ? `Send to kitchen · cash on delivery · ${channel}.`
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
              {success.appended
                ? "Added to"
                : success.paid
                  ? "Paid · order"
                  : "Held as order"}{" "}
              {success.orderNumber}
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              {success.paid
                ? "Payment captured"
                : success.cod
                  ? "Cash on delivery — collect when delivered"
                  : "Payment due at pickup / served"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 px-5 py-2">
            <ul className="max-h-[160px] space-y-1.5 overflow-y-auto pr-1 text-[12.5px]">
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
              <Row label={totalLabel} value={formatCurrency(total)} bold />
            </dl>

            {showDeliveryToggle ? (
              <div className="grid grid-cols-2 gap-1.5">
                {(["cod", "paynow"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDeliveryMode(mode)}
                    aria-pressed={deliveryMode === mode}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-[12px] font-medium transition",
                      deliveryMode === mode
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {mode === "cod" ? "Cash on delivery" : "Pay now"}
                  </button>
                ))}
              </div>
            ) : null}

            {showPaymentPicker ? (
              channelOptions.length === 0 ? (
                <p className="rounded-md border border-dashed bg-muted/30 px-3 py-2.5 text-center text-[12px] text-muted-foreground">
                  No {isDelivery ? "non-cash " : ""}payment methods configured.
                  Add one in Settings → Payment methods.
                </p>
              ) : (
                <div
                  className={cn(
                    "grid gap-1.5",
                    channelOptions.length <= 2
                      ? "grid-cols-2"
                      : channelOptions.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-2 sm:grid-cols-4",
                  )}
                >
                  {channelOptions.map((c) => {
                    const Icon = KIND_ICON[c.kind];
                    const active = selectedChannel?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPayChannelId(c.id)}
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
              )
            ) : null}
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
                disabled={disableConfirm}
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {payNow ? "Charging…" : isAttach ? "Adding…" : "Placing…"}
                  </>
                ) : (
                  <>
                    <ReceiptText className="size-3.5" />
                    {confirmLabel}
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
      title="Order receipts"
      description={
        receipts.length > 1
          ? `Payment receipt + kitchen tickets (${receipts.length}).`
          : "Print to the printer or download as a PDF."
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
