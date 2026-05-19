"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "@/components/shared/section-card";
import type { CategoryShare } from "@/lib/queries/analytics";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function CategoryMix({ data }: { data: CategoryShare[] }) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
  return (
    <SectionCard
      title="Revenue by category"
      description="Where this week's revenue is coming from"
      contentClassName="p-2 md:p-3"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sorted}
            margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="2 4" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${formatCompact(v)}`}
            />
            <YAxis
              dataKey="category"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
              width={96}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in oklab, var(--foreground) 4%, transparent)" }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            />
            <Bar
              dataKey="revenue"
              fill="var(--chart-1)"
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
