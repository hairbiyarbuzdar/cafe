"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Hourglass,
  Loader2,
  Mail,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  Send,
  Smartphone,
  Trash2,
  TriangleAlert,
  Utensils,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CancelHeldOrderDialog } from "@/features/orders/cancel-held-dialog";
import { ChannelBadge, OrderStatusBadge } from "@/features/orders/status-badge";
import { TakePaymentDialog } from "@/features/orders/take-payment-dialog";
import { buildPaymentReceipt } from "@/features/receipts/build";
import {
  ReceiptPreviewDialog,
  type ReceiptPayload,
} from "@/features/receipts/receipt-preview-dialog";
import { submitInvoiceToBraAction } from "@/lib/actions/fiscal";
import { completeOrderAction } from "@/lib/actions/orders";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { useCart } from "@/store/cart-store";
import { useWorkspace } from "@/store/workspace-store";
import { cn, formatCurrency, formatRelativeTime, initials } from "@/lib/utils";
import { isOrderHeld, type Order, type OrderStatus, type PaymentMethod } from "@/types";

const PAYMENT_ICON: Record<PaymentMethod, typeof Wallet> = {
  card: CreditCard,
  cash: Wallet,
  wallet: Smartphone,
  online: Smartphone,
};

const STAGES: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order placed" },
  { status: "preparing", label: "Preparing" },
  { status: "ready", label: "Ready for pickup" },
  { status: "completed", label: "Completed" },
];

type Props = {
  order: Order | null;
  paymentChannels?: PaymentChannel[];
  onClose: () => void;
};

