import "server-only";

import { prisma } from "@/lib/prisma";
import type { ChannelSlice, DailyPoint, HourPoint, Kpi, TopProduct } from "@/types";

/**
 * All analytics queries pull from the same `Order` / `OrderItem` /
 * `MenuItem` / `InventoryMovement` tables — no aggregation jobs, no
 * materialized views. The dataset is small (single café) so direct
 * SQL is fine; revisit when we add multi-location or higher volume.
 *
 * Revenue is computed from *paid* orders only (`paidAt IS NOT NULL`
 * and status NOT IN cancelled/refunded). The split between paid and
 * placed maps directly to the held-order workflow.
 */

const PKR = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

/**
 * Optional dashboard scope. `from`/`to` are inclusive day boundaries;
 * `channel` is a channel slug ("dine-in" / …) or "all". When omitted the
 * queries keep their original fixed scope (today / 14d / this week) so
 * other callers (Reports) are unaffected.
 */
export type DashboardFilter = {
  from?: Date;
  to?: Date;
  channel?: string;
};

/** "all" / empty → null (no channel filter). */
function normChannel(channel?: string): string | null {
  return channel && channel !== "all" ? channel : null;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/** Half-open [from, to) bounds for a filter's inclusive day range. */
function rangeBounds(filter?: DashboardFilter): { from: Date; to: Date } | null {
  if (!filter?.from || !filter?.to) return null;
  return { from: startOf(filter.from), to: startOf(addDays(filter.to, 1)) };
}

// ──────────────────────────────────────────────────────────────
// KPIs (Dashboard + Reports headers)
// ──────────────────────────────────────────────────────────────

function startOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

type DayStats = {
  revenue: number;
  orders: number;
  guests: number;
};

async function dayStats(
  from: Date,
  to: Date,
  channel: string | null = null,
): Promise<DayStats> {
  const rows = await prisma.$queryRaw<
    { revenue: number | null; orders: number | null; dine_in: number | null }[]
  >`
    SELECT
      COALESCE(SUM(total)::float8, 0) AS revenue,
      COUNT(*)::int                     AS orders,
      COUNT(*) FILTER (WHERE channel = 'dine-in')::int AS dine_in
    FROM "Order"
    WHERE "paidAt" >= ${from}
      AND "paidAt" <  ${to}
      AND status NOT IN ('cancelled', 'refunded')
      AND (${channel}::text IS NULL OR channel = ${channel})
  `;
  const row = rows[0] ?? { revenue: 0, orders: 0, dine_in: 0 };
  const orders = Number(row.orders ?? 0);
  const dineIn = Number(row.dine_in ?? 0);
  // No per-order party size in the schema yet — approximate guests as
  // dine-in orders × 2 + non-dine-in orders × 1 (a takeaway/delivery
  // order typically maps to one customer).
  const guests = dineIn * 2 + (orders - dineIn);
  return { revenue: Number(row.revenue ?? 0), orders, guests };
}

async function revenueByDay(
  from: Date,
  to: Date,
  channel: string | null = null,
): Promise<DailyPoint[]> {
  const rows = await prisma.$queryRaw<
    { day: Date; revenue: number | null; orders: number | null; dine_in: number | null }[]
  >`
    SELECT
      date_trunc('day', "paidAt") AS day,
      COALESCE(SUM(total)::float8, 0)                 AS revenue,
      COUNT(*)::int                                    AS orders,
      COUNT(*) FILTER (WHERE channel = 'dine-in')::int AS dine_in
    FROM "Order"
    WHERE "paidAt" >= ${from}
      AND "paidAt" <  ${to}
      AND status NOT IN ('cancelled', 'refunded')
      AND (${channel}::text IS NULL OR channel = ${channel})
    GROUP BY 1
    ORDER BY 1
  `;
  const byKey = new Map<string, DailyPoint>();
  for (const r of rows) {
    const orders = Number(r.orders ?? 0);
    const dineIn = Number(r.dine_in ?? 0);
    byKey.set(r.day.toISOString().slice(0, 10), {
      date: r.day.toISOString().slice(0, 10),
      revenue: Number(r.revenue ?? 0),
      orders,
      guests: dineIn * 2 + (orders - dineIn),
    });
  }
  // Fill missing days so the chart x-axis is continuous.
  const out: DailyPoint[] = [];
  for (let d = new Date(from); d < to; d = addDays(d, 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push(
      byKey.get(key) ?? {
        date: key,
        revenue: 0,
        orders: 0,
        guests: 0,
      },
    );
  }
  return out;
}

export async function todaysKpis(filter?: DashboardFilter): Promise<Kpi[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  if (range) return rangeKpis(range.from, range.to, channel);

  const today = startOf(new Date());
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  const lastWeekStart = addDays(today, -7);

  const [todayStats, yesterdayStats, last14] = await Promise.all([
    dayStats(today, tomorrow, channel),
    dayStats(yesterday, today, channel),
    revenueByDay(addDays(today, -13), tomorrow, channel),
  ]);

  // For the AOV comparison we want this-week vs last-week so the
  // metric isn't noisy on low-volume days.
  const lastWeek = await dayStats(lastWeekStart, today, channel);

  const todayAov = todayStats.orders > 0 ? todayStats.revenue / todayStats.orders : 0;
  const weekAov =
    lastWeek.orders > 0 ? lastWeek.revenue / lastWeek.orders : 0;

  const revenueSpark = last14.map((d) => Math.max(0, Math.round(d.revenue)));
  const orderSpark = last14.map((d) => d.orders);
  const guestSpark = last14.map((d) => d.guests);
  const aovSpark = last14.map((d) => (d.orders > 0 ? Math.round(d.revenue / d.orders) : 0));

  return [
    {
      id: "revenue",
      label: "Revenue today",
      value: todayStats.revenue,
      formatted: PKR(todayStats.revenue),
      delta: pctDelta(todayStats.revenue, yesterdayStats.revenue),
      trend: trendOf(todayStats.revenue, yesterdayStats.revenue),
      sparkline: revenueSpark,
      helperText: `vs ${PKR(yesterdayStats.revenue)} yesterday`,
    },
    {
      id: "orders",
      label: "Orders",
      value: todayStats.orders,
      formatted: `${todayStats.orders}`,
      delta: pctDelta(todayStats.orders, yesterdayStats.orders),
      trend: trendOf(todayStats.orders, yesterdayStats.orders),
      sparkline: orderSpark,
      helperText: `vs ${yesterdayStats.orders} yesterday`,
    },
    {
      id: "avg",
      label: "Avg order value",
      value: Math.round(todayAov),
      formatted: PKR(todayAov),
      delta: pctDelta(todayAov, weekAov),
      trend: trendOf(todayAov, weekAov),
      sparkline: aovSpark,
      helperText: `vs ${PKR(weekAov)} last week`,
    },
    {
      id: "guests",
      label: "Guests served",
      value: todayStats.guests,
      formatted: `${todayStats.guests}`,
      delta: pctDelta(todayStats.guests, yesterdayStats.guests),
      trend: trendOf(todayStats.guests, yesterdayStats.guests),
      sparkline: guestSpark,
      helperText:
        todayStats.guests >= yesterdayStats.guests
          ? "Approximated from channel mix"
          : "Lower foot traffic today",
    },
  ];
}

/** KPIs for an arbitrary [from, to) range, compared against the
 * equal-length window immediately before it. */
async function rangeKpis(
  from: Date,
  to: Date,
  channel: string | null,
): Promise<Kpi[]> {
  const lenMs = Math.max(86_400_000, to.getTime() - from.getTime());
  const prevFrom = new Date(from.getTime() - lenMs);
  const [curr, prev, series] = await Promise.all([
    dayStats(from, to, channel),
    dayStats(prevFrom, from, channel),
    revenueByDay(from, to, channel),
  ]);
  const currAov = curr.orders > 0 ? curr.revenue / curr.orders : 0;
  const prevAov = prev.orders > 0 ? prev.revenue / prev.orders : 0;
  const revSpark = series.map((d) => Math.max(0, Math.round(d.revenue)));
  const ordSpark = series.map((d) => d.orders);
  const guestSpark = series.map((d) => d.guests);
  const aovSpark = series.map((d) =>
    d.orders > 0 ? Math.round(d.revenue / d.orders) : 0,
  );
  return [
    {
      id: "revenue",
      label: "Revenue",
      value: curr.revenue,
      formatted: PKR(curr.revenue),
      delta: pctDelta(curr.revenue, prev.revenue),
      trend: trendOf(curr.revenue, prev.revenue),
      sparkline: revSpark,
      helperText: `vs ${PKR(prev.revenue)} prior period`,
    },
    {
      id: "orders",
      label: "Orders",
      value: curr.orders,
      formatted: `${curr.orders}`,
      delta: pctDelta(curr.orders, prev.orders),
      trend: trendOf(curr.orders, prev.orders),
      sparkline: ordSpark,
      helperText: `vs ${prev.orders} prior period`,
    },
    {
      id: "avg",
      label: "Avg order value",
      value: Math.round(currAov),
      formatted: PKR(currAov),
      delta: pctDelta(currAov, prevAov),
      trend: trendOf(currAov, prevAov),
      sparkline: aovSpark,
      helperText: `vs ${PKR(prevAov)} prior period`,
    },
    {
      id: "guests",
      label: "Guests served",
      value: curr.guests,
      formatted: `${curr.guests}`,
      delta: pctDelta(curr.guests, prev.guests),
      trend: trendOf(curr.guests, prev.guests),
      sparkline: guestSpark,
      helperText: "Approximated from channel mix",
    },
  ];
}

// ──────────────────────────────────────────────────────────────
// 14-day revenue + orders trend
// ──────────────────────────────────────────────────────────────

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * 14-day revenue with `date` already labelled as a weekday name —
 * keeps the chart axis legible without forcing every consumer to
 * format dates the same way.
 */
export async function revenue14d(filter?: DashboardFilter): Promise<DailyPoint[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  if (range) {
    const series = await revenueByDay(range.from, range.to, channel);
    return series.map((d) => ({ ...d, date: shortDate(d.date) }));
  }
  const today = startOf(new Date());
  const start = addDays(today, -13);
  const series = await revenueByDay(start, addDays(today, 1), channel);
  return series.map((d) => ({
    ...d,
    date: WEEKDAY[new Date(d.date + "T00:00:00").getDay()] ?? d.date,
  }));
}

// ──────────────────────────────────────────────────────────────
// Hourly orders (today)
// ──────────────────────────────────────────────────────────────

function formatHour(hour24: number): string {
  if (hour24 === 0) return "12a";
  if (hour24 < 12) return `${hour24}a`;
  if (hour24 === 12) return "12p";
  return `${hour24 - 12}p`;
}

export async function hourlyOrdersToday(
  filter?: DashboardFilter,
): Promise<HourPoint[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const from = range ? range.from : startOf(new Date());
  const to = range ? range.to : addDays(startOf(new Date()), 1);
  const rows = await prisma.$queryRaw<{ hour: number; orders: number }[]>`
    SELECT EXTRACT(HOUR FROM "paidAt")::int AS hour,
           COUNT(*)::int                     AS orders
    FROM "Order"
    WHERE "paidAt" >= ${from}
      AND "paidAt" <  ${to}
      AND status NOT IN ('cancelled', 'refunded')
      AND (${channel}::text IS NULL OR channel = ${channel})
    GROUP BY 1
    ORDER BY 1
  `;
  const byHour = new Map(rows.map((r) => [Number(r.hour), Number(r.orders)]));
  // Café hours 7am–8pm — fill missing slots so bars line up cleanly.
  const out: HourPoint[] = [];
  for (let h = 7; h <= 20; h++) {
    out.push({ hour: formatHour(h), orders: byHour.get(h) ?? 0 });
  }
  return out;
}

// ──────────────────────────────────────────────────────────────
// Channel mix (paid orders, last 14 days)
// ──────────────────────────────────────────────────────────────

const CHANNEL_FILLS: Record<string, string> = {
  "dine-in": "var(--chart-1)",
  takeaway: "var(--chart-2)",
  delivery: "var(--chart-3)",
  online: "var(--chart-4)",
};

const CHANNEL_LABELS: Record<string, string> = {
  "dine-in": "Dine-in",
  takeaway: "Takeaway",
  delivery: "Delivery",
  online: "Online",
};

export async function channelMix(filter?: DashboardFilter): Promise<ChannelSlice[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const from = range ? range.from : addDays(startOf(new Date()), -13);
  const to = range ? range.to : addDays(startOf(new Date()), 1);
  const rows = await prisma.$queryRaw<{ channel: string; orders: number }[]>`
    SELECT channel, COUNT(*)::int AS orders
    FROM "Order"
    WHERE "paidAt" >= ${from}
      AND "paidAt" <  ${to}
      AND status NOT IN ('cancelled', 'refunded')
      AND (${channel}::text IS NULL OR channel = ${channel})
    GROUP BY channel
    ORDER BY orders DESC
  `;
  // Stable channel ordering for the legend, regardless of what showed up.
  const known = ["dine-in", "takeaway", "delivery", "online"] as const;
  const byChannel = new Map(rows.map((r) => [r.channel, Number(r.orders)]));
  return known.map((c) => ({
    channel: CHANNEL_LABELS[c] ?? c,
    value: byChannel.get(c) ?? 0,
    fill: CHANNEL_FILLS[c] ?? "var(--chart-5)",
  }));
}

// ──────────────────────────────────────────────────────────────
// Top products (this week)
// ──────────────────────────────────────────────────────────────

export async function topProducts(
  limit = 7,
  filter?: DashboardFilter,
): Promise<TopProduct[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const today = startOf(new Date());
  const start = range ? range.from : addDays(today, -6);
  const end = range ? range.to : addDays(today, 1);
  const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()));

  const [current, previous] = await Promise.all([
    prisma.$queryRaw<
      {
        menuItemId: string;
        name: string;
        category: string | null;
        units: number;
        revenue: number;
      }[]
    >`
      SELECT
        oi."menuItemId",
        oi.name,
        mc.name      AS category,
        SUM(oi.quantity)::int                                  AS units,
        SUM(oi.quantity * oi."unitPrice")::float8              AS revenue
      FROM "OrderItem" oi
      JOIN "Order" o     ON o.id = oi."orderId"
      LEFT JOIN "MenuItem" mi   ON mi.id = oi."menuItemId"
      LEFT JOIN "MenuCategory" mc ON mc.id = mi."categoryId"
      WHERE o."paidAt" >= ${start}
        AND o."paidAt" <  ${end}
        AND o.status NOT IN ('cancelled', 'refunded')
        AND (${channel}::text IS NULL OR o.channel = ${channel})
      GROUP BY oi."menuItemId", oi.name, mc.name
      ORDER BY revenue DESC
      LIMIT ${limit}
    `,
    prisma.$queryRaw<{ menuItemId: string; revenue: number }[]>`
      SELECT oi."menuItemId",
             SUM(oi.quantity * oi."unitPrice")::float8 AS revenue
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE o."paidAt" >= ${prevStart}
        AND o."paidAt" <  ${start}
        AND o.status NOT IN ('cancelled', 'refunded')
        AND (${channel}::text IS NULL OR o.channel = ${channel})
      GROUP BY oi."menuItemId"
    `,
  ]);

  const prevByItem = new Map(previous.map((r) => [r.menuItemId, Number(r.revenue ?? 0)]));

  return current.map((row, idx) => {
    const revenue = Number(row.revenue ?? 0);
    const prev = prevByItem.get(row.menuItemId) ?? 0;
    return {
      rank: idx + 1,
      name: row.name,
      category: row.category ?? "—",
      units: Number(row.units ?? 0),
      revenue,
      delta: pctDelta(revenue, prev),
    };
  });
}

