"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { SectionCard } from "@/components/shared/section-card";
import { CHANNEL_MIX } from "@/mock/analytics";
import { formatNumber } from "@/lib/utils";

export function ChannelMix() {
  const total = CHANNEL_MIX.reduce((sum, s) => sum + s.value, 0);

  return (
    <SectionCard
      title="Order channels"
      description="Today's order distribution"
    >
      <div className="grid grid-cols-[140px_1fr] items-center gap-5 md:grid-cols-[160px_1fr]">
        <div className="relative h-[140px] w-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CHANNEL_MIX}
                dataKey="value"
                innerRadius={42}
                outerRadius={64}
                stroke="var(--card)"
                strokeWidth={2}
                paddingAngle={2}
              >
                {CHANNEL_MIX.map((s, i) => (
                  <Cell key={i} fill={s.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <span className="text-[18px] font-semibold tabular-nums text-foreground">
              {formatNumber(total)}
            </span>
          </div>
        </div>
        <ul className="space-y-2.5 text-[12.5px]">
          {CHANNEL_MIX.map((s) => {
            const pct = s.value / total;
            return (
              <li key={s.channel} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ background: s.fill }}
                />
                <span className="flex-1 truncate text-foreground">{s.channel}</span>
                <span className="tabular-nums text-muted-foreground">
                  {(pct * 100).toFixed(0)}%
                </span>
                <span className="w-10 text-right tabular-nums text-foreground">
                  {s.value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionCard>
  );
}