export function OrderDetailDrawer({
  order,
  paymentChannels = [],
  onClose,
}: Props) {
  const open = Boolean(order);
  const PaymentIcon = order?.payment ? PAYMENT_ICON[order.payment] : CreditCard;
  const held = order ? isOrderHeld(order) : false;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col overflow-hidden p-0 sm:max-w-[460px]"
      >
        {order ? (
          <>
            <SheetHeader className="shrink-0 space-y-2 border-b p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="flex items-center gap-2 text-[16px] font-semibold">
                    Order {order.number}
                    {held ? (
                      <Badge className="rounded-md border-warning/30 bg-warning/12 text-warning-foreground/90">
                        <Hourglass className="size-3" />
                        On hold
                      </Badge>
                    ) : (
                      <OrderStatusBadge status={order.status} />
                    )}
                  </SheetTitle>
                  <SheetDescription className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px]">
                    <ChannelBadge channel={order.channel} />
                    {order.table ? (
                      <span className="inline-flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                        <Utensils className="size-3" />
                        {order.table}
                      </span>
                    ) : null}
                    <span className="text-muted-foreground">·</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" />
                      {new Date(order.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </SheetDescription>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 rounded-md border bg-surface-1 p-3">
                <Avatar className="size-9 rounded-md">
                  <AvatarFallback className="rounded-md bg-primary/12 text-[11px] font-semibold text-primary">
                    {initials(order.customer?.name ?? "WI")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {order.customer?.name ?? "Walk-in customer"}
                  </p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {order.customer?.phone ?? "No contact on file"}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" className="rounded-md">
                  <Mail className="size-3.5" />
                </Button>
              </div>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-5 p-5">
                <Section title="Timeline">
                  <ol className="space-y-3 ps-1 grid sm:grid-cols-2">
                    {STAGES.map((stage, idx) => {
                      const stageIndex = STAGES.findIndex((s) => s.status === order.status);
                      const done = idx <= stageIndex && order.status !== "cancelled";
                      const isCurrent = idx === stageIndex;
                      return (
                        <li key={stage.status} className="relative flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                              done
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-muted-foreground",
                              isCurrent && "ring-2 ring-primary/30",
                            )}
                          >
                            {done ? <Check className="size-3" /> : idx + 1}
                          </span>
                          <div className="-mt-0.5">
                            <p
                              className={cn(
                                "text-[12.5px] font-medium",
                                done ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {stage.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {isCurrent ? "Now" : done ? "Completed" : "Pending"}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Section>

                <Section title="Items">
                  <ul className="space-y-2.5">
                    {order.items.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-start justify-between gap-3 rounded-md border bg-card px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-foreground">
                            <span className="tabular-nums text-muted-foreground">
                              ×{i.quantity}
                            </span>
                            {i.name}
                          </p>
                          {i.modifiers && i.modifiers.length > 0 ? (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {i.modifiers.join(" · ")}
                            </p>
                          ) : null}
                        </div>
                        <span className="text-[12.5px] font-medium tabular-nums text-foreground">
                          {formatCurrency(i.unitPrice * i.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Payment">
                  <div className="space-y-1.5 rounded-md border bg-card p-3 text-[12.5px]">
                    <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
                    {order.discount ? (
                      <Row label="Discount" value={`−${formatCurrency(order.discount)}`} muted />
                    ) : null}
                    <Row label="Tax" value={formatCurrency(order.tax)} muted />
                    {order.tip ? <Row label="Tip" value={formatCurrency(order.tip)} muted /> : null}
                    <Separator className="my-1" />
                    <Row label="Total" value={formatCurrency(order.total)} bold />
                    <Separator className="my-1" />
                    <div className="flex items-center justify-between pt-1 text-[12px]">
                      {order.payment ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <PaymentIcon className="size-3.5" />
                            Paid via {order.payment}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-success">
                            <CircleCheck className="size-3.5" />
                            Captured
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Hourglass className="size-3.5" />
                            Payment due on pickup / served
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-warning-foreground/85">
                            <Clock className="size-3.5" />
                            Awaiting
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Section>

                <Section title="Fiscalization (BRA)">
                  <FiscalSection order={order} />
                </Section>

                {order.notes ? (
                  <Section title="Notes">
                    <div className="flex gap-2 rounded-md border bg-warning/8 px-3 py-2.5 text-[12.5px] text-foreground/85">
                      <CircleAlert className="mt-0.5 size-3.5 text-warning" />
                      {order.notes}
                    </div>
                  </Section>
                ) : null}
              </div>
            </ScrollArea>

            <OrderDrawerFooter
              order={order}
              held={held}
              paymentChannels={paymentChannels}
              onClose={onClose}
            />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function OrderDrawerFooter({
  order,
  held,
  paymentChannels,
  onClose,
}: {
  order: Order;
  held: boolean;
  paymentChannels: PaymentChannel[];
  onClose: () => void;
}) {
  const router = useRouter();
  const attach = useCart((s) => s.attach);
  const workspace = useWorkspace((s) => s.workspace);
  const [payOpen, setPayOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [reprintOpen, setReprintOpen] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const reprintPayload = React.useMemo<ReceiptPayload[]>(() => {
    if (!workspace) return [];
    const data = buildPaymentReceipt({
      order,
      workspace,
      receiptNumber: `BR-${order.number.replace(/^#/, "")}`,
      paymentChannelName:
        paymentChannels.find((c) => c.kind === order.payment)?.name ?? null,
    });
    return [{ kind: "payment", data }];
  }, [order, workspace, paymentChannels]);

  function startAddingItems() {
    attach(order.id, order.number);
    toast.success(`Attached cart to ${order.number}`, {
      description: "Pick items in the POS — they'll append to this order.",
    });
    onClose();
    router.push("/pos");
  }

  // Prepaid but not yet handed over: paid at placement (takeaway /
  // delivery pay-now) and still in the kitchen pipeline. Needs the
  // "Mark picked up / delivered" hand-off, not Take Payment.
  const awaitingHandoff =
    !held &&
    !!order.paidAt &&
    order.status !== "completed" &&
    order.status !== "cancelled" &&
    order.status !== "refunded";

  async function handleComplete() {
    setCompleting(true);
    try {
      const res = await completeOrderAction(order.id);
      if (!res.ok) {
        toast.error("Couldn't complete order", { description: res.error });
        return;
      }
      toast.success(
        `${order.number} ${order.channel === "delivery" ? "delivered" : "picked up"}`,
      );
      router.refresh();
      onClose();
    } finally {
      setCompleting(false);
    }
  }

  if (held) {
    return (
      <div className="sticky bottom-0 z-10 grid shrink-0 grid-cols-3 gap-2 border-t bg-surface-1 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12px]"
          onClick={startAddingItems}
        >
          <Plus className="size-3.5" />
          Add items
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12px] text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setCancelOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-9 rounded-md text-[12px]"
          onClick={() => setPayOpen(true)}
          disabled={order.status !== "ready"}
          title={
            order.status === "ready"
              ? undefined
              : `Kitchen still has the order in ${order.status}. Payment opens once every ticket is marked ready.`
          }
        >
          <Receipt className="size-3.5" />
          Take payment
        </Button>

        <TakePaymentDialog
          order={order}
          channels={paymentChannels}
          open={payOpen}
          onOpenChange={setPayOpen}
        />
        <CancelHeldOrderDialog
          order={order}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
        />
      </div>
    );
  }

  // Prepaid, still in the kitchen — hand-off completes it (no payment
  // step, that already happened at placement).
  if (awaitingHandoff) {
    const isDelivery = order.channel === "delivery";
    return (
      <div className="sticky bottom-0 z-10 grid shrink-0 grid-cols-2 gap-2 border-t bg-surface-1 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12px]"
          onClick={() => setReprintOpen(true)}
          disabled={!workspace}
        >
          <Printer className="size-3.5" />
          Receipt
        </Button>
        <Button
          size="sm"
          className="h-9 rounded-md text-[12px]"
          onClick={handleComplete}
          disabled={completing || order.status !== "ready"}
          title={
            order.status === "ready"
              ? undefined
              : `Kitchen still has the order in ${order.status}. Hand off once every ticket is marked ready.`
          }
        >
          {completing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" />
          )}
          {isDelivery ? "Mark delivered" : "Mark picked up"}
        </Button>

        <ReceiptPreviewDialog
          open={reprintOpen}
          onOpenChange={setReprintOpen}
          title={`Receipt · ${order.number}`}
          description="Reprint to thermal, OS print, or download a PDF copy."
          receipts={reprintPayload}
        />
      </div>
    );
  }

  // Already paid (or cancelled/refunded) — the original receipt + refund row.
  return (
    <div className="sticky bottom-0 z-10 grid shrink-0 grid-cols-3 gap-2 border-t bg-surface-1 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <Button
        variant="outline"
        size="sm"
        className="h-9 rounded-md text-[12px]"
        onClick={() => setReprintOpen(true)}
        disabled={!workspace}
      >
        <Printer className="size-3.5" />
        Print
      </Button>
      <Button variant="outline" size="sm" className="h-9 rounded-md text-[12px]">
        <Send className="size-3.5" />
        Resend
      </Button>
      <Button
        variant={order.status === "refunded" ? "outline" : "default"}
        size="sm"
        className="h-9 rounded-md text-[12px]"
      >
        <RotateCcw className="size-3.5" />
        Refund
      </Button>

      <ReceiptPreviewDialog
        open={reprintOpen}
        onOpenChange={setReprintOpen}
        title={`Receipt · ${order.number}`}
        description="Reprint to thermal, OS print, or download a PDF copy."
        receipts={reprintPayload}
      />
    </div>
  );
}

function FiscalSection({ order }: { order: Order }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitInvoiceToBraAction(order.id);
      if (!result.ok) {
        toast.error("BRA submission failed", { description: result.error });
        router.refresh();
        return;
      }
      toast.success(
        result.data.alreadySubmitted
          ? "Already fiscalized"
          : "Fiscal invoice received",
        { description: result.data.fiscalInvoiceNumber },
      );
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (order.fiscalInvoiceNumber) {
    return (
      <div className="space-y-2 rounded-md border border-success/30 bg-success/8 p-3 text-[12.5px]">
        <div className="flex items-center justify-between gap-2">
          <Badge className="rounded-md border-success/30 bg-success/15 text-success">
            <CircleCheck className="size-3" />
            Submitted
          </Badge>
          {order.fiscalSubmittedAt ? (
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(order.fiscalSubmittedAt)}
            </span>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Fiscal invoice number
          </p>
          <p className="mt-0.5 font-mono text-[13.5px] font-semibold tabular-nums text-foreground">
            {order.fiscalInvoiceNumber}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border bg-card p-3 text-[12.5px]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Receipt className="size-3.5" />
        <span>Not yet submitted to BRA.</span>
      </div>
      {order.fiscalLastError ? (
        <p className="flex items-start gap-1.5 rounded-md border border-destructive/20 bg-destructive/8 px-2 py-1.5 text-[11.5px] text-destructive">
          <TriangleAlert className="mt-0.5 size-3 shrink-0" />
          <span className="break-all">{order.fiscalLastError}</span>
        </p>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 w-full rounded-md text-[12px]"
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Receipt className="size-3.5" />
            {order.fiscalLastError ? "Retry submission" : "Submit to BRA"}
          </>
        )}
      </Button>
    </div>
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
          bold && "font-semibold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
