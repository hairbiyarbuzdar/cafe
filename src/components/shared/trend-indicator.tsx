import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn, formatPercent } from "@/lib/utils";

type Props = {
  delta: number;
  trend?: "up" | "down" | "flat";
  className?: string;
  inverse?: boolean;
};

export function TrendIndicator({ delta, trend, className, inverse }: Props) {
  const direction = trend ?? (delta > 0 ? "up" : delta < 0 ? "down" : "flat");
  const positive = inverse ? direction === "down" : direction === "up";
  const negative = inverse ? direction === "up" : direction === "down";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        positive && "bg-success/12 text-success",
        negative && "bg-destructive/12 text-destructive",
        !positive && !negative && "bg-muted text-muted-foreground",
        className,
      )}
    >
      {direction === "up" ? (
        <ArrowUpRight className="size-3" />
      ) : direction === "down" ? (
        <ArrowDownRight className="size-3" />
      ) : (
        <Minus className="size-3" />
      )}
      {formatPercent(Math.abs(delta), 1)}
    </span>
  );
}
