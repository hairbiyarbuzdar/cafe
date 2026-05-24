import "server-only";

import { supabase } from "@/lib/supabase";
import type { ChannelSlice, DailyPoint, HourPoint, Kpi, TopProduct } from "@/types";

const PKR = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export type DashboardFilter = { from?: Date; to?: Date; channel?: string };

function normChannel(c?: string) { return c && c !== "all" ? c : null; }
function startOf(d: Date) { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function rangeBounds(f?: DashboardFilter) {
  if (!f?.from || !f?.to) return null;
  return { from: startOf(f.from), to: startOf(addDays(f.to, 1)) };
}
function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}
function pctDelta(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 1 : 0;
  return (curr - prev) / prev;
}
function trendOf(curr: number, prev: number): "up" | "down" | "flat" {
  if (curr === prev) return "flat";
  return curr > prev ? "up" : "down";
}

async function fetchOrders(from: Date, to: Date, channel: string | null) {
  let q = supabase.from("Order").select("total, channel, paidAt")
    .gte("paidAt", from.toISOString()).lt("paidAt", to.toISOString())
    .not("status", "in", '("cancelled","refunded")');
  if (channel) q = q.eq("channel", channel);
  const { data } = await q;
  return data ?? [];
}

type DayStats = { revenue: number; orders: number; guests: number };

async function dayStats(from: Date, to: Date, channel: string | null): Promise<DayStats> {
  const rows = await fetchOrders(from, to, channel);
  const revenue = rows.reduce((s, r) => s + Number(r.total), 0);
  const dineIn = rows.filter((r) => r.channel === "dine-in").length;
  return { revenue, orders: rows.length, guests: dineIn * 2 + (rows.length - dineIn) };
}

