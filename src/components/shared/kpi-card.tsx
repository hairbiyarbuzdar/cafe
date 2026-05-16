"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import {
  CircleDollarSign,
  Receipt,
  ShoppingBag,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { TrendIndicator } from "@/components/shared/trend-indicator";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types";

type Props = {
  kpi: Kpi;
  className?: string;
  accentColor?: string;
  icon?: LucideIcon;
};

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  revenue: CircleDollarSign,
  orders: Receipt,
  avg: ShoppingBag,
  guests: UsersRound,
};

/**
 * Premium KPI card.
 * Layered: ambient glow → glass surface → content → wave → fade mask.
 * Reads in both light and dark with the same component.
 */
export function KpiCard({
  kpi,
  className,
  accentColor = "var(--primary)",
  icon,
}: Props) {
  const Icon = icon ?? DEFAULT_ICONS[kpi.id] ?? CircleDollarSign;
  const data = React.useMemo(
    () => kpi.sparkline.map((value, i) => ({ i, value })),
    [kpi.sparkline],
  );
  const gradId = React.useId();

  return (
    <article
      style={
        {
          "--glow-color": `color-mix(in oklab, ${accentColor} 42%, transparent)`,
        } as React.CSSProperties
      }
      className={cn(
        "ambient-glow ring-highlight group relative isolate overflow-hidden rounded-xl",
        "border border-border/70 bg-card",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover",
        className,
      )}
    >
      {/* Soft tinted wash from the accent in the top corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 0% 0%, color-mix(in oklab, ${accentColor} 8%, transparent), transparent 55%)`,
        }}
      />

      {/* Light reflection along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, white 60%, transparent), transparent)",
        }}
      />

      <div className="relative p-5 pb-3 md:p-6 md:pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.09em] text-muted-foreground">
              {kpi.label}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/75 bg-clip-text text-[30px] font-semibold leading-none tracking-tight text-transparent tabular-nums md:text-[32px]">
                {kpi.formatted}
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <TrendIndicator delta={kpi.delta} trend={kpi.trend} />
              {kpi.helperText ? (
                <p className="text-[12.5px] leading-snug text-muted-foreground">
                  {kpi.helperText}
                </p>
              ) : null}
            </div>
          </div>

          <span
            aria-hidden
            className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-card to-secondary/70 shadow-soft"
            style={{ color: accentColor }}
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </span>
        </div>
      </div>

      <div className="pointer-events-none relative h-[72px] w-full md:h-20">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id={`kpi-area-${gradId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.50} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={2}
                fill={`url(#kpi-area-${gradId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-8"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--card) 70%, transparent))",
          }}
        />
      </div>
    </article>
  );
}
