"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { REVENUE_14D } from "@/mock/analytics";
import { formatCompact, formatCurrency } from "@/lib/utils";

const RANGES = ["7d", "14d", "30d", "90d"] as const;
type Range = (typeof RANGES)[number];

export function RevenueChart() {
  const [range, setRange] = React.useState<Range>("14d");

  const data = React.useMemo(() => {
    const len = range === "7d" ? 7 : range === "14d" ? 14 : range === "30d" ? 14 : 14;
    return REVENUE_14D.slice(-len);
  }, [range]);

  return (
    <SectionCard
      title="Revenue"
      description="Trailing revenue, orders, and guest counts"
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
      contentClassName="p-2 md:p-3"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.34} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-orders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="2 4"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${formatCompact(v)}`}
              width={56}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                padding: "8px 10px",
                boxShadow:
                  "0 1px 0 0 oklch(0 0 0 / 0.04), 0 1px 2px 0 oklch(0 0 0 / 0.05)",
              }}
              formatter={(value, name) => {
                const num = Number(value);
                if (name === "revenue") return [formatCurrency(num), "Revenue"];
                if (name === "orders") return [num, "Orders"];
                return [num, String(name ?? "")];
              }}
              labelStyle={{ color: "var(--muted-foreground)", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#grad-revenue)"
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--chart-2)"
              strokeWidth={1.5}
              fill="url(#grad-orders)"
              strokeDasharray="3 3"
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
