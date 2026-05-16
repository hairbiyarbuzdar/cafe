"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/mock/categories";
import { PRODUCTS } from "@/mock/products";
import { ProductCard } from "@/features/pos/product-card";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeCategory && p.categoryId !== activeCategory) return false;
      if (query) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeCategory, query]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex flex-col gap-2 px-3 pt-3 md:px-4 md:pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or SKU…"
            className="h-9 rounded-md bg-card ps-9 text-[13px]"
          />
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-1.5 pb-1">
            <CategoryChip
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
              label="All"
              count={PRODUCTS.length}
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
                label={c.name}
                count={c.count}
                dotColor={c.color}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 pb-3 md:px-4 md:pb-4">
        {filtered.length === 0 ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-card/40 text-center">
            <p className="text-[13px] font-medium text-foreground">
              No products match
            </p>
            <p className="text-[12px] text-muted-foreground">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 text-[12px] font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-foreground hover:bg-muted",
      )}
    >
      {dotColor ? (
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ background: dotColor }}
        />
      ) : null}
      {label}
      <span
        className={cn(
          "ms-1 rounded px-1 text-[10.5px] tabular-nums",
          active ? "text-primary/80" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
