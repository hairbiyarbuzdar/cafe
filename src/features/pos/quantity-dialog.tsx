"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryIcon } from "@/constants/category-icons";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import type { MenuItem } from "@/types";

type Props = {
  product: MenuItem | null;
  onClose: () => void;
};

const MAX_QUANTITY = 99;

export function QuantityDialog({ product, onClose }: Props) {
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) setQuantity(1);
  }, [product]);

  if (!product) {
    return (
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent />
      </Dialog>
    );
  }

  // Capture the narrowed product so closures (handleConfirm) see a
  // non-null Product even though `product` in the prop union is nullable.
  const currentProduct = product;
  const Icon = getCategoryIcon(currentProduct.categoryId);
  const lineTotal = currentProduct.price * quantity;

  function step(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(MAX_QUANTITY, q + delta)));
  }

  function handleConfirm() {
    add(currentProduct, quantity);
    onClose();
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[400px] gap-0 overflow-hidden rounded-2xl p-0">
        <div className="surface-wash relative border-b border-border/70 px-5 pb-4 pt-5">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-primary shadow-soft">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <DialogHeader className="space-y-1 text-start">
                <DialogTitle className="text-[16px] font-semibold tracking-tight">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="line-clamp-2 text-[12.5px]">
                  {product.description ?? "Choose a quantity and add it to the order."}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="h-5 rounded-md bg-card/80 text-[11px] font-medium text-foreground"
                >
                  {formatCurrency(product.price)} ea
                </Badge>
                {product.popular ? (
                  <Badge className="h-5 gap-0.5 rounded-md border-0 bg-card/90 px-1.5 text-[10.5px] font-medium text-foreground shadow-soft">
                    <Sparkles className="size-2.5 text-primary" />
                    Popular
                  </Badge>
                ) : null}
                {product.sku ? (
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {product.sku}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <Label
              htmlFor="qty-input"
              className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
            >
              Quantity
            </Label>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 rounded-xl"
                onClick={() => step(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <Input
                id="qty-input"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  if (Number.isNaN(n)) setQuantity(1);
                  else setQuantity(Math.max(1, Math.min(MAX_QUANTITY, n)));
                }}
                className="h-11 flex-1 text-center text-[18px] font-semibold tabular-nums"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 rounded-xl"
                onClick={() => step(1)}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-1 px-3.5 py-2.5">
            <span className="text-[12.5px] text-muted-foreground">Line total</span>
            <span className="text-[16px] font-semibold tabular-nums text-foreground">
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t border-border/70 bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-md text-[13px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 rounded-md text-[13px] font-semibold"
            onClick={handleConfirm}
            disabled={!product.available}
          >
            <ShoppingBag className="size-4" />
            Add {quantity > 1 ? `${quantity} × ` : ""}
            {formatCurrency(lineTotal)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
