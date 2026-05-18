"use client";

import * as React from "react";
import {
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Mail,
  Printer,
  RotateCcw,
  Send,
  Smartphone,
  Utensils,
  Wallet,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChannelBadge, OrderStatusBadge } from "@/features/orders/status-badge";
import { cn, formatCurrency, initials } from "@/lib/utils";
import type { Order, OrderStatus, PaymentMethod } from "@/types";

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
  onClose: () => void;
};

export function OrderDetailDrawer({ order, onClose }: Props) {
  const open = Boolean(order);
  const PaymentIcon = order ? PAYMENT_ICON[order.payment] : CreditCard;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[460px]"
      >
        {order ? (
          <>
            <SheetHeader className="shrink-0 space-y-2 border-b p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="flex items-center gap-2 text-[16px] font-semibold">
                    Order {order.number}
                    <OrderStatusBadge status={order.status} />
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

            <ScrollArea className="flex-1">
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
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <PaymentIcon className="size-3.5" />
                        Paid via {order.payment}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-success">
                        <CircleCheck className="size-3.5" />
                        Captured
                      </span>
                    </div>
                  </div>
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

            <div className="grid shrink-0 grid-cols-3 gap-2 border-t bg-surface-1 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
              <Button variant="outline" size="sm" className="h-9 rounded-md text-[12px]">
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
            </div>
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
