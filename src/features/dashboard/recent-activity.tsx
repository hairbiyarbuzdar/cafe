"use client";

import * as React from "react";
import {
  Activity,
  Coffee,
  PackageOpen,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime, initials } from "@/lib/utils";
import type { ActivityEvent } from "@/types";

const ICONS: Record<ActivityEvent["type"], typeof Activity> = {
  order: Coffee,
  stock: PackageOpen,
  staff: Users,
  system: ShieldCheck,
};

const TINT: Record<ActivityEvent["type"], string> = {
  order: "bg-primary/10 text-primary",
  stock: "bg-warning/15 text-warning-foreground/80",
  staff: "bg-info/12 text-info",
  system: "bg-secondary text-secondary-foreground",
};

const RANGES = ["Today", "Yesterday", "7d", "30d"] as const;
type Range = (typeof RANGES)[number];

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  const [range, setRange] = React.useState<Range>("Today");

  const filteredEvents = React.useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;

    return events.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      if (range === "Today") return t >= startOfToday;
      if (range === "Yesterday") return t >= startOfYesterday && t < startOfToday;
      if (range === "7d") return t >= sevenDaysAgo;
      if (range === "30d") return t >= thirtyDaysAgo;
      return true;
    });
  }, [events, range]);

  const pg = usePagination(filteredEvents);

  return (
    <SectionCard
      title="Recent activity"
      description="Live operational events"
      action={
        <div className="inline-flex rounded-md border bg-card p-0.5">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="xs"
              variant={range === r ? "secondary" : "ghost"}
              onClick={() => setRange(r)}
              className="h-6 rounded px-2 text-[11px] font-medium"
            >
              {r}
            </Button>
          ))}
        </div>
      }
      contentClassName="p-0"
    >
      {filteredEvents.length === 0 ? (
        <p className="px-4 py-8 text-center text-[12.5px] text-muted-foreground md:px-5">
          Nothing here yet — events show up as orders, stock, and staff
          changes happen.
        </p>
      ) : null}
      <ul className="divide-y">
        {pg.pageItems.map((e) => {
          const Icon = ICONS[e.type];
          return (
            <li
              key={e.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                  TINT[e.type],
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {e.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
                  {e.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[11px] text-muted-foreground">
                  {formatRelativeTime(e.timestamp)}
                </span>
                {e.actor ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-1.5 py-0.5 text-[10.5px] font-medium text-secondary-foreground">
                    <span className="flex size-3.5 items-center justify-center rounded-full bg-primary/15 text-[8px] font-semibold text-primary">
                      {initials(e.actor.name)}
                    </span>
                    {e.actor.name.split(" ")[0]}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      {filteredEvents.length > 0 ? (
        <TablePagination
          page={pg.page}
          pageCount={pg.pageCount}
          shown={pg.shown}
          total={pg.total}
          onPrev={pg.prev}
          onNext={pg.next}
        />
      ) : null}
    </SectionCard>
  );
}
