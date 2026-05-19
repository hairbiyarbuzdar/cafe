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
import type { AttendanceBucket } from "@/lib/queries/schedule";

export function AttendanceChart({ data }: { data: AttendanceBucket[] }) {
  return (
    <SectionCard
      title="Attendance"
      description="Punch-in adherence over the past 7 days"
      contentClassName="p-2 md:p-3"
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
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
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
            <Bar dataKey="onTime" stackId="a" fill="var(--chart-5)" radius={[3, 3, 0, 0]} maxBarSize={26} />
            <Bar dataKey="late" stackId="a" fill="var(--chart-3)" maxBarSize={26} />
            <Bar dataKey="absent" stackId="a" fill="var(--destructive)" radius={[0, 0, 3, 3]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