// ──────────────────────────────────────────────────────────────
// Category revenue (last 14 days)
// ──────────────────────────────────────────────────────────────

export type CategoryShare = { category: string; revenue: number };

export async function categoryRevenue(): Promise<CategoryShare[]> {
  const since = addDays(startOf(new Date()), -13);
  const rows = await prisma.$queryRaw<
    { category: string | null; revenue: number }[]
  >`
    SELECT mc.name AS category,
           SUM(oi.quantity * oi."unitPrice")::float8 AS revenue
    FROM "OrderItem" oi
    JOIN "Order" o     ON o.id = oi."orderId"
    JOIN "MenuItem" mi ON mi.id = oi."menuItemId"
    JOIN "MenuCategory" mc ON mc.id = mi."categoryId"
    WHERE o."paidAt" >= ${since}
      AND o.status NOT IN ('cancelled', 'refunded')
    GROUP BY mc.name
    ORDER BY revenue DESC
  `;
  return rows.map((r) => ({
    category: r.category ?? "Uncategorised",
    revenue: Number(r.revenue ?? 0),
  }));
}

// ──────────────────────────────────────────────────────────────
// Stock movement trend (last 7 days)
// ──────────────────────────────────────────────────────────────

export type StockTrendPoint = { day: string; value: number };

