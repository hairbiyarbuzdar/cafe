"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Default rows per page across the admin tables. Matches the Orders page. */
export const TABLE_PAGE_SIZE = 8;

/** Standard page-size choices for the rows-per-page selector. */
export const PAGE_SIZE_OPTIONS = [8, 16, 32, 64];

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
  pageSize,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
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
  /** When provided (with onPageSizeChange), renders a rows-per-page selector. */
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border/70 px-3 py-3 text-[12.5px] text-muted-foreground md:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span>
          <span className="text-foreground">{shown}</span> of{" "}
          <span className="text-foreground">{total}</span>
        </span>
        {pageSize != null && onPageSizeChange ? (
          <div className="hidden items-center gap-1.5 sm:flex">
            <span>Rows</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="h-7 w-[68px] text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
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
