"use client";

import * as React from "react";
import { ReceiptText } from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CartPanel } from "@/features/pos/cart-panel";
import type { HeldOrderSummary } from "@/lib/queries/orders";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { cartSubtotal, useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

/**
 * Floating launcher that summarizes the cart on small screens and
 * opens the full CartPanel inside a bottom sheet. Hidden on md+
 * where the cart sits beside the products in a split layout.
 */
export function MobileCartTrigger({
  heldOrders = [],
  paymentChannels = [],
}: {
  heldOrders?: HeldOrderSummary[];
  paymentChannels?: PaymentChannel[];
}) {
  const items = useCart((s) => s.items);
  const taxRate = useCart((s) => s.taxRate);
  const discountPct = useCart((s) => s.discountPct);
  const [open, setOpen] = React.useState(false);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartSubtotal(items);
  const taxable = subtotal - subtotal * (discountPct / 100);
  const total = taxable + taxable * taxRate;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={count === 0}
        aria-label={`Open cart with ${count} items`}
        className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-40 flex h-14 items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary px-4 text-primary-foreground shadow-hover transition-all hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <ReceiptText className="size-4" />
            {count > 0 ? (
              <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-card px-1 text-[11px] font-semibold text-primary">
                {count}
              </span>
            ) : null}
          </span>
          <span className="text-[13px] font-medium">
            {count === 0 ? "Cart is empty" : `${count} item${count > 1 ? "s" : ""}`}
          </span>
        </span>
        <span className="text-[15px] font-semibold tabular-nums">
          {formatCurrency(total)}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="flex h-[90dvh] w-full flex-col gap-0 rounded-t-2xl border-t-2 p-0"
        >
          <SheetTitle className="sr-only">Current order</SheetTitle>
          <CartPanel
            heldOrders={heldOrders}
            paymentChannels={paymentChannels}
            onChargeStart={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
