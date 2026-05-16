"use client";

import { Plus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import type { Product } from "@/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);
  const disabled = !product.available;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => add(product)}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border bg-card p-3 text-left transition-all",
        "hover:border-primary/40 hover:shadow-elevated focus-visible:border-primary/50",
        disabled && "cursor-not-allowed opacity-55 hover:border-border",
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden rounded-md bg-gradient-to-br from-secondary/60 to-primary-soft/60">
        <div className="absolute inset-0 flex items-center justify-center text-[36px] font-semibold tracking-tight text-primary/30">
          {product.name.charAt(0)}
        </div>
        {product.popular ? (
          <Badge className="absolute start-2 top-2 h-5 gap-0.5 rounded border-0 bg-card/90 px-1.5 text-[10px] font-medium text-foreground shadow-sm">
            <Sparkles className="size-2.5 text-primary" />
            Popular
          </Badge>
        ) : null}
        {disabled ? (
          <Badge variant="destructive" className="absolute end-2 top-2 h-5 rounded px-1.5 text-[10px]">
            86'd
          </Badge>
        ) : null}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-2 end-2 flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-elevated transition",
            "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            disabled && "hidden",
          )}
        >
          <Plus className="size-3.5" />
        </span>
      </div>
      <div className="min-h-0 space-y-0.5">
        <p className="line-clamp-1 text-[13px] font-medium text-foreground">
          {product.name}
        </p>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">
          {product.description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[13px] font-semibold tabular-nums text-foreground">
          {formatCurrency(product.price)}
        </span>
        {product.sku ? (
          <span className="text-[10.5px] font-mono text-muted-foreground/70">
            {product.sku}
          </span>
        ) : null}
      </div>
    </button>
  );
}
