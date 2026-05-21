"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarRange, X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function toInput(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function preset(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: toInput(from), to: toInput(to) };
}

function thisMonth(): { from: string; to: string } {
  const now = new Date();
  return {
    from: toInput(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: toInput(now),
  };
}

const PRESETS: { label: string; range: () => { from: string; to: string } }[] = [
  { label: "Last 7 days", range: () => preset(7) },
  { label: "Last 30 days", range: () => preset(30) },
  { label: "This month", range: thisMonth },
  { label: "Last 90 days", range: () => preset(90) },
];

/**
 * Date-range filter for any /reports route. Writes `from`/`to` into the
 * current URL — the server page re-fetches scoped to the range. Same
 * dialog shape as the Orders / Dashboard filters.
 */
export function ReportFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const spFrom = sp.get("from") ?? "";
  const spTo = sp.get("to") ?? "";
  const active = (spFrom ? 1 : 0) + (spTo ? 1 : 0);

  const [from, setFrom] = React.useState(spFrom);
  const [to, setTo] = React.useState(spTo);

  React.useEffect(() => {
    if (open) {
      setFrom(spFrom);
      setTo(spTo);
    }
  }, [open, spFrom, spTo]);

  function apply(next?: { from: string; to: string }) {
    const f = next?.from ?? from;
    const t = next?.to ?? to;
    const params = new URLSearchParams(sp.toString());
    if (f) params.set("from", f);
    else params.delete("from");
    if (t) params.set("to", t);
    else params.delete("to");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  function reset() {
    setFrom("");
    setTo("");
  }

  const label =
    active && spFrom && spTo ? `${spFrom} — ${spTo}` : "All time";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-md text-[12.5px]"
        >
          <CalendarRange className="size-3.5" />
          {label}
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
            Filter by date range
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Scope every figure on this report to a period. Leave empty for
            all-time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                className="h-7 rounded-md text-[11.5px]"
                onClick={() => {
                  const r = p.range();
                  setFrom(r.from);
                  setTo(r.to);
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rf-from" className="text-[12px] font-medium">
                From
              </Label>
              <Input
                id="rf-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rf-to" className="text-[12px] font-medium">
                To
              </Label>
              <Input
                id="rf-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 rounded-md text-[12.5px] text-muted-foreground",
            )}
            onClick={reset}
            disabled={!from && !to}
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
              onClick={() => apply()}
            >
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
