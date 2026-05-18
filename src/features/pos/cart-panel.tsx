"use client";

import * as React from "react";
import {
  Bike,
  CircleX,
  CreditCard,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Smartphone,
  Trash2,
  Utensils,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutDialog } from "@/features/pos/checkout-dialog";
import { TablePicker } from "@/features/pos/table-picker";
import { cartSubtotal, useCart } from "@/store/cart-store";
import { useTables } from "@/store/tables-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { OrderChannel, PaymentMethod } from "@/types";

const PAYMENTS: { value: PaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "wallet", label: "Wallet", icon: Smartphone },
];

type CartPanelProps = {
  /** Fired when the user opens the checkout dialog
   *  (useful for closing a wrapping bottom sheet on mobile). */
  onChargeStart?: () => void;
};

export function CartPanel({ onChargeStart }: CartPanelProps = {}) {
  const items = useCart((s) => s.items);
  const channel = useCart((s) => s.channel);
  const payment = useCart((s) => s.payment);
  const note = useCart((s) => s.note);
  const discountPct = useCart((s) => s.discountPct);
  const tableId = useCart((s) => s.tableId);
  const taxRate = useCart((s) => s.taxRate);
  const setPayment = useCart((s) => s.setPayment);
  const setNote = useCart((s) => s.setNote);
  const setDiscountPct = useCart((s) => s.setDiscountPct);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const tables = useTables((s) => s.tables);
  const selectTable = useTables((s) => s.selectTable);
  const selectedTable = tables.find((t) => t.id === tableId);

  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const subtotal = cartSubtotal(items);
  const discount = subtotal * (discountPct / 100);
  const taxable = subtotal - discount;
  const tax = taxable * taxRate;
  const total = taxable + tax;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
            Current order
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-muted-foreground">
            <ChannelInline channel={channel} />
            {selectedTable ? (
              <>
                <span aria-hidden>·</span>
                <span className="font-medium text-foreground">{selectedTable.name}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>
              {items.length === 0
                ? "no items"
                : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) === 1 ? "" : "s"}`}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={items.length === 0}
          onClick={() => {
            clear();
            selectTable(undefined);
            toast.success("Cart cleared", { description: "Started a fresh order" });
          }}
          className="text-muted-foreground"
          aria-label="Clear cart"
        >
          <Trash2 className="size-4" />
        </Button>
      </header>

      {channel === "dine-in" ? <TablePicker /> : null}

      <ScrollArea className="min-h-0 flex-1">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <ul className="divide-y">
            {items.map((item) => {
              const unit =
                item.unitPrice + item.modifiers.reduce((s, m) => s + m.priceDelta, 0);
              const lineTotal = unit * item.quantity;
              return (
                <li key={item.productId} className="flex gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {item.name}
                      </p>
                      <button
                        onClick={() => remove(item.productId)}
                        aria-label="Remove"
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <CircleX className="size-3.5" />
                      </button>
                    </div>
                    {item.modifiers.length > 0 ? (
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {item.modifiers.map((m) => m.name).join(" · ")}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatCurrency(unit)} ea
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center overflow-hidden rounded-md border bg-card">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-9 text-center text-[13px] font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted"
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-[13.5px] font-semibold tabular-nums text-foreground">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="space-y-3 border-t bg-surface-1 px-4 py-4">
        <div className="grid grid-cols-3 gap-1.5">
          {PAYMENTS.map((p) => {
            const Icon = p.icon;
            const active = payment === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPayment(p.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border bg-card py-2 text-[11.5px] font-medium transition",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>

        <details className="group rounded-md border bg-card px-3 py-2 text-[12.5px]">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
            Additional options
            <span className="text-muted-foreground transition group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="discount" className="text-[11.5px] text-muted-foreground">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value) || 0)}
                className="h-8 rounded-md text-[12.5px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note" className="text-[11.5px] text-muted-foreground">
                Order note
              </Label>
              <Textarea
                id="note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Allergies, prep notes…"
                className="rounded-md text-[12.5px]"
              />
            </div>
          </div>
        </details>

        <dl className="space-y-1.5 text-[12.5px]">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          {discount > 0 ? (
            <Row label={`Discount (${discountPct}%)`} value={`−${formatCurrency(discount)}`} muted />
          ) : null}
          <Row label={`Tax (${(taxRate * 100).toFixed(2)}%)`} value={formatCurrency(tax)} muted />
          <Separator className="my-1.5" />
          <Row label="Total" value={formatCurrency(total)} bold />
        </dl>

        <Button
          className="h-12 w-full rounded-md text-[14px] font-semibold shadow-soft"
          disabled={items.length === 0}
          onClick={() => {
            setCheckoutOpen(true);
            onChargeStart?.();
          }}
        >
          <ReceiptText className="size-4" />
          Charge {formatCurrency(total)}
        </Button>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
      />
    </aside>
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
      <dt
        className={cn(
          "text-[12.5px]",
          muted ? "text-muted-foreground" : "text-foreground",
          bold && "text-[13px] font-semibold",
        )}
      >
        {label}
      </dt>
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

const CHANNEL_META: Record<
  OrderChannel,
  { label: string; icon: typeof Utensils }
> = {
  "dine-in": { label: "Dine-in", icon: Utensils },
  takeaway: { label: "Takeaway", icon: ShoppingBag },
  delivery: { label: "Delivery", icon: Bike },
  online: { label: "Online", icon: ShoppingBag },
};

function ChannelInline({ channel }: { channel: OrderChannel }) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 font-medium text-foreground">
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

function EmptyCart() {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary/60">
        <ReceiptText className="size-5 text-muted-foreground" />
      </div>
      <p className="text-[13.5px] font-medium text-foreground">Cart is empty</p>
      <p className="text-[12.5px] text-muted-foreground">
        Tap a product to add it to the order.
      </p>
    </div>
  );
}
