"use client";

import { Plus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/constants/category-icons";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

type Props = {
  product: MenuItem;
  /** Parent decides what happens on click (typically: open quantity dialog) */
  onSelect: (product: MenuItem) => void;
};

export function ProductCard({ product, onSelect }: Props) {
  const disabled = !product.available;
  const Icon = getCategoryIcon(product.categoryId);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(product)}
      className={cn(
        "group ring-highlight relative flex min-h-[208px] flex-col gap-2.5 rounded-xl border border-border/70 bg-card p-3 text-left transition-all md:min-h-0",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-hover focus-visible:border-primary/50 active:scale-[0.99]",
        disabled && "cursor-not-allowed opacity-55 hover:translate-y-0 hover:border-border hover:shadow-none",
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden rounded-md border border-border/40 bg-gradient-to-br from-secondary/60 via-card to-primary-soft/40">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className="size-9 text-primary/55 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/75"
            strokeWidth={1.5}
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, color-mix(in oklab, white 35%, transparent), transparent 55%)",
          }}
        />
        {product.popular ? (
          <Badge className="absolute start-2 top-2 h-5 gap-0.5 rounded border-0 bg-card/90 px-1.5 text-[10px] font-medium text-foreground shadow-soft">
            <Sparkles className="size-2.5 text-primary" />
            Popular
          </Badge>
        ) : null}
        {disabled ? (
          <Badge
            variant="destructive"
            className="absolute end-2 top-2 h-5 rounded px-1.5 text-[10px]"
          >
            86&apos;d
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
      <div className="min-h-0 flex-1 space-y-0.5">
        <p className="line-clamp-1 text-[14px] font-medium text-foreground">
          {product.name}
        </p>
        <p className="line-clamp-1 text-[12px] text-muted-foreground">
          {product.description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[14px] font-semibold tabular-nums text-foreground">
          {formatCurrency(product.price)}
        </span>
        {product.sku ? (
          <span className="font-mono text-[10.5px] text-muted-foreground/70">
            {product.sku}
          </span>
        ) : null}
      </div>
    </button>
  );
}
