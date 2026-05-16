"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Search, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/mock/categories";
import { PRODUCTS } from "@/mock/products";
import { ProductCard } from "@/features/pos/product-card";

type Filter = "all" | "popular" | string;

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const popularCount = React.useMemo(
    () => PRODUCTS.filter((p) => p.popular).length,
    [],
  );

  const filtered = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
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
  }, [activeFilter, query]);

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
        <div className="group relative flex items-center">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft opacity-0 transition-opacity group-hover:opacity-100 md:-left-3"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex w-full gap-1.5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <CategoryChip
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              label="All"
              count={PRODUCTS.length}
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
                count={c.count}
                dotColor={c.color}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft opacity-0 transition-opacity group-hover:opacity-100 md:-right-3"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
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
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 text-[12px] font-medium transition-all",
        active
          ? "border-primary/40 bg-primary text-primary-foreground shadow-soft dark:bg-primary/90"
          : "border-border/70 text-foreground hover:border-border hover:bg-muted",
      )}
    >
      {icon ? <span className={cn(active && "text-primary-foreground")}>{icon}</span> : null}
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
