"use client";

import * as React from "react";
import { ChefHat } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StationBoard } from "@/features/kitchen/station-board";
import { localTicketId } from "@/lib/offline/queue";
import { useKitchenTickets } from "@/store/kitchen-tickets-store";
import { useOfflineOrders } from "@/store/offline-orders-store";
import { useOfflineTicketStatuses } from "@/store/offline-ticket-statuses-store";
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
  const clearLocalOverride = useKitchenTickets((s) => s.clearLocal);
  const queuedOverrides = useOfflineTicketStatuses((s) => s.byTicketId);
  const offlineShadows = useOfflineOrders((s) => s.shadows);

  // Reconcile optimistic overrides with the server. When the cook
  // marks a ticket "ready" we stash the override in `useKitchenTickets`
  // for instant feedback; once the server confirms, the override is
  // redundant. But if the server later moves *backwards* — e.g. POS
  // attaches and adds items, which resets the ticket to "pending" —
  // the stale override would otherwise keep painting the ticket on
  // the ready lane until the user manually refreshed.
  //
  // Drop any override whose value no longer matches the canonical
  // server status carried in the freshly-fetched `tickets` prop.
  // Only the in-memory store is touched; `useOfflineTicketStatuses`
  // is IDB-backed and self-clears when the queue drains.
  React.useEffect(() => {
    for (const t of tickets) {
      const override = overrides[t.id];
      if (override !== undefined && override !== t.status) {
        clearLocalOverride(t.id);
      }
    }
    // Intentionally not depending on `overrides` — the override map
    // mutates as a side effect of this very effect, and we only want
    // to reconcile when the server brings new ticket data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

  // Tickets synthesised from offline-queued place-order mutations.
  // One ticket per (shadow order × station). Same `${orderId}__${stationId}`
  // id shape as real tickets but with a `local-` prefix so the rest
  // of the kitchen UI can distinguish (and the offline status-change
  // path knows not to call the server action).
  const shadowTickets = React.useMemo<KitchenTicket[]>(() => {
    const out: KitchenTicket[] = [];
    for (const shadow of offlineShadows) {
      for (const s of shadow.stations) {
        out.push({
          id: localTicketId(shadow.id, s.stationId),
          orderId: `local-${shadow.id}`,
          orderNumber: shadow.number,
          stationId: s.stationId,
          channel: shadow.channel,
          table: shadow.tableName ?? undefined,
          status: "pending",
          items: s.items,
          notes: shadow.notes ?? undefined,
          createdAt: new Date(shadow.createdAt).toISOString(),
        });
      }
    }
    return out;
  }, [offlineShadows]);

  const merged = React.useMemo(() => {
    const all = [...tickets, ...shadowTickets];
    return all
      .map((t) => ({
        ...t,
        // Precedence: queued (IDB-backed) override beats in-memory
        // override beats server value. The IDB-backed override is
        // the persistent one — it survives refreshes while offline.
        status: queuedOverrides[t.id] ?? overrides[t.id] ?? t.status,
      }))
      .filter((t) => t.status !== "served");
  }, [tickets, shadowTickets, queuedOverrides, overrides]);

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
