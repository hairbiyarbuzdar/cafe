import type { Kpi } from "@/types";

function spark(seed: number, len = 14): number[] {
  return Array.from({ length: len }, (_, i) =>
    Math.round(60 + Math.sin(seed + i / 1.6) * 18 + (i * (seed % 5)) / 3),
  );
}

export const TODAY_KPIS: Kpi[] = [
  {
    id: "revenue",
    label: "Revenue today",
    value: 8742.5,
    formatted: "$8,742",
    delta: 0.124,
    trend: "up",
    sparkline: spark(1),
    helperText: "vs $7,776 yesterday",
  },
  {
    id: "orders",
    label: "Orders",
    value: 312,
    formatted: "312",
    delta: 0.064,
    trend: "up",
    sparkline: spark(2),
    helperText: "vs 293 yesterday",
  },
  {
    id: "avg",
    label: "Avg order value",
    value: 28.02,
    formatted: "$28.02",
    delta: 0.018,
    trend: "up",
    sparkline: spark(3),
    helperText: "vs $27.51 last week",
  },
  {
    id: "guests",
    label: "Guests served",
    value: 421,
    formatted: "421",
    delta: -0.021,
    trend: "down",
    sparkline: spark(4),
    helperText: "Lower foot traffic today",
  },
];

export type DailyPoint = {
  date: string;
  revenue: number;
  orders: number;
  guests: number;
};

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const REVENUE_14D: DailyPoint[] = DAYS.map((d, i) => {
  const base = 5800 + Math.round(Math.sin(i / 1.4) * 1400 + i * 75);
  return {
    date: d,
    revenue: base,
    orders: Math.round(base / 27),
    guests: Math.round((base / 27) * 1.4),
  };
});

export type HourPoint = { hour: string; orders: number };

export const HOURLY_ORDERS: HourPoint[] = [
  { hour: "7a", orders: 18 },
  { hour: "8a", orders: 42 },
  { hour: "9a", orders: 55 },
  { hour: "10a", orders: 31 },
  { hour: "11a", orders: 24 },
  { hour: "12p", orders: 47 },
  { hour: "1p", orders: 39 },
  { hour: "2p", orders: 22 },
  { hour: "3p", orders: 18 },
  { hour: "4p", orders: 14 },
  { hour: "5p", orders: 11 },
  { hour: "6p", orders: 9 },
  { hour: "7p", orders: 6 },
  { hour: "8p", orders: 4 },
];

export type ChannelSlice = { channel: string; value: number; fill: string };

export const CHANNEL_MIX: ChannelSlice[] = [
  { channel: "Dine-in", value: 156, fill: "var(--chart-1)" },
  { channel: "Takeaway", value: 102, fill: "var(--chart-2)" },
  { channel: "Delivery", value: 38, fill: "var(--chart-3)" },
  { channel: "Online", value: 16, fill: "var(--chart-4)" },
];

export type TopProduct = {
  rank: number;
  name: string;
  category: string;
  units: number;
  revenue: number;
  delta: number;
};

export const TOP_PRODUCTS: TopProduct[] = [
  { rank: 1, name: "Caramel Macchiato", category: "Specialty", units: 184, revenue: 1058, delta: 0.18 },
  { rank: 2, name: "Latte", category: "Espresso", units: 162, revenue: 769.5, delta: 0.09 },
  { rank: 3, name: "Cold Brew", category: "Brewed", units: 144, revenue: 684, delta: 0.22 },
  { rank: 4, name: "Almond Croissant", category: "Pastries", units: 128, revenue: 544, delta: 0.04 },
  { rank: 5, name: "Avocado Toast", category: "Light Bites", units: 96, revenue: 912, delta: -0.03 },
  { rank: 6, name: "Cappuccino", category: "Espresso", units: 88, revenue: 396, delta: 0.06 },
  { rank: 7, name: "Cinnamon Roll", category: "Pastries", units: 74, revenue: 333, delta: 0.11 },
];

export type CategoryShare = { category: string; revenue: number };

export const CATEGORY_REVENUE: CategoryShare[] = [
  { category: "Espresso", revenue: 4280 },
  { category: "Specialty", revenue: 3620 },
  { category: "Brewed", revenue: 2150 },
  { category: "Pastries", revenue: 1480 },
  { category: "Light Bites", revenue: 1820 },
  { category: "Cold Drinks", revenue: 1180 },
  { category: "Tea", revenue: 720 },
  { category: "Desserts", revenue: 540 },
];
