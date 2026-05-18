"use client";

import * as React from "react";
import { ChefHat, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useMenu } from "@/store/menu-store";
import { useStations } from "@/store/stations-store";
import { cn } from "@/lib/utils";

const COLORS = [
  "#6F4E37",
  "#8B5E3C",
  "#3B82F6",
  "#4F7942",
  "#D4A24C",
  "#C2410C",
  "#9333EA",
  "#0F766E",
  "#BE185D",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StationsManager({ open, onOpenChange }: Props) {
  const stations = useStations((s) => s.stations);
  const createStation = useStations((s) => s.create);
  const updateStation = useStations((s) => s.update);
  const removeStation = useStations((s) => s.remove);
  const toggleActive = useStations((s) => s.toggleActive);
  const menuItems = useMenu((s) => s.items);

  const [name, setName] = React.useState("");
  const [printer, setPrinter] = React.useState("");
  const [color, setColor] = React.useState(COLORS[0]);

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (stations.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("A station with that name already exists");
      return;
    }
    createStation({ name: trimmed, printer: printer.trim() || undefined, color, active: true });
    toast.success(`${trimmed} station added`);
    setName("");
    setPrinter("");
  }

  function tryRemove(id: string, label: string) {
    const linked = menuItems.filter((m) => m.stationId === id).length;
    if (linked > 0) {
      toast.error(`Reassign ${linked} item${linked === 1 ? "" : "s"} before deleting ${label}`);
      return;
    }
    removeStation(id);
    toast.success(`${label} removed`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[min(640px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[640px]">
        <DialogHeader className="border-b px-5 pb-4 pt-5">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold tracking-tight">
            <ChefHat className="size-4 text-primary" />
            Kitchen stations
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Stations route POS orders to the right prep counter. Each menu item belongs to exactly one.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 border-b bg-surface-1 px-5 py-3.5 sm:grid-cols-[1fr_150px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="stn-name" className="text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground">
              Name
            </Label>
            <Input
              id="stn-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BBQ, Shakes"
              className="h-10 text-[13.5px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stn-printer" className="text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground">
              Printer
            </Label>
            <Input
              id="stn-printer"
              value={printer}
              onChange={(e) => setPrinter(e.target.value)}
              placeholder="Optional"
              className="h-10 text-[13.5px]"
            />
          </div>
          <div className="flex items-end">
            <Button type="button" className="h-10 w-full rounded-md text-[13px] sm:w-auto" onClick={add}>
              <Plus className="size-4" />
              Add station
            </Button>
          </div>
          <div className="sm:col-span-3">
            <Label className="text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground">
              Color
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Pick color ${c}`}
                  className={cn(
                    "size-7 rounded-md border-2 transition-transform",
                    color === c ? "scale-110 border-foreground/60" : "border-transparent",
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <ul className="divide-y">
            {stations.map((s) => {
              const linked = menuItems.filter((m) => m.stationId === s.id).length;
              return (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    aria-hidden
                    className="flex size-8 items-center justify-center rounded-md text-[12px] font-semibold text-white"
                    style={{ background: s.color }}
                  >
                    {s.name[0]?.toUpperCase() ?? "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Input
                      value={s.name}
                      onChange={(e) => updateStation(s.id, { name: e.target.value })}
                      className="h-8 border-transparent bg-transparent px-1 text-[13.5px] font-medium hover:border-border focus:border-border"
                    />
                    <p className="px-1 text-[11.5px] text-muted-foreground">
                      {linked} item{linked === 1 ? "" : "s"} routed · printer{" "}
                      <span className="font-mono text-foreground/80">
                        {s.printer ?? "—"}
                      </span>
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Switch
                      checked={s.active}
                      onCheckedChange={() => toggleActive(s.id)}
                    />
                    {s.active ? "Active" : "Off"}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-md text-muted-foreground hover:text-destructive"
                    onClick={() => tryRemove(s.id, s.name)}
                    aria-label={`Delete ${s.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
