"use client";

import * as React from "react";
import {
  Check,
  CircleSlash,
  Minus,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { tableStatus, useTables } from "@/store/tables-store";
import { useCart } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Table, TableStatus } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const STATUS_LABEL: Record<TableStatus, string> = {
  empty: "Available",
  partial: "Seated",
  full: "Full",
};

const STATUS_STYLES: Record<
  TableStatus,
  { card: string; dot: string; badge: string }
> = {
  empty: {
    card: "border-success/40 bg-success/8 hover:border-success/60",
    dot: "bg-success",
    badge: "bg-success/15 text-success border-success/30",
  },
  partial: {
    card: "border-warning/45 bg-warning/10 hover:border-warning/70",
    dot: "bg-warning",
    badge: "bg-warning/18 text-warning-foreground/85 border-warning/30",
  },
  full: {
    card: "border-destructive/45 bg-destructive/10 hover:border-destructive/65",
    dot: "bg-destructive",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export function TablesDialog({ open, onOpenChange }: Props) {
  const tables = useTables((s) => s.tables);
  const createTable = useTables((s) => s.createTable);
  const removeTable = useTables((s) => s.removeTable);
  const setOccupancy = useTables((s) => s.setOccupancy);
  const selectTable = useTables((s) => s.selectTable);
  const selectedTableId = useTables((s) => s.selectedTableId);
  const setCartTableId = useCart((s) => s.setTableId);

  const [capacity, setCapacity] = React.useState(4);

  const summary = React.useMemo(() => {
    const empty = tables.filter((t) => tableStatus(t) === "empty").length;
    const partial = tables.filter((t) => tableStatus(t) === "partial").length;
    const full = tables.filter((t) => tableStatus(t) === "full").length;
    return { empty, partial, full };
  }, [tables]);

  function handleCreate() {
    const t = createTable(capacity);
    toast.success(`${t.name} created`, {
      description: `Seats ${t.capacity} · marked available`,
    });
    setCapacity(4);
  }

  function handleSelect(t: Table) {
    selectTable(t.id);
    setCartTableId(t.id);
    if (t.occupancy === 0) setOccupancy(t.id, 1);
    toast.success(`Order assigned to ${t.name}`);
    onOpenChange(false);
  }

  function handleClear(t: Table) {
    setOccupancy(t.id, 0);
    if (selectedTableId === t.id) {
      selectTable(undefined);
      setCartTableId(undefined);
    }
    toast.success(`${t.name} cleared`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[min(720px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[720px]">
        <DialogHeader className="border-b border-border/70 px-5 pb-4 pt-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-[17px] font-semibold tracking-tight">
                Tables
              </DialogTitle>
              <DialogDescription className="text-[12.5px]">
                Manage tables and assign the current order to a seat.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <Pill tone="success" label={`${summary.empty} free`} />
              <Pill tone="warning" label={`${summary.partial} seated`} />
              <Pill tone="destructive" label={`${summary.full} full`} />
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 border-b border-border/70 bg-surface-1 px-5 py-3.5 sm:grid-cols-[1fr_140px_auto]">
          <div className="space-y-1.5">
            <Label
              htmlFor="next-name"
              className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
            >
              Next name
            </Label>
            <Input
              id="next-name"
              value={nextNamePreview(tables)}
              readOnly
              className="h-10 cursor-not-allowed bg-card font-mono text-[13.5px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="capacity"
              className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
            >
              Max people
            </Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              max={20}
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 text-[13.5px]"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              className="h-10 w-full rounded-md text-[13px] font-medium sm:w-auto"
              onClick={handleCreate}
            >
              <Plus className="size-4" />
              Add table
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {tables.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-1 text-center">
              <p className="text-[13px] font-medium text-foreground">No tables yet</p>
              <p className="text-[12px] text-muted-foreground">
                Create your first table above to start seating guests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
              {tables.map((t) => {
                const status = tableStatus(t);
                const style = STATUS_STYLES[status];
                const isSelected = selectedTableId === t.id;
                return (
                  <article
                    key={t.id}
                    className={cn(
                      "ring-highlight relative flex flex-col gap-3 rounded-xl border-2 p-3.5 text-left transition-all",
                      style.card,
                      isSelected && "ring-2 ring-primary/35",
                    )}
                  >
                    <header className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold tracking-tight">
                          {t.name}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Users className="size-3" />
                          Seats {t.capacity}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md border px-1.5 py-0 text-[10.5px] font-medium",
                          style.badge,
                        )}
                      >
                        <span className={cn("me-1 size-1.5 rounded-full", style.dot)} />
                        {STATUS_LABEL[status]}
                      </Badge>
                    </header>

                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[22px] font-semibold tabular-nums text-foreground">
                          {t.occupancy}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          / {t.capacity}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7 rounded-md border-border/60 bg-card/80"
                          onClick={() => setOccupancy(t.id, t.occupancy - 1)}
                          disabled={t.occupancy <= 0}
                          aria-label={`Decrease ${t.name} occupancy`}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7 rounded-md border-border/60 bg-card/80"
                          onClick={() => setOccupancy(t.id, t.occupancy + 1)}
                          disabled={t.occupancy >= t.capacity}
                          aria-label={`Increase ${t.name} occupancy`}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ms-auto size-7 rounded-md text-muted-foreground hover:text-foreground"
                          onClick={() => handleClear(t)}
                          disabled={t.occupancy === 0}
                          aria-label={`Clear ${t.name}`}
                          title="Clear"
                        >
                          <CircleSlash className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-md text-muted-foreground hover:text-destructive"
                          onClick={() => removeTable(t.id)}
                          aria-label={`Delete ${t.name}`}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? "outline" : "default"}
                      className="h-9 rounded-md text-[12.5px] font-medium"
                      onClick={() => handleSelect(t)}
                    >
                      {isSelected ? (
                        <>
                          <Check className="size-3.5" />
                          Current order
                        </>
                      ) : (
                        <>Assign order</>
                      )}
                    </Button>
                  </article>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Pill({
  tone,
  label,
}: {
  tone: "success" | "warning" | "destructive";
  label: string;
}) {
  const dot =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-warning"
        : "bg-destructive";
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-card px-1.5 py-0.5 text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

function nextNamePreview(tables: Table[]): string {
  const used = new Set(
    tables
      .map((t) => /^T-(\d+)$/.exec(t.name)?.[1])
      .filter((s): s is string => Boolean(s))
      .map((s) => parseInt(s, 10)),
  );
  let n = 1;
  while (used.has(n)) n++;
  return `T-${n}`;
}
