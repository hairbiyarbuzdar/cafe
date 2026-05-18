"use client";

import * as React from "react";
import {
  ChefHat,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layouts/page-header";
import { MenuFormSheet } from "@/features/menu/menu-form-sheet";
import { StationsManager } from "@/features/menu/stations-manager";
import { StationBadge } from "@/features/menu/station-badge";
import { useCategories } from "@/store/categories-store";
import { useMenu } from "@/store/menu-store";
import { useStations } from "@/store/stations-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

export default function MenuPage() {
  const items = useMenu((s) => s.items);
  const toggleAvailability = useMenu((s) => s.toggleAvailability);
  const togglePosVisibility = useMenu((s) => s.togglePosVisibility);
  const removeMany = useMenu((s) => s.removeMany);
  const stations = useStations((s) => s.stations);
  const categories = useCategories((s) => s.categories);
  const stationById = React.useMemo(
    () => new Map(stations.map((s) => [s.id, s])),
    [stations],
  );
  const categoryName = React.useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? id,
    [categories],
  );

  const [query, setQuery] = React.useState("");
  const [stationFilter, setStationFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MenuItem | null>(null);
  const [stationsOpen, setStationsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      if (stationFilter !== "all" && it.stationId !== stationFilter) return false;
      if (categoryFilter !== "all" && it.categoryId !== categoryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          it.name.toLowerCase().includes(q) || it.sku?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, stationFilter, categoryFilter, query]);

  const totals = React.useMemo(() => {
    return {
      total: items.length,
      visible: items.filter((i) => i.posVisible).length,
      unavailable: items.filter((i) => !i.available).length,
    };
  }, [items]);

  // Prune selections that no longer belong to the visible item set —
  // e.g. after a filter narrows the table or items get deleted.
  React.useEffect(() => {
    const valid = new Set(items.map((i) => i.id));
    setSelected((prev) => {
      const next = new Set<string>();
      for (const id of prev) if (valid.has(id)) next.add(id);
      return next.size === prev.size ? prev : next;
    });
  }, [items]);

  const filteredIds = React.useMemo(() => filtered.map((i) => i.id), [filtered]);
  const selectedInFiltered = filteredIds.filter((id) => selected.has(id)).length;
  const allFilteredSelected =
    filteredIds.length > 0 && selectedInFiltered === filteredIds.length;
  const headerState: boolean | "indeterminate" = allFilteredSelected
    ? true
    : selectedInFiltered > 0
      ? "indeterminate"
      : false;

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelected((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev);
        for (const id of filteredIds) next.delete(id);
        return next;
      }
      const next = new Set(prev);
      for (const id of filteredIds) next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function confirmDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    removeMany(ids);
    toast.success(`Deleted ${ids.length} menu item${ids.length === 1 ? "" : "s"}`);
    setSelected(new Set());
    setConfirmOpen(false);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(item: MenuItem) {
    setEditing(item);
    setFormOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Menu"
        description="The sellable products shown on the POS — pricing, categories, station routing, and recipes all live here."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={() => setStationsOpen(true)}
            >
              <ChefHat className="size-4" />
              Stations
            </Button>
            <Button size="sm" className="h-9 rounded-md text-[12.5px]" onClick={openCreate}>
              <Plus className="size-4" />
              New menu item
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Menu items"
          value={`${totals.total}`}
          hint="across all categories"
          icon={Utensils}
        />
        <Stat
          label="On the POS"
          value={`${totals.visible}`}
          hint={`${totals.total - totals.visible} hidden`}
          icon={Sparkles}
        />
        <Stat
          label="Unavailable"
          value={`${totals.unavailable}`}
          hint="86'd today"
          icon={ChefHat}
          tone="warning"
        />
      </section>

      <div className="ring-highlight rounded-xl border border-border/70 bg-card">
        <div className="flex flex-col gap-3 border-b border-border/70 p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <div className="relative min-w-0 flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or SKU…"
                className="h-9 rounded-md ps-9 text-[13px] sm:w-[260px]"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger size="sm" className="h-9 w-auto min-w-[140px] rounded-md text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger size="sm" className="h-9 w-auto min-w-[140px] rounded-md text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stations</SelectItem>
                {stations.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-primary/8 px-3 py-2 md:px-4">
            <p className="text-[12.5px] font-medium text-foreground">
              <span className="tabular-nums">{selected.size}</span> selected
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-md text-[12px]"
                onClick={clearSelection}
              >
                <X className="size-3.5" />
                Clear
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 rounded-md text-[12px]"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-3.5" />
                Delete{selected.size === 1 ? "" : ` ${selected.size}`}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Mobile cards */}
        <ul className="divide-y divide-border/60 md:hidden">
          {filtered.map((it) => {
            const isSelected = selected.has(it.id);
            return (
              <li
                key={it.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3.5",
                  isSelected && "bg-primary/5",
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(v) => toggleOne(it.id, v === true)}
                  className="mt-1"
                  aria-label={`Select ${it.name}`}
                />
                <button
                  type="button"
                  onClick={() => openEdit(it)}
                  className="flex flex-1 items-start gap-3 text-left active:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-foreground">
                      {it.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                      {categoryName(it.categoryId)} ·{" "}
                      <span className="font-mono">{it.sku ?? "—"}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StationBadge station={stationById.get(it.stationId)} />
                      {it.popular ? (
                        <Badge className="rounded-md border-0 bg-primary/12 px-1.5 py-0 text-[10.5px] text-primary">
                          Popular
                        </Badge>
                      ) : null}
                      {!it.available ? (
                        <Badge
                          variant="destructive"
                          className="rounded-md px-1.5 py-0 text-[10.5px]"
                        >
                          86&apos;d
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                    {formatCurrency(it.price)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <Table className="text-[13px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={headerState}
                    onCheckedChange={toggleAllFiltered}
                    aria-label={
                      allFilteredSelected
                        ? "Clear selection"
                        : "Select all visible menu items"
                    }
                    disabled={filtered.length === 0}
                  />
                </TableHead>
                <Th>Item</Th>
                <Th>Category</Th>
                <Th>Station</Th>
                <Th className="text-right">Price</Th>
                <Th className="text-center">Available</Th>
                <Th className="text-center">On POS</Th>
                <Th className="text-right">Actions</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No menu items match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((it) => {
                  const isSelected = selected.has(it.id);
                  return (
                    <TableRow
                      key={it.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(isSelected && "bg-primary/5")}
                    >
                      <TableCell className="px-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(v) => toggleOne(it.id, v === true)}
                          aria-label={`Select ${it.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{it.name}</p>
                          {it.popular ? (
                            <Sparkles className="size-3 text-primary" />
                          ) : null}
                        </div>
                        <p className="text-[11.5px] font-mono text-muted-foreground">
                          {it.sku ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {categoryName(it.categoryId)}
                      </TableCell>
                      <TableCell>
                        <StationBadge station={stationById.get(it.stationId)} />
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(it.price)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={it.available}
                          onCheckedChange={() => toggleAvailability(it.id)}
                          aria-label={`Toggle availability for ${it.name}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={it.posVisible}
                          onCheckedChange={() => togglePosVisibility(it.id)}
                          aria-label={`Toggle POS visibility for ${it.name}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-md text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(it)}
                          aria-label={`Edit ${it.name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <MenuFormSheet open={formOpen} onOpenChange={setFormOpen} item={editing} />
      <StationsManager open={stationsOpen} onOpenChange={setStationsOpen} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              Delete {selected.size} menu item{selected.size === 1 ? "" : "s"}?
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              This removes the selected items from the menu. Past orders that
              reference them stay intact, but the items will no longer appear
              on the POS or be available for new orders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={confirmDelete}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
        "h-10 text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Utensils;
  tone?: "warning";
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-elevated">
      <div>
        <p className="text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 text-[20px] font-semibold tabular-nums text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
      </div>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-md",
          tone === "warning"
            ? "bg-warning/15 text-warning-foreground/85"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-4" />
      </span>
    </div>
  );
}
