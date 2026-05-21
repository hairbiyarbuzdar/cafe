"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Filter as FilterIcon,
  Loader2,
  ReceiptText,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseHeadManager } from "@/features/expenses/expense-head-manager";
import { NewExpenseDialog } from "@/features/expenses/new-expense-dialog";
import { deleteExpenseAction } from "@/lib/actions/expenses";
import type {
  ExpenseHead,
  ExpenseRow,
  ExpensesSummary,
} from "@/lib/queries/expenses";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  summary: ExpensesSummary;
  expenses: ExpenseRow[];
  heads: ExpenseHead[];
  paymentChannels: PaymentChannel[];
};

export function ExpensesShell({
  summary,
  expenses,
  heads,
  paymentChannels,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [headFilter, setHeadFilter] = React.useState<string>("all");
  const [methodFilter, setMethodFilter] = React.useState<string>("all");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((e) => {
      if (headFilter !== "all" && e.expenseHeadId !== headFilter) return false;
      if (methodFilter !== "all" && e.paymentChannelId !== methodFilter)
        return false;
      if (!q) return true;
      return (
        e.expenseHeadName.toLowerCase().includes(q) ||
        e.paymentChannelName.toLowerCase().includes(q) ||
        (e.detail ?? "").toLowerCase().includes(q)
      );
    });
  }, [expenses, search, headFilter, methodFilter]);

  const pg = usePagination(filtered);

  const filtersActive =
    search.trim().length > 0 || headFilter !== "all" || methodFilter !== "all";

  async function remove(id: string) {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const result = await deleteExpenseAction(id);
      if (!result.ok) {
        toast.error("Couldn't reverse expense", { description: result.error });
        return;
      }
      toast.success("Expense reversed");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 rounded-xl border bg-card px-5 py-4 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">Expenses</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Track outgoing spending against your payment methods
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExpenseHeadManager heads={heads} />
          <NewExpenseDialog heads={heads} paymentChannels={paymentChannels} />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Records" value={String(summary.totalRecords)} />
        <KpiCard
          label="Total Amount"
          value={formatCurrency(summary.totalAmount, { maximumFractionDigits: 0 })}
          tone="primary"
        />
        <KpiCard label="Active Heads" value={String(summary.activeHeads)} />
      </section>

      <div className="flex flex-col gap-2 rounded-xl border bg-card px-3 py-2.5 shadow-soft md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pg.setPage(1);
            }}
            placeholder="Search by head, detail, or method…"
            className="h-9 ps-8 text-[12.5px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "size-9 rounded-md",
              filtersActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => {
              setSearch("");
              setHeadFilter("all");
              setMethodFilter("all");
              pg.setPage(1);
            }}
            disabled={!filtersActive}
            title={filtersActive ? "Clear filters" : "No filters applied"}
            aria-label="Clear filters"
          >
            <FilterIcon className="size-3.5" />
          </Button>
          <Select
            value={headFilter}
            onValueChange={(v) => {
              setHeadFilter(v);
              pg.setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] text-[12.5px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All heads</SelectItem>
              {heads.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={methodFilter}
            onValueChange={(v) => {
              setMethodFilter(v);
              pg.setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] text-[12.5px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {paymentChannels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="rounded-xl border bg-card shadow-soft">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <ReceiptText className="size-8 text-muted-foreground/40" />
            <p className="text-[14px] font-medium text-muted-foreground">
              {expenses.length === 0
                ? "No expenses recorded yet"
                : "No expenses match your filters"}
            </p>
            <p className="text-[12px] text-muted-foreground/80">
              {expenses.length === 0
                ? 'Click "New Expense" to record one.'
                : "Clear filters to see everything."}
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            <li className="hidden grid-cols-[1.4fr_1fr_1fr_140px_36px] items-center gap-3 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:grid">
              <span>Head · Detail</span>
              <span>Method</span>
              <span>Date</span>
              <span className="text-end">Amount</span>
              <span aria-hidden />
            </li>
            {pg.pageItems.map((e) => (
              <li
                key={e.id}
                className="grid grid-cols-1 items-center gap-1 px-4 py-2.5 md:grid-cols-[1.4fr_1fr_1fr_140px_36px] md:gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">
                    {e.expenseHeadName}
                  </p>
                  {e.detail ? (
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {e.detail}
                    </p>
                  ) : null}
                </div>
                <p className="text-[12.5px] text-foreground/85">
                  {e.paymentChannelName}
                </p>
                <p className="text-[12px] text-muted-foreground tabular-nums">
                  {formatDate(e.occurredAt)}
                </p>
                <p className="text-end text-[13.5px] font-semibold tabular-nums">
                  −{formatCurrency(e.amount)}
                </p>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-md text-muted-foreground hover:text-destructive"
                    onClick={() => remove(e.id)}
                    disabled={deletingId !== null}
                    title="Reverse expense (refunds the channel)"
                    aria-label="Reverse expense"
                  >
                    {deletingId === e.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {filtered.length > 0 ? (
          <TablePagination
            page={pg.page}
            pageCount={pg.pageCount}
            shown={pg.shown}
            total={pg.total}
            onPrev={pg.prev}
            onNext={pg.next}
          />
        ) : null}
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "primary";
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 shadow-soft">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-[22px] font-semibold tabular-nums",
          tone === "primary" && "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
