"use client";

import * as React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flame,
  PackageCheck,
  TriangleAlert,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChannelBadge } from "@/features/orders/status-badge";
import { useKitchenTickets } from "@/store/kitchen-tickets-store";
import { NEXT_STATUS, PREV_STATUS } from "@/lib/kitchen";
import { cn, formatRelativeTime } from "@/lib/utils";
import type {
  KitchenStation,
  KitchenTicket,
  TicketStatus,
} from "@/types";

type Props = {
  station: KitchenStation;
  tickets: KitchenTicket[];
};

const LANE_META: Record<
  Exclude<TicketStatus, "served" | "cancelled">,
  { label: string; icon: typeof Clock; tone: string; nextLabel: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    tone: "border-warning/40 bg-warning/10 text-warning-foreground/85",
    nextLabel: "Start preparing",
  },
  preparing: {
    label: "Preparing",
    icon: Flame,
    tone: "border-info/40 bg-info/10 text-info",
    nextLabel: "Mark ready",
  },
  ready: {
    label: "Ready",
    icon: PackageCheck,
    tone: "border-primary/40 bg-primary/10 text-primary",
    nextLabel: "Hand off",
  },
};

const LANES: Exclude<TicketStatus, "served" | "cancelled">[] = [
  "pending",
  "preparing",
  "ready",
];

export function StationBoard({ station, tickets }: Props) {
  const setStatus = useKitchenTickets((s) => s.setStatus);

  const cancelled = tickets.filter((t) => t.status === "cancelled");
  const lanes = LANES.map((lane) => ({
    lane,
    items: tickets.filter((t) => t.status === lane),
  }));

  function advance(ticket: KitchenTicket) {
    const next = NEXT_STATUS[ticket.status];
    if (!next) return;
    setStatus(ticket.id, next);
    toast.success(`${ticket.orderNumber} → ${LANE_LABEL(next)}`, {
      description: `${station.name} ticket updated`,
    });
  }

  function regress(ticket: KitchenTicket) {
    const prev = PREV_STATUS[ticket.status];
    if (!prev) return;
    setStatus(ticket.id, prev);
  }

  function dismiss(ticket: KitchenTicket) {
    setStatus(ticket.id, "served");
    toast.success(`${ticket.orderNumber} dismissed`, {
      description: `Stop work on ${station.name}`,
    });
  }

  return (
    <div className="space-y-3">
      {cancelled.length > 0 ? (
        <section
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/8 p-3"
        >
          <header className="flex items-center justify-between gap-2 pb-2">
            <p className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-destructive">
              <TriangleAlert className="size-3.5" />
              Cancelled — stop preparing
            </p>
            <span className="text-[11.5px] font-medium tabular-nums text-destructive/80">
              {cancelled.length}
            </span>
          </header>
          <ul className="space-y-2">
            {cancelled.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-start gap-3 rounded-md border border-destructive/30 bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold tabular-nums text-foreground">
                    {ticket.orderNumber}
                    <ChannelBadge channel={ticket.channel} />
                    {ticket.table ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Utensils className="size-3" />
                        {ticket.table}
                      </span>
                    ) : null}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[12.5px] text-muted-foreground line-through">
                    {ticket.items.map((i) => (
                      <li key={i.id}>
                        ×{i.quantity} {i.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md text-[12px]"
                  onClick={() => dismiss(ticket)}
                >
                  <X className="size-3.5" />
                  Dismiss
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

    <ScrollArea className="w-full">
      <div className="grid min-w-[760px] grid-cols-3 gap-3 p-1 md:min-w-0">
        {lanes.map(({ lane, items }) => {
          const meta = LANE_META[lane];
          const Icon = meta.icon;
          return (
            <section
              key={lane}
              className="ring-highlight flex min-h-[200px] flex-col gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3"
            >
              <header className="flex items-center justify-between">
                <h3
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
                    meta.tone,
                  )}
                >
                  <Icon className="size-3.5" />
                  {meta.label}
                </h3>
                <span className="text-[11.5px] font-medium tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </header>

              {items.length === 0 ? (
                <div className="flex h-20 items-center justify-center rounded-md border border-dashed text-[12px] text-muted-foreground">
                  No tickets
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {items.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      station={station}
                      onAdvance={() => advance(ticket)}
                      onRegress={() => regress(ticket)}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
    </div>
  );
}

function TicketCard({
  ticket,
  station,
  onAdvance,
  onRegress,
}: {
  ticket: KitchenTicket;
  station: KitchenStation;
  onAdvance: () => void;
  onRegress: () => void;
}) {
  const next = NEXT_STATUS[ticket.status];
  const prev = PREV_STATUS[ticket.status];
  const meta =
    ticket.status !== "served" && ticket.status !== "cancelled"
      ? LANE_META[ticket.status]
      : null;

  return (
    <article
      className="rounded-lg border bg-card p-3 shadow-soft"
      style={{
        borderColor: `color-mix(in oklab, ${station.color} 22%, var(--border))`,
      }}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[14px] font-semibold tabular-nums">
            {ticket.orderNumber}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <ChannelBadge channel={ticket.channel} />
            {ticket.table ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Utensils className="size-3" />
                {ticket.table}
              </span>
            ) : null}
          </div>
        </div>
        <Badge
          variant="outline"
          className="rounded-md border-border/60 px-1.5 py-0 text-[10.5px] font-mono"
          style={{ color: station.color, borderColor: `${station.color}55` }}
        >
          {station.printer ?? station.name}
        </Badge>
      </header>

      <ul className="mt-2.5 space-y-1 text-[13px]">
        {ticket.items.map((i) => (
          <li key={i.id} className="flex items-start gap-2">
            <span className="font-medium tabular-nums text-muted-foreground">
              ×{i.quantity}
            </span>
            <div className="min-w-0">
              <p className="truncate">{i.name}</p>
              {i.modifiers && i.modifiers.length > 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  {i.modifiers.join(" · ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {ticket.notes ? (
        <p className="mt-2 rounded-md border border-warning/20 bg-warning/10 px-2 py-1.5 text-[11.5px] text-foreground/85">
          {ticket.notes}
        </p>
      ) : null}

      <footer className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {formatRelativeTime(ticket.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          {prev ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-md text-muted-foreground hover:text-foreground"
              onClick={onRegress}
              aria-label="Move back"
              title="Move back"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
          ) : null}
          {next ? (
            <Button
              size="sm"
              className="h-8 rounded-md text-[12px]"
              onClick={onAdvance}
            >
              {next === "served" ? (
                <CheckCircle2 className="size-3.5" />
              ) : null}
              {meta?.nextLabel ?? "Advance"}
            </Button>
          ) : null}
        </div>
      </footer>
    </article>
  );
}

function LANE_LABEL(s: TicketStatus): string {
  if (s === "served") return "Served";
  if (s === "cancelled") return "Cancelled";
  return LANE_META[s].label;
}
