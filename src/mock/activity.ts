import type { ActivityEvent } from "@/types";

function minAgo(m: number) {
  return new Date(Date.now() - m * 60_000).toISOString();
}

export const ACTIVITY: ActivityEvent[] = [
  {
    id: "act_1",
    type: "order",
    title: "Order #5821 started",
    description: "2 × Latte (L) + Almond Croissant — Table T-04",
    timestamp: minAgo(3),
    actor: { name: "Maya Chen" },
  },
  {
    id: "act_2",
    type: "stock",
    title: "Low stock alert",
    description: "Pain au chocolat dropped to 7 units (reorder at 18)",
    timestamp: minAgo(11),
  },
  {
    id: "act_3",
    type: "order",
    title: "Order #5820 ready",
    description: "Takeaway pickup for Noah Carter",
    timestamp: minAgo(14),
    actor: { name: "Daniel Reyes" },
  },
  {
    id: "act_4",
    type: "staff",
    title: "Aisha Patel clocked in",
    description: "Started morning shift — 06:32",
    timestamp: minAgo(46),
    actor: { name: "Aisha Patel" },
  },
  {
    id: "act_5",
    type: "system",
    title: "Daily settlement closed",
    description: "Yesterday's payouts of Rs. 221,540 settled to bank",
    timestamp: minAgo(180),
  },
  {
    id: "act_6",
    type: "order",
    title: "Refund issued — #5814",
    description: "Rs. 870 refunded for Vanilla Latte (prep error)",
    timestamp: minAgo(110),
    actor: { name: "Aisha Patel" },
  },
  {
    id: "act_7",
    type: "stock",
    title: "Restock received",
    description: "24 L Whole milk delivered by Valley Dairy Co.",
    timestamp: minAgo(220),
  },
  {
    id: "act_8",
    type: "staff",
    title: "New schedule published",
    description: "Week of Apr 22 — 35 shifts assigned",
    timestamp: minAgo(420),
    actor: { name: "Elena Volkova" },
  },
];
