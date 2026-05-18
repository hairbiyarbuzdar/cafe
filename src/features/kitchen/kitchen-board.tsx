"use client";

import * as React from "react";
import { ChefHat } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StationBoard } from "@/features/kitchen/station-board";
import { useKitchenTickets } from "@/store/kitchen-tickets-store";
import { cn } from "@/lib/utils";
import type { KitchenStation, KitchenTicket } from "@/types";

/**
 * Client board. Tickets + stations are server-loaded from DB; the
 * lifecycle overrides (pending → preparing → ready → served) still
 * persist in localStorage via `useKitchenTickets` so demo
 * interactions feel snappy. A future iteration wires a server action
 * to persist status changes back to the KitchenTicket table.
 */
export function KitchenBoard({
  stations,
  tickets,
}: {
  stations: KitchenStation[];
  tickets: KitchenTicket[];
}) {
  const overrides = useKitchenTickets((s) => s.statuses);

  const merged = React.useMemo(() => {
    return tickets
      .map((t) => ({ ...t, status: overrides[t.id] ?? t.status }))
      .filter((t) => t.status !== "served");
  }, [tickets, overrides]);

  const [activeStation, setActiveStation] = React.useState<string>("all");

  const stationsToShow = stations.filter((s) => s.active);
  const visibleStations =
    activeStation === "all"
      ? stationsToShow
      : stationsToShow.filter((s) => s.id === activeStation);

  const totalActive = merged.length;
  const counts = React.useMemo(() => {
    return Object.fromEntries(
      stations.map((s) => [s.id, merged.filter((t) => t.stationId === s.id).length]),
    );
  }, [stations, merged]);

  return (
    <>
      <ScrollArea className="w-full">
        <div className="flex gap-1.5 pb-2">
          <StationChip
            label="All stations"
            count={totalActive}
            active={activeStation === "all"}
            onClick={() => setActiveStation("all")}
          />
          {stationsToShow.map((s) => (
            <StationChip
              key={s.id}
              label={s.name}
              count={counts[s.id] ?? 0}
              color={s.color}
              active={activeStation === s.id}
              onClick={() => setActiveStation(s.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {visibleStations.length === 0 ? (
        <div className="ring-highlight rounded-xl border border-dashed bg-card/40 p-10 text-center">
          <ChefHat className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 text-[14px] font-medium">No active stations</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Activate stations from the Menu page to start receiving tickets here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleStations.map((station) => {
            const stationTickets = merged.filter((t) => t.stationId === station.id);
            return (
              <section key={station.id}>
                <header className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="flex size-7 items-center justify-center rounded-md text-[12px] font-semibold text-white"
                      style={{ background: station.color }}
                    >
                      {station.name[0]?.toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-[15px] font-semibold leading-none tracking-tight">
                        {station.name}
                      </h2>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        Printer{" "}
                        <span className="font-mono text-foreground/80">
                          {station.printer ?? "—"}
                        </span>
                        {" · "}
                        {stationTickets.length} ticket
                        {stationTickets.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </header>
                <StationBoard station={station} tickets={stationTickets} />
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function StationChip({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border bg-card px-3 text-[12.5px] font-medium transition-all",
        active
          ? "border-primary/40 bg-primary text-primary-foreground shadow-soft"
          : "border-border/70 text-foreground hover:bg-muted",
      )}
    >
      {color ? (
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ background: active ? "currentColor" : color }}
        />
      ) : null}
      {label}
      <span
        className={cn(
          "ms-0.5 rounded px-1 text-[10.5px] tabular-nums",
          active ? "text-primary-foreground/85" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
