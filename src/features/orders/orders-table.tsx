"use client";

import * as React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelBadge, OrderStatusBadge } from "@/features/orders/status-badge";
import { OrderDetailDrawer } from "@/features/orders/order-detail-drawer";
import { ORDERS } from "@/mock/orders";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const PAGE_SIZE = 8;

export function OrdersTable() {
  const [tab, setTab] = React.useState<OrderStatus | "all">("all");
  const [channel, setChannel] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Order | null>(null);

  const filtered = React.useMemo(() => {
    return ORDERS.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (channel !== "all" && o.channel !== channel) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.number.toLowerCase().includes(q) ||
          o.customer?.name.toLowerCase().includes(q) ||
          o.staff.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tab, channel, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [tab, channel, search]);

  return (
    <>
      <div className="ring-highlight rounded-xl border border-border/70 bg-card">
        <div className="flex flex-col gap-3 border-b border-border/70 p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <ScrollableTabs
            tab={tab}
            onChange={(v) => setTab(v as OrderStatus | "all")}
          />
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <div className="relative min-w-0 flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="h-9 rounded-md ps-9 text-[13px] sm:w-[240px]"
              />
            </div>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger size="sm" className="h-9 w-auto min-w-[140px] rounded-md text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="dine-in">Dine-in</SelectItem>
                <SelectItem value="takeaway">Takeaway</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile: card list. Tablet+: full table. */}
        <ul className="divide-y divide-border/60 md:hidden">
          {pageItems.length === 0 ? (
            <li className="px-4 py-10 text-center text-[13px] text-muted-foreground">
              No orders match the current filters.
            </li>
          ) : (
            pageItems.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setSelected(o)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold tabular-nums">
                        {o.number}
                      </span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 truncate text-[13px] text-foreground">
                      {o.customer?.name ?? "Walk-in"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                      <ChannelBadge channel={o.channel} />
                      {o.table ? <span>· {o.table}</span> : null}
                      <span>·</span>
                      <span>{formatRelativeTime(o.createdAt)}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                    {formatCurrency(o.total)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <Table className="text-[13px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Channel</Th>
                <Th sortable>Items</Th>
                <Th sortable>Total</Th>
                <Th>Status</Th>
                <Th>Staff</Th>
                <Th className="text-right">Created</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-[13px] text-muted-foreground"
                  >
                    No orders match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((o) => (
                  <TableRow
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium tabular-nums">
                      {o.number}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {o.customer?.name ?? "Walk-in"}
                        </p>
                        {o.customer?.phone ? (
                          <p className="truncate text-[11.5px] text-muted-foreground">
                            {o.customer.phone}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChannelBadge channel={o.channel} />
                      {o.table ? (
                        <span className="ms-1 text-[11.5px] text-muted-foreground">
                          · {o.table}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {o.items.reduce((s, i) => s + i.quantity, 0)}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(o.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.staff}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatRelativeTime(o.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 px-3 py-3 text-[12.5px] text-muted-foreground md:px-4">
          <span>
            <span className="text-foreground">{pageItems.length}</span> of{" "}
            <span className="text-foreground">{filtered.length}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              className="size-9 rounded-md md:size-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <OrderDetailDrawer
        order={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function Th({
  children,
  className,
  sortable,
}: {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
}) {
  return (
    <TableHead
      className={cn(
        "h-10 text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable ? <ArrowUpDown className="size-3 opacity-60" /> : null}
      </span>
    </TableHead>
  );
}

function ScrollableTabs({
  tab,
  onChange,
}: {
  tab: OrderStatus | "all";
  onChange: (v: string) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollability = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    const timeoutId = setTimeout(checkScrollability, 100);
    return () => {
      window.removeEventListener("resize", checkScrollability);
      clearTimeout(timeoutId);
    };
  }, [checkScrollability]);

  React.useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector(
        `[data-value="${tab}"]`
      ) as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [tab]);

  return (
    <div className="group relative flex items-center md:w-auto">
      <button
        type="button"
        onClick={() => scroll("left")}
        className={cn(
          "absolute -left-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity md:-left-3",
          canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="size-4" />
      </button>

      <Tabs value={tab} onValueChange={onChange} className="w-full">
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TabsList className="h-9 w-max justify-start gap-0.5 rounded-md bg-secondary/60 p-0.5">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                data-value={t.value}
                className="h-8 rounded px-3 text-[12.5px]"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <button
        type="button"
        onClick={() => scroll("right")}
        className={cn(
          "absolute -right-2 z-10 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity md:-right-3",
          canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollRight}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
