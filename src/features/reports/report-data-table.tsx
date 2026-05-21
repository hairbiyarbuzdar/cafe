"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { displayCell } from "@/lib/data-transfer/cells";
import { getModule } from "@/lib/data-transfer/registry";
import type { DataRow, ModuleKey } from "@/lib/data-transfer/types";
import { cn } from "@/lib/utils";

export function ReportDataTable({
  moduleKey,
  rows,
  currencyCode,
}: {
  moduleKey: ModuleKey;
  rows: DataRow[];
  currencyCode: string;
}) {
  const meta = getModule(moduleKey);
  const [search, setSearch] = React.useState("");
  const [pageSize, setPageSize] = React.useState(16);

  const textKeys = React.useMemo(
    () =>
      meta.columns
        .filter((c) => c.type === "text")
        .map((c) => c.key),
    [meta.columns],
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      textKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, search, textKeys]);

  const pg = usePagination(filtered, pageSize);
  const { setPage } = pg;

  // Reset to the first page when the filter or page size changes.
  React.useEffect(() => {
    setPage(1);
  }, [search, pageSize, setPage]);

  return (
    <div className="ring-highlight overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 p-3 md:p-4">
        <h2 className="text-[14px] font-semibold tracking-tight">
          {meta.label}
          <span className="ms-2 text-[12px] font-normal text-muted-foreground">
            {filtered.length} record{filtered.length === 1 ? "" : "s"}
          </span>
        </h2>
        <div className="relative w-full max-w-[240px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="h-9 ps-8 text-[12.5px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {meta.columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    "whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.04em]",
                    (c.type === "money" ||
                      c.type === "number" ||
                      c.type === "integer") &&
                      "text-end",
                  )}
                >
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pg.pageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={meta.columns.length}
                  className="py-12 text-center text-[13px] text-muted-foreground"
                >
                  No records in this period.
                </TableCell>
              </TableRow>
            ) : (
              pg.pageItems.map((row, i) => (
                <TableRow key={(row.id as string) ?? i}>
                  {meta.columns.map((c) => {
                    const numeric =
                      c.type === "money" ||
                      c.type === "number" ||
                      c.type === "integer";
                    return (
                      <TableCell
                        key={c.key}
                        className={cn(
                          "whitespace-nowrap text-[12.5px]",
                          numeric && "text-end tabular-nums",
                          c.key === meta.idField &&
                            "max-w-[120px] truncate font-mono text-[11px] text-muted-foreground",
                        )}
                      >
                        {displayCell(row[c.key] ?? null, c.type, currencyCode)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 ? (
        <TablePagination
          page={pg.page}
          pageCount={pg.pageCount}
          shown={pg.shown}
          total={pg.total}
          onPrev={pg.prev}
          onNext={pg.next}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      ) : null}
    </div>
  );
}
