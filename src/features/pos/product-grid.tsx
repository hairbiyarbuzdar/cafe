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
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Function to check scrollability and update state
  const checkScrollability = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  // Effect to check scrollability on mount and resize
  React.useEffect(() => {
    checkScrollability(); // Initial check

    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener("resize", handleResize);
    // Also re-check after a short delay to ensure all elements are rendered and measured
    const timeoutId = setTimeout(checkScrollability, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkScrollability]);

  // Effect to scroll to active chip when activeFilter changes
  React.useEffect(() => {
    if (scrollRef.current) {
      const activeChip = scrollRef.current.querySelector(
        `[data-category-id="${activeFilter}"]`
      ) as HTMLElement;
      if (activeChip) {
        activeChip.scrollIntoView({
          behavior: "smooth",
          inline: "center", // Scrolls to the center of the view
        });
      }
    }
  }, [activeFilter]);

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
            className={cn(
              "absolute -left-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity md:-left-3",
              canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll categories left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-card via-card/50 to-transparent transition-opacity duration-300",
              canScrollLeft ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-card via-card/50 to-transparent transition-opacity duration-300",
              canScrollRight ? "opacity-100" : "opacity-0"
            )}
          />

          <div
            ref={scrollRef}
            onScroll={checkScrollability} // Add onScroll event listener
            className="flex w-full gap-1.5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <CategoryChip
              active={activeFilter === "popular"}
              onClick={() => setActiveFilter("popular")}
              label="Popular"
              count={popularCount}
              icon={<Sparkles className="size-3" />}
            />
            <CategoryChip
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              label="All"
              count={PRODUCTS.length}
              data-category-id="all" // Add data attribute for identification
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={activeFilter === c.id}
                onClick={() => setActiveFilter(c.id)}
                label={c.name}
                count={c.count}
                dotColor={c.color}
                data-category-id={c.id} // Add data attribute for identification
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className={cn(
              "absolute -right-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity md:-right-3",
              canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll categories right"
            disabled={!canScrollRight}
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
  ...props // Capture additional props like data-category-id
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotColor?: string;
  icon?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">) { // Extend props for button
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
      {...props} // Pass additional props
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
