import { ChefHat } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KitchenStation } from "@/types";

type Props = {
  station: KitchenStation | undefined;
  className?: string;
};

/**
 * Compact station chip with the station's accent color. Falls back
 * to a neutral "Unrouted" pill when the station can't be resolved.
 */
export function StationBadge({ station, className }: Props) {
  if (!station) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground",
          className,
        )}
      >
        <ChefHat className="size-3" />
        Unrouted
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        className,
      )}
      style={{
        background: `color-mix(in oklab, ${station.color} 12%, transparent)`,
        color: station.color,
        borderColor: `color-mix(in oklab, ${station.color} 35%, transparent)`,
      }}
    >
      <span aria-hidden className="size-1.5 rounded-full" style={{ background: station.color }} />
      {station.name}
    </span>
  );
}
