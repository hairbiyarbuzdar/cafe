"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { TrendIndicator } from "@/components/shared/trend-indicator";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types";

type Props = {
  kpi: Kpi;
  className?: string;
  accentColor?: string;
};

export function KpiCard({ kpi, className, accentColor = "var(--primary)" }: Props) {
  const data = kpi.sparkline.map((value, i) => ({ i, value }));

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-4 shadow-elevated transition-colors hover:bg-card md:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            {kpi.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[24px] font-semibold tracking-tight text-foreground tabular-nums md:text-[26px]">
              {kpi.formatted}
            </span>
            <TrendIndicator delta={kpi.delta} trend={kpi.trend} />
          </div>
          {kpi.helperText ? (
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              {kpi.helperText}
            </p>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 opacity-90">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient
                id={`spark-${kpi.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.28} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={accentColor}
              strokeWidth={1.6}
              fill={`url(#spark-${kpi.id})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
