"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "@/components/shared/section-card";
import { formatCompact, formatCurrency } from "@/lib/utils";
import type { DailyPoint } from "@/types";

export function SalesOverview({ data }: { data: DailyPoint[] }) {
  return (
    <SectionCard
      title="Sales overview"
      description="Revenue compared with orders over the past two weeks"
      contentClassName="p-2 md:p-3"
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 16, left: -8, bottom: 4 }}>
            <defs>
              <linearGradient id="bar-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.55} />
              </linearGradient>
              <linearGradient id="bar-ord" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 4" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${formatCompact(v)}`}
              width={56}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in oklab, var(--foreground) 4%, transparent)" }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                padding: "8px 10px",
              }}
              formatter={(value, name) => {
                const num = Number(value);
                if (name === "revenue") return [formatCurrency(num), "Revenue"];
                return [num, "Orders"];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="url(#bar-rev)"
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              fill="url(#bar-ord)"
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
