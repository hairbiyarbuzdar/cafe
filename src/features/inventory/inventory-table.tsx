"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { ReceiveStockDialog } from "@/features/inventory/receive-stock-dialog";
import type { InventoryItem, Supplier } from "@/types";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";

const CATS = [
  "All",
  "Coffee",
  "Dairy",
  "Pantry",
  "Syrups",
  "Bakery",
  "Produce",
  "Meat",
  "Packaging",
];

export function InventoryTable({
  items,
  suppliers,
  paymentChannels = [],
}: {
  items: InventoryItem[];
  suppliers: Supplier[];
  paymentChannels?: import("@/lib/queries/payment-channels").PaymentChannel[];
}) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      if (category !== "All" && it.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, category, items]);

  const pg = usePagination(filtered);

  return (
    <div className="ring-highlight rounded-xl border border-border/70 bg-card">
      <div className="flex flex-col gap-3 border-b border-border/70 p-3 md:flex-row md:items-center md:justify-between md:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <div className="relative min-w-0 flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                pg.setPage(1);
              }}
              placeholder="Search ingredient or SKU…"
              className="h-9 rounded-md ps-9 text-[13px] sm:w-[260px]"
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              pg.setPage(1);
            }}
          >
            <SelectTrigger size="sm" className="h-9 w-auto min-w-[140px] rounded-md text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 rounded-md text-[13px] md:inline-flex"
          >
            <SlidersHorizontal className="size-4" />
            Columns
          </Button>
          <ReceiveStockDialog
            suppliers={suppliers}
            paymentChannels={paymentChannels}
          />
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border/60 md:hidden">
        {pg.pageItems.map((it) => {
          const supplier = suppliers.find((s) => s.id === it.supplierId);
          const ratio = Math.min(1, it.stock / Math.max(1, it.reorderLevel * 2));
          const low = it.stock < it.reorderLevel;
          return (
            <li key={it.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-foreground">{it.name}</p>
                  <p className="mt-0.5 text-[11.5px] font-mono text-muted-foreground">
                    {it.sku} · {it.category}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[14px] font-semibold tabular-nums",
                    low ? "text-destructive" : "text-foreground",
                  )}
                >
                  {it.stock}
                  <span className="ms-0.5 text-[11px] text-muted-foreground">
                    {it.unit}
                  </span>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Progress
                  value={ratio * 100}
                  className={cn(
                    "h-1.5 flex-1 bg-muted",
                    low ? "[&>div]:bg-destructive" : "[&>div]:bg-primary",
                  )}
                />
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  ≥{it.reorderLevel}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                {supplier?.name ?? "—"} · {formatRelativeTime(it.lastRestocked)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <Th>Item</Th>
              <Th>Category</Th>
              <Th className="text-right">Stock</Th>
              <Th>Reorder level</Th>
              <Th className="text-right">Cost</Th>
              <Th>Supplier</Th>
              <Th className="text-right">Last restocked</Th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pg.pageItems.map((it) => {
              const supplier = suppliers.find((s) => s.id === it.supplierId);
              const ratio = Math.min(1, it.stock / Math.max(1, it.reorderLevel * 2));
              const low = it.stock < it.reorderLevel;
              return (
                <TableRow key={it.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{it.name}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{it.sku}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{it.category}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        low ? "text-destructive" : "text-foreground",
                      )}
                    >
                      {it.stock}
                      <span className="ms-0.5 text-[11px] text-muted-foreground">
                        {it.unit}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={ratio * 100}
                        className={cn(
                          "h-1.5 w-28 bg-muted",
                          low ? "[&>div]:bg-destructive" : "[&>div]:bg-primary",
                        )}
                      />
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        ≥{it.reorderLevel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatCurrency(it.costPerUnit)}/{it.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRelativeTime(it.lastRestocked)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.page}
        pageCount={pg.pageCount}
        shown={pg.shown}
        total={pg.total}
        onPrev={pg.prev}
        onNext={pg.next}
      />
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TableHead
      className={cn(
        "h-9 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}
