"use client";

import * as React from "react";
import { Bike, Search, ShoppingBag, Sparkles, Utensils } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/mock/categories";
import { ProductCard } from "@/features/pos/product-card";
import { QuantityDialog } from "@/features/pos/quantity-dialog";
import { useCart } from "@/store/cart-store";
import { selectPosVisibleItems, useMenu } from "@/store/menu-store";
import type { MenuItem, OrderChannel } from "@/types";

type Filter = "all" | "popular" | string;

export function ProductGrid() {
  const allItems = useMenu((s) => s.items);
  // Only items that are toggled to appear on the POS screen
  const items = React.useMemo(() => selectPosVisibleItems(allItems), [allItems]);

  const [activeFilter, setActiveFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");
  const [pickProduct, setPickProduct] = React.useState<MenuItem | null>(null);

  const popularCount = React.useMemo(
    () => items.filter((p) => p.popular).length,
    [items],
  );

  const categoryCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) map[it.categoryId] = (map[it.categoryId] ?? 0) + 1;
    return map;
  }, [items]);

  const filtered = React.useMemo(() => {
    return items.filter((p) => {
      if (activeFilter === "popular" && !p.popular) return false;
      if (
        activeFilter !== "all" &&
        activeFilter !== "popular" &&
        p.categoryId !== activeFilter
      )
        return false;
      if (query) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, activeFilter, query]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex flex-col gap-3 px-3 pt-3 md:px-4 md:pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name or SKU…"
              className="h-10 rounded-md bg-card ps-9 text-[13.5px]"
            />
          </div>
          <ChannelToggle />
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-1.5 pb-1">
            <CategoryChip
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              label="All"
              count={items.length}
            />
            <CategoryChip
              active={activeFilter === "popular"}
              onClick={() => setActiveFilter("popular")}
              label="Popular"
              count={popularCount}
              icon={<Sparkles className="size-3" />}
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={activeFilter === c.id}
                onClick={() => setActiveFilter(c.id)}
                label={c.name}
                count={categoryCounts[c.id] ?? 0}
                dotColor={c.color}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 pb-[calc(env(safe-area-inset-bottom)+150px)] md:px-4 md:pb-4">
        {filtered.length === 0 ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-card/40 text-center">
            <p className="text-[14px] font-medium text-foreground">
              No products match
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={setPickProduct} />
            ))}
          </div>
        )}
      </ScrollArea>

      <QuantityDialog product={pickProduct} onClose={() => setPickProduct(null)} />
    </div>
  );
}

const CHANNELS: { value: OrderChannel; label: string; icon: typeof Utensils }[] = [
  { value: "dine-in", label: "Dine-in", icon: Utensils },
  { value: "takeaway", label: "Takeaway", icon: ShoppingBag },
  { value: "delivery", label: "Delivery", icon: Bike },
];

function ChannelToggle() {
  const channel = useCart((s) => s.channel);
  const setChannel = useCart((s) => s.setChannel);
  return (
    <div
      role="radiogroup"
      aria-label="Order type"
      className="inline-flex h-10 shrink-0 items-center gap-0.5 rounded-md border border-border/70 bg-card p-0.5 shadow-soft"
    >
      {CHANNELS.map((c) => {
        const Icon = c.icon;
        const active = channel === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setChannel(c.value)}
            className={cn(
              "inline-flex h-full items-center gap-1.5 rounded-[6px] px-3 text-[12.5px] font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  dotColor,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 text-[12.5px] font-medium transition-all",
        active
          ? "border-primary/40 bg-primary text-primary-foreground shadow-soft dark:bg-primary/90"
          : "border-border/70 text-foreground hover:border-border hover:bg-muted",
      )}
    >
      {icon ? (
        <span className={cn(active && "text-primary-foreground")}>{icon}</span>
      ) : null}
      {dotColor ? (
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ background: active ? "currentColor" : dotColor }}
        />
      ) : null}
      {label}
      <span
        className={cn(
          "ms-1 rounded px-1 text-[10.5px] tabular-nums",
          active ? "text-primary-foreground/90" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
