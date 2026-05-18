"use client";

import * as React from "react";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Transfer } from "@/lib/queries/payment-channels";
import { cn, formatCurrency } from "@/lib/utils";

type Range = "all" | "today" | "week" | "month" | "custom";

const RANGES: { id: Range; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "custom", label: "Custom" },
];

function startOf(range: Exclude<Range, "all" | "custom">): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (range === "today") return d;
  if (range === "week") {
    const day = (d.getDay() + 6) % 7; // Monday as week start
    d.setDate(d.getDate() - day);
    return d;
  }
  d.setDate(1);
  return d;
}

function dateOnly(s: string): Date {
  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Transfer log with the same date-range chips shown in the reference
 * UI. Pure client-side filtering — the server returns every transfer
 * since they're cheap to render.
 */
export function TransferHistory({ transfers }: { transfers: Transfer[] }) {
  const [range, setRange] = React.useState<Range>("all");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");

  const filtered = React.useMemo(() => {
    if (range === "all") return transfers;
    if (range === "custom") {
      const from = customFrom ? dateOnly(customFrom).getTime() : null;
      const to = customTo
        ? dateOnly(customTo).getTime() + 86_400_000 - 1
        : null;
      return transfers.filter((t) => {
        const ts = new Date(t.occurredAt).getTime();
        if (from != null && ts < from) return false;
        if (to != null && ts > to) return false;
        return true;
      });
    }
    const cutoff = startOf(range).getTime();
    return transfers.filter((t) => new Date(t.occurredAt).getTime() >= cutoff);
  }, [transfers, range, customFrom, customTo]);

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-card p-3 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {RANGES.map((r) => {
            const active = range === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-foreground hover:bg-muted",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <p className="text-[12px] tabular-nums text-muted-foreground">
          Total:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(total)}
          </span>
        </p>
      </div>

      {range === "custom" ? (
        <div className="flex flex-wrap items-end gap-3 border-t pt-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="tr-from"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              From
            </Label>
            <Input
              id="tr-from"
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-9 w-[160px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="tr-to"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              To
            </Label>
            <Input
              id="tr-to"
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-9 w-[160px]"
            />
          </div>
          {customFrom || customTo ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 rounded-md text-[12px] text-muted-foreground"
              onClick={() => {
                setCustomFrom("");
                setCustomTo("");
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
          <CalendarDays className="size-5 text-muted-foreground" />
          <p className="text-[12.5px] text-muted-foreground">
            {transfers.length === 0
              ? "No transfers yet. Move money between methods using the Transfer button above."
              : "No transfers match this range."}
          </p>
        </div>
      ) : (
        <ul className="divide-y">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center gap-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[13px] font-medium">
                  <span className="truncate uppercase tracking-[0.04em]">
                    {t.fromName}
                  </span>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <span className="truncate uppercase tracking-[0.04em]">
                    {t.toName}
                  </span>
                </p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {new Date(t.occurredAt).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {t.note ? ` · ${t.note}` : null}
                </p>
              </div>
              <span className="font-mono text-[14px] font-semibold tabular-nums text-success">
                {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