/**
 * Total stock movement (units consumed) per day for the last 7 days.
 * Pulls the absolute value of negative `InventoryMovement.delta` so
 * positive restock entries don't dilute the consumption line.
 */
export async function stockTrend7d(): Promise<StockTrendPoint[]> {
  const today = startOf(new Date());
  const start = addDays(today, -6);
  const rows = await prisma.$queryRaw<{ day: Date; consumed: number | null }[]>`
    SELECT date_trunc('day', "createdAt") AS day,
           SUM(ABS(delta))::float8         AS consumed
    FROM "InventoryMovement"
    WHERE "createdAt" >= ${start}
      AND delta < 0
    GROUP BY 1
    ORDER BY 1
  `;
  const byKey = new Map(
    rows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.consumed ?? 0)]),
  );
  const out: StockTrendPoint[] = [];
  for (let d = new Date(start); d <= today; d = addDays(d, 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push({
      day: WEEKDAY[d.getDay()] ?? key,
      value: Math.round(byKey.get(key) ?? 0),
    });
  }
  return out;
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function pctDelta(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 1 : 0;
  return (curr - prev) / prev;
}

function trendOf(curr: number, prev: number): "up" | "down" | "flat" {
  if (curr === prev) return "flat";
  return curr > prev ? "up" : "down";
}
