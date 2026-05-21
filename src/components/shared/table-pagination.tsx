"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Default rows per page across the admin tables. Matches the Orders page. */
export const TABLE_PAGE_SIZE = 8;

/**
 * Standard client-side pagination for the admin tables. Clamps the page
 * if the list shrinks; reset to page 1 imperatively (call `setPage(1)`)
 * when a filter/search changes.
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = TABLE_PAGE_SIZE,
) {
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageItems = items.slice((current - 1) * pageSize, current * pageSize);
  return {
    page: current,
    setPage,
    pageCount,
    pageItems,
    total: items.length,
    shown: pageItems.length,
    prev: () => setPage((p) => Math.max(1, p - 1)),
    next: () => setPage((p) => Math.min(pageCount, p + 1)),
  };
}

/**
 * The shared pagination footer — same UI, controls, and responsive
 * styling as the Orders page table. Drop it under any paginated table.
 */
export function TablePagination({
  page,
  pageCount,
  shown,
  total,
  onPrev,
  onNext,
  className,
}: {
  page: number;
  pageCount: number;
  /** Rows visible on the current page. */
  shown: number;
  /** Total rows after filtering. */
  total: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border/70 px-3 py-3 text-[12.5px] text-muted-foreground md:px-4",
        className,
      )}
    >
      <span>
        <span className="text-foreground">{shown}</span> of{" "}
        <span className="text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          className="size-9 rounded-md md:size-8"
          disabled={page <= 1}
          onClick={onPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="tabular-nums">
          {page} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          className="size-9 rounded-md md:size-8"
          disabled={page >= pageCount}
          onClick={onNext}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
