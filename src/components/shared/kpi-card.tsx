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
 *
 * Layering, top → bottom:
 *  1. Ambient radial glow tinted with the card's accent
 *  2. Glass surface (subtle tint + soft inner highlight)
 *  3. Content: label · value · delta · helper
 *  4. Sparkline wave bleeding to the lower edge
 *  5. Soft mask gradient so the wave fades into the surface
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
          "--glow-color": `color-mix(in oklab, ${accentColor} 38%, transparent)`,
        } as React.CSSProperties
      }
      className={cn(
        "ambient-glow ring-highlight group relative isolate overflow-hidden rounded-xl",
        "border border-border/60 bg-card/80 backdrop-blur-sm",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-elevated",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, white 35%, transparent), transparent)",
        }}
      />

      <div className="relative p-5 pb-2 md:p-5 md:pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/85">
              {kpi.label}
            </p>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="bg-gradient-to-br from-foreground to-foreground/75 bg-clip-text text-[26px] font-semibold leading-none tracking-tight text-transparent tabular-nums md:text-[28px]">
                {kpi.formatted}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <TrendIndicator delta={kpi.delta} trend={kpi.trend} />
              {kpi.helperText ? (
                <p className="text-[11.5px] leading-snug text-muted-foreground/85">
                  {kpi.helperText}
                </p>
              ) : null}
            </div>
          </div>

          <span
            aria-hidden
            className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-gradient-to-br from-card to-secondary/60 text-foreground/75 shadow-soft"
            style={
              {
                color: accentColor,
              } as React.CSSProperties
            }
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>

      <div className="pointer-events-none relative h-16 w-full">
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
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={1.8}
                fill={`url(#kpi-area-${gradId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-6"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--card) 65%, transparent))",
          }}
        />
      </div>
    </article>
  );
}
