"use client";

import * as React from "react";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethod } from "@/types";

export type AdvancedFilters = {
  dateFrom: string;
  dateTo: string;
  payment: PaymentMethod | "all";
  customerName: string;
  minTotal: string;
};

export const emptyAdvancedFilters: AdvancedFilters = {
  dateFrom: "",
  dateTo: "",
  payment: "all",
  customerName: "",
  minTotal: "",
};

export function countActive(f: AdvancedFilters): number {
  let n = 0;
  if (f.dateFrom) n++;
  if (f.dateTo) n++;
  if (f.payment !== "all") n++;
  if (f.customerName.trim()) n++;
  if (f.minTotal) n++;
  return n;
}

/**
 * Trigger + dialog for the orders advanced filter. Holds its own
 * draft state until "Apply" so the table doesn't re-filter on every
 * keystroke. Empty inputs are treated as "any".
 */
export function OrdersAdvancedFilter({
  value,
  onChange,
}: {
  value: AdvancedFilters;
  onChange: (next: AdvancedFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<AdvancedFilters>(value);
  const active = countActive(value);

  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function patch<K extends keyof AdvancedFilters>(
    key: K,
    next: AdvancedFilters[K],
  ) {
    setDraft((d) => ({ ...d, [key]: next }));
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  function reset() {
    setDraft(emptyAdvancedFilters);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[13px]"
        >
          <Filter className="size-4" />
          Filters
          {active > 0 ? (
            <span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {active}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[460px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Advanced filters
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Narrow the orders table by date range, payment method,
            customer name, or minimum total.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date from" htmlFor="of-from">
              <Input
                id="of-from"
                type="date"
                value={draft.dateFrom}
                onChange={(e) => patch("dateFrom", e.target.value)}
                className="h-10"
              />
            </Field>
            <Field label="Date to" htmlFor="of-to">
              <Input
                id="of-to"
                type="date"
                value={draft.dateTo}
                onChange={(e) => patch("dateTo", e.target.value)}
                className="h-10"
              />
            </Field>
          </div>

          <Field label="Payment method">
            <Select
              value={draft.payment}
              onValueChange={(v) => patch("payment", v as AdvancedFilters["payment"])}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Customer name" htmlFor="of-cust">
            <Input
              id="of-cust"
              value={draft.customerName}
              onChange={(e) => patch("customerName", e.target.value)}
              placeholder="e.g. Olivia"
              className="h-10"
            />
          </Field>

          <Field label="Minimum total (Rs.)" htmlFor="of-min">
            <NumericInput
              id="of-min"
              value={draft.minTotal}
              onValueChange={(v) => patch("minTotal", v)}
              placeholder="0"
              className="h-10 text-end tabular-nums"
            />
          </Field>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-md text-[12.5px] text-muted-foreground"
            onClick={reset}
            disabled={countActive(draft) === 0}
          >
            <X className="size-3.5" />
            Reset
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={apply}
            >
              Apply filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[12px] font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}