async function revenueByDay(from: Date, to: Date, channel: string | null): Promise<DailyPoint[]> {
  const rows = await fetchOrders(from, to, channel);
  const byKey = new Map<string, DailyPoint>();
  for (const r of rows) {
    const key = r.paidAt!.slice(0, 10);
    const existing = byKey.get(key) ?? { date: key, revenue: 0, orders: 0, guests: 0 };
    existing.revenue += Number(r.total);
    existing.orders += 1;
    existing.guests += r.channel === "dine-in" ? 2 : 1;
    byKey.set(key, existing);
  }
  const out: DailyPoint[] = [];
  for (let d = new Date(from); d < to; d = addDays(d, 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push(byKey.get(key) ?? { date: key, revenue: 0, orders: 0, guests: 0 });
  }
  return out;
}

async function rangeKpis(from: Date, to: Date, channel: string | null): Promise<Kpi[]> {
  const lenMs = Math.max(86_400_000, to.getTime() - from.getTime());
  const prevFrom = new Date(from.getTime() - lenMs);
  const [curr, prev, series] = await Promise.all([dayStats(from, to, channel), dayStats(prevFrom, from, channel), revenueByDay(from, to, channel)]);
  const currAov = curr.orders > 0 ? curr.revenue / curr.orders : 0;
  const prevAov = prev.orders > 0 ? prev.revenue / prev.orders : 0;
  return [
    { id: "revenue", label: "Revenue", value: curr.revenue, formatted: PKR(curr.revenue), delta: pctDelta(curr.revenue, prev.revenue), trend: trendOf(curr.revenue, prev.revenue), sparkline: series.map((d) => Math.max(0, Math.round(d.revenue))), helperText: `vs ${PKR(prev.revenue)} prior period` },
    { id: "orders", label: "Orders", value: curr.orders, formatted: `${curr.orders}`, delta: pctDelta(curr.orders, prev.orders), trend: trendOf(curr.orders, prev.orders), sparkline: series.map((d) => d.orders), helperText: `vs ${prev.orders} prior period` },
    { id: "avg", label: "Avg order value", value: Math.round(currAov), formatted: PKR(currAov), delta: pctDelta(currAov, prevAov), trend: trendOf(currAov, prevAov), sparkline: series.map((d) => d.orders > 0 ? Math.round(d.revenue / d.orders) : 0), helperText: `vs ${PKR(prevAov)} prior period` },
    { id: "guests", label: "Guests served", value: curr.guests, formatted: `${curr.guests}`, delta: pctDelta(curr.guests, prev.guests), trend: trendOf(curr.guests, prev.guests), sparkline: series.map((d) => d.guests), helperText: "Approximated from channel mix" },
  ];
}

export async function todaysKpis(filter?: DashboardFilter): Promise<Kpi[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  if (range) return rangeKpis(range.from, range.to, channel);

  const today = startOf(new Date());
  const [todayStats, yesterdayStats, last14, lastWeek] = await Promise.all([
    dayStats(today, addDays(today, 1), channel),
    dayStats(addDays(today, -1), today, channel),
    revenueByDay(addDays(today, -13), addDays(today, 1), channel),
    dayStats(addDays(today, -7), today, channel),
  ]);
  const todayAov = todayStats.orders > 0 ? todayStats.revenue / todayStats.orders : 0;
  const weekAov = lastWeek.orders > 0 ? lastWeek.revenue / lastWeek.orders : 0;
  return [
    { id: "revenue", label: "Revenue today", value: todayStats.revenue, formatted: PKR(todayStats.revenue), delta: pctDelta(todayStats.revenue, yesterdayStats.revenue), trend: trendOf(todayStats.revenue, yesterdayStats.revenue), sparkline: last14.map((d) => Math.max(0, Math.round(d.revenue))), helperText: `vs ${PKR(yesterdayStats.revenue)} yesterday` },
    { id: "orders", label: "Orders", value: todayStats.orders, formatted: `${todayStats.orders}`, delta: pctDelta(todayStats.orders, yesterdayStats.orders), trend: trendOf(todayStats.orders, yesterdayStats.orders), sparkline: last14.map((d) => d.orders), helperText: `vs ${yesterdayStats.orders} yesterday` },
    { id: "avg", label: "Avg order value", value: Math.round(todayAov), formatted: PKR(todayAov), delta: pctDelta(todayAov, weekAov), trend: trendOf(todayAov, weekAov), sparkline: last14.map((d) => d.orders > 0 ? Math.round(d.revenue / d.orders) : 0), helperText: `vs ${PKR(weekAov)} last week` },
    { id: "guests", label: "Guests served", value: todayStats.guests, formatted: `${todayStats.guests}`, delta: pctDelta(todayStats.guests, yesterdayStats.guests), trend: trendOf(todayStats.guests, yesterdayStats.guests), sparkline: last14.map((d) => d.guests), helperText: todayStats.guests >= yesterdayStats.guests ? "Approximated from channel mix" : "Lower foot traffic today" },
  ];
}

export async function revenue14d(filter?: DashboardFilter): Promise<DailyPoint[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  if (range) {
    const series = await revenueByDay(range.from, range.to, channel);
    return series.map((d) => ({ ...d, date: shortDate(d.date) }));
  }
  const today = startOf(new Date());
  const series = await revenueByDay(addDays(today, -13), addDays(today, 1), channel);
  return series.map((d) => ({ ...d, date: WEEKDAY[new Date(d.date + "T00:00:00").getDay()] ?? d.date }));
}

export async function hourlyOrdersToday(filter?: DashboardFilter): Promise<HourPoint[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const from = range ? range.from : startOf(new Date());
  const to = range ? range.to : addDays(startOf(new Date()), 1);
  const rows = await fetchOrders(from, to, channel);
  const byHour = new Map<number, number>();
  for (const r of rows) {
    const h = new Date(r.paidAt!).getHours();
    byHour.set(h, (byHour.get(h) ?? 0) + 1);
  }
  const out: HourPoint[] = [];
  for (let h = 7; h <= 20; h++) {
    const label = h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`;
    out.push({ hour: label, orders: byHour.get(h) ?? 0 });
  }
  return out;
}

const CHANNEL_FILLS: Record<string, string> = { "dine-in": "var(--chart-1)", takeaway: "var(--chart-2)", delivery: "var(--chart-3)", online: "var(--chart-4)" };
const CHANNEL_LABELS: Record<string, string> = { "dine-in": "Dine-in", takeaway: "Takeaway", delivery: "Delivery", online: "Online" };

export async function channelMix(filter?: DashboardFilter): Promise<ChannelSlice[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const from = range ? range.from : addDays(startOf(new Date()), -13);
  const to = range ? range.to : addDays(startOf(new Date()), 1);
  const rows = await fetchOrders(from, to, channel);
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.channel, (counts.get(r.channel) ?? 0) + 1);
  return (["dine-in", "takeaway", "delivery", "online"] as const).map((c) => ({
    channel: CHANNEL_LABELS[c] ?? c, value: counts.get(c) ?? 0, fill: CHANNEL_FILLS[c] ?? "var(--chart-5)",
  }));
}

export type CategoryShare = { category: string; revenue: number };

export async function topProducts(limit = 7, filter?: DashboardFilter): Promise<TopProduct[]> {
  const channel = normChannel(filter?.channel);
  const range = rangeBounds(filter);
  const today = startOf(new Date());
  const start = range ? range.from : addDays(today, -6);
  const end = range ? range.to : addDays(today, 1);
  const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()));

  let oq = supabase.from("Order").select("id, channel").gte("paidAt", start.toISOString()).lt("paidAt", end.toISOString()).not("status", "in", '("cancelled","refunded")');
  if (channel) oq = oq.eq("channel", channel);
  let pq = supabase.from("Order").select("id").gte("paidAt", prevStart.toISOString()).lt("paidAt", start.toISOString()).not("status", "in", '("cancelled","refunded")');

  const [{ data: currentOrders }, { data: prevOrders }, { data: orderItems }, { data: menuItems }, { data: categories }] = await Promise.all([
    oq, pq,
    supabase.from("OrderItem").select("orderId, menuItemId, name, quantity, unitPrice"),
    supabase.from("MenuItem").select("id, categoryId"),
    supabase.from("MenuCategory").select("id, name"),
  ]);

  const currentIds = new Set((currentOrders ?? []).map((o) => o.id));
  const prevIds = new Set((prevOrders ?? []).map((o) => o.id));
  const catById = new Map((categories ?? []).map((c) => [c.id, c.name]));
  const menuCatById = new Map((menuItems ?? []).map((m) => [m.id, m.categoryId]));

  type ItemAgg = { name: string; category: string; units: number; revenue: number };
  const currAgg = new Map<string, ItemAgg>();
  const prevAgg = new Map<string, number>();

  for (const item of orderItems ?? []) {
    const rev = Number(item.quantity) * Number(item.unitPrice);
    const catId = menuCatById.get(item.menuItemId ?? "") ?? "";
    const catName = catById.get(catId) ?? "—";
    if (currentIds.has(item.orderId)) {
      const existing = currAgg.get(item.menuItemId ?? item.name) ?? { name: item.name, category: catName, units: 0, revenue: 0 };
      existing.units += Number(item.quantity); existing.revenue += rev;
      currAgg.set(item.menuItemId ?? item.name, existing);
    }
    if (prevIds.has(item.orderId)) prevAgg.set(item.menuItemId ?? item.name, (prevAgg.get(item.menuItemId ?? item.name) ?? 0) + rev);
  }

  return [...currAgg.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, limit)
    .map(([key, v], idx) => ({
      rank: idx + 1, name: v.name, category: v.category, units: v.units, revenue: v.revenue,
      delta: pctDelta(v.revenue, prevAgg.get(key) ?? 0),
    }));
}

export async function categoryRevenue(): Promise<CategoryShare[]> {
  const since = addDays(startOf(new Date()), -13);
  const [{ data: orders }, { data: orderItems }, { data: menuItems }, { data: cats }] = await Promise.all([
    supabase.from("Order").select("id").gte("paidAt", since.toISOString()).not("status", "in", '("cancelled","refunded")'),
    supabase.from("OrderItem").select("orderId, menuItemId, quantity, unitPrice"),
    supabase.from("MenuItem").select("id, categoryId"),
    supabase.from("MenuCategory").select("id, name"),
  ]);
  const orderIds = new Set((orders ?? []).map((o) => o.id));
  const catById = new Map((cats ?? []).map((c) => [c.id, c.name]));
  const menuCatById = new Map((menuItems ?? []).map((m) => [m.id, m.categoryId]));
  const byCategory = new Map<string, number>();
  for (const item of orderItems ?? []) {
    if (!orderIds.has(item.orderId)) continue;
    const catId = menuCatById.get(item.menuItemId ?? "") ?? "";
    const catName = catById.get(catId) ?? "Uncategorised";
    byCategory.set(catName, (byCategory.get(catName) ?? 0) + Number(item.quantity) * Number(item.unitPrice));
  }
  return [...byCategory.entries()].sort((a, b) => b[1] - a[1]).map(([category, revenue]) => ({ category, revenue }));
}

export type StockTrendPoint = { day: string; value: number };

export async function stockTrend7d(): Promise<StockTrendPoint[]> {
  const today = startOf(new Date());
  const start = addDays(today, -6);
  const { data } = await supabase.from("InventoryMovement").select("createdAt, delta").gte("createdAt", start.toISOString()).lt("delta", 0);
  const byKey = new Map<string, number>();
  for (const r of data ?? []) {
    const key = r.createdAt.slice(0, 10);
    byKey.set(key, (byKey.get(key) ?? 0) + Math.abs(Number(r.delta)));
  }
  const out: StockTrendPoint[] = [];
  for (let d = new Date(start); d <= today; d = addDays(d, 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push({ day: WEEKDAY[d.getDay()] ?? key, value: Math.round(byKey.get(key) ?? 0) });
  }
  return out;
}
