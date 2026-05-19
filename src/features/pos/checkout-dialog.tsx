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
} from "@/lib/actions/orders";
import { useCart } from "@/store/cart-store";
import { useMenu } from "@/store/menu-store";
import { useStations } from "@/store/stations-store";
import { useTables } from "@/store/tables-store";
import { useWorkspace } from "@/store/workspace-store";
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
    guests,
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

    const result = isAttach
      ? await addItemsToHeldOrderAction(attachedOrderId!, payload)
      : await placeOrderAction({
          items: payload,
          channel,
          tableId,
          guests,
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

    // Auto-build kitchen tickets per routed station so the cashier
    // can immediately print/send them to the kitchen printer(s).
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
            orderNumber: result.orderNumber,
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
