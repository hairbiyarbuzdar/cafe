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
      <div className="rounded-lg border bg-card shadow-elevated">
        <div className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as OrderStatus | "all")}
            className="w-full md:w-auto"
          >
            <TabsList className="h-8 w-full justify-start gap-0.5 rounded-md bg-secondary/50 p-0.5 md:w-auto">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="h-7 rounded px-2.5 text-[12px]"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order, customer, staff…"
                className="h-8 w-[240px] rounded-md ps-8 text-[12.5px]"
              />
            </div>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger size="sm" className="h-8 w-[140px] rounded-md text-[12.5px]">
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

        <div className="overflow-x-auto">
          <Table className="text-[12.5px]">
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
                    className="py-10 text-center text-[12.5px] text-muted-foreground"
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
                          <p className="truncate text-[11px] text-muted-foreground">
                            {o.customer.phone}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChannelBadge channel={o.channel} />
                      {o.table ? (
                        <span className="ms-1 text-[11px] text-muted-foreground">
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

        <div className="flex items-center justify-between border-t px-3 py-2.5 text-[12px] text-muted-foreground md:px-4">
          <span>
            Showing <span className="text-foreground">{pageItems.length}</span> of{" "}
            <span className="text-foreground">{filtered.length}</span> orders
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              className="size-7 rounded-md"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="tabular-nums">
              {page} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              className="size-7 rounded-md"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
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
        "h-9 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground",
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
