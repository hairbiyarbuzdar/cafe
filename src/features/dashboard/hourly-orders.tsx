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
import { HOURLY_ORDERS } from "@/mock/analytics";

export function HourlyOrders() {
  return (
    <SectionCard
      title="Orders by hour"
      description="Volume across today's service hours"
      contentClassName="p-2 md:p-3"
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={HOURLY_ORDERS} margin={{ top: 12, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="2 4"
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickMargin={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={36}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                padding: "6px 10px",
              }}
              formatter={(value) => [Number(value), "Orders"]}
            />
            <Bar
              dataKey="orders"
              fill="var(--chart-1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
