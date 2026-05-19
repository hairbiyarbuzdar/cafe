"use client";

import * as React from "react";
import { Armchair, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TablesDialog } from "@/features/pos/tables-dialog";
import { useCart } from "@/store/cart-store";
import { tableStatus, useTables } from "@/store/tables-store";
import { cn } from "@/lib/utils";
import type { Table } from "@/types";

/**
 * Compact table picker that lives in the cart panel.
 *
 * Only renders empty + partially-occupied tables as small chips —
 * full tables are hidden until the user opens the manager dialog
 * via "More". Each chip shows occupancy as `current/max`.
 */
export function TablePicker() {
  const tables = useTables((s) => s.tables);
  const selectTable = useTables((s) => s.selectTable);
  const tableId = useCart((s) => s.tableId);
  const setTableId = useCart((s) => s.setTableId);

  const [open, setOpen] = React.useState(false);

  const available = tables.filter((t) => tableStatus(t) !== "full");
  const hiddenCount = tables.length - available.length;
  const selected = tables.find((t) => t.id === tableId);
  // If the selected table is full, surface it so the user can still
  // see/manage their active assignment.
  const visible = selected && !available.includes(selected) ? [selected, ...available] : available;

  function pick(table: Table) {
    if (tableId === table.id) {
      // toggle off
      setTableId(undefined);
      selectTable(undefined);
      return;
    }
    setTableId(table.id);
    selectTable(table.id);
    // Occupancy is taken when the order is placed (uses cart's
    // guests count); picking a chip only earmarks the table.
    toast.success(`Order assigned to ${table.name}`);
  }

  return (
    <div className="border-b bg-surface-1 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          <Armchair className="size-3.5" />
          Tables
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setOpen(true)}
          className="h-7 rounded-md px-2 text-[11.5px] text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="size-3.5" />
          More
          {hiddenCount > 0 ? (
            <span className="ms-0.5 rounded bg-secondary px-1 text-[10px] font-medium tabular-nums text-secondary-foreground">
              {hiddenCount}
            </span>
          ) : null}
        </Button>
      </div>

      {visible.length === 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border/70 bg-card px-3 py-2 text-[12px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="size-3.5" />
          Add your first table
        </button>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {visible.map((t) => (
            <TableChip
              key={t.id}
              table={t}
              active={tableId === t.id}
              onSelect={() => pick(t)}
            />
          ))}
        </div>
      )}

      <TablesDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function TableChip({
  table,
  active,
  onSelect,
}: {
  table: Table;
  active: boolean;
  onSelect: () => void;
}) {
  const status = tableStatus(table);
  const isFull = status === "full";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={`${table.name} · ${table.occupancy} of ${table.capacity} seats`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-[12px] font-medium transition-all",
        active
          ? "border-primary/50 bg-primary text-primary-foreground shadow-soft"
          : "border-border/70 bg-card text-foreground hover:border-primary/40 hover:bg-muted/60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          active
            ? "bg-primary-foreground/85"
            : status === "empty"
              ? "bg-success"
              : isFull
                ? "bg-destructive"
                : "bg-warning",
        )}
      />
      <span className="font-semibold tabular-nums">{table.name}</span>
      <span
        className={cn(
          "tabular-nums",
          active ? "text-primary-foreground/85" : "text-muted-foreground",
        )}
      >
        {table.occupancy}/{table.capacity}
      </span>
    </button>
  );
}
