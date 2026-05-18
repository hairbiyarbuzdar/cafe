"use client";

import * as React from "react";
import { ChefHat, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/layouts/page-header";
import { StationBoard } from "@/features/kitchen/station-board";
import { useKitchenTickets } from "@/store/kitchen-tickets-store";
import { useMenu } from "@/store/menu-store";
import { useStations } from "@/store/stations-store";
import { ORDERS } from "@/mock/orders";
import { splitOrderIntoTickets } from "@/lib/kitchen";
import { cn } from "@/lib/utils";

export default function KitchenPage() {
  const stations = useStations((s) => s.stations);
  const menu = useMenu((s) => s.items);
  const overrides = useKitchenTickets((s) => s.statuses);

  /** All tickets across all orders, split by station and tagged with live status. */
  const allTickets = React.useMemo(() => {
    return ORDERS.flatMap((o) =>
      splitOrderIntoTickets(o, menu, stations, overrides),
    ).filter((t) => t.status !== "served");
  }, [menu, stations, overrides]);

  const [activeStation, setActiveStation] = React.useState<string>("all");

  const stationsToShow = stations.filter((s) => s.active);
  const visibleStations =
    activeStation === "all"
      ? stationsToShow
      : stationsToShow.filter((s) => s.id === activeStation);

  const totalActive = allTickets.length;
  const counts = React.useMemo(() => {
    return Object.fromEntries(
      stations.map((s) => [s.id, allTickets.filter((t) => t.stationId === s.id).length]),
    );
  }, [stations, allTickets]);

  return (
    <>
      <PageHeader
        title="Kitchen display"
        description="Each station receives only the items it prepares. Update tickets as they move through pending → preparing → ready → served."
        meta={
          <>
            <Badge variant="secondary" className="rounded-md font-normal">
              <span className="me-1 inline-block size-1.5 rounded-full bg-success" />
              Service active
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              {totalActive} tickets in flight
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              {stationsToShow.length} active stations
            </Badge>
          </>
        }
        actions={
          <Button variant="outline" size="sm" className="h-9 rounded-md text-[12.5px]" disabled>
            <Filter className="size-4" />
            Recall
          </Button>
        }
      />

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
            const tickets = allTickets.filter((t) => t.stationId === station.id);
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
                        {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </header>
                <StationBoard station={station} tickets={tickets} />
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
