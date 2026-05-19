import {
  Activity,
  Coffee,
  PackageOpen,
  ShieldCheck,
  Users,
} from "lucide-react";

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

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <SectionCard
      title="Recent activity"
      description="Live operational events"
      action={
        <Button variant="ghost" size="xs" className="text-[11.5px]">
          View all
        </Button>
      }
      contentClassName="p-0"
    >
      {events.length === 0 ? (
        <p className="px-4 py-8 text-center text-[12.5px] text-muted-foreground md:px-5">
          Nothing here yet — events show up as orders, stock, and staff
          changes happen.
        </p>
      ) : null}
      <ul className="divide-y">
        {events.map((e) => {
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
    </SectionCard>
  );
}
