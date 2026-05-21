import "server-only";

import { prisma } from "@/lib/prisma";
import type { DataRow } from "@/lib/data-transfer/types";

export type ReportRange = { from?: Date; to?: Date };

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Half-open [from, to) bounds for an inclusive day range, or null. */
export function rangeBounds(
  range?: ReportRange,
): { from: Date; to: Date } | null {
  if (!range?.from || !range?.to) return null;
  return { from: startOfDay(range.from), to: startOfDay(addDays(range.to, 1)) };
}

const n = (v: unknown): number => Number(v ?? 0);

export interface ReportsSummary {
  ordersCount: number;
  revenue: number;
  expensesTotal: number;
  inventoryValue: number;
  supplierCount: number;
  supplierPurchases: number;
  salariesPaid: number;
  netProfit: number;
  range: { from: string; to: string } | null;
}

/**
 * Executive cross-module aggregation. With a range, every figure is
 * scoped to it (except inventory value, which is a point-in-time
 * snapshot). Net profit = revenue − expenses − salaries.
 */
export async function reportsSummary(
  range?: ReportRange,
): Promise<ReportsSummary> {
  const b = rangeBounds(range);
  const inRange = (field: string) =>
    b ? { [field]: { gte: b.from, lt: b.to } } : {};

  const [orders, expenses, supplierCount, purchases, salaries, invValue] =
    await Promise.all([
      prisma.order.aggregate({
        _count: true,
        _sum: { total: true },
        where: { status: { notIn: ["cancelled", "refunded"] }, ...inRange("createdAt") },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { ...inRange("occurredAt") },
      }),
      prisma.supplier.count(),
      prisma.inventoryMovement.aggregate({
        _sum: { amount: true },
        where: { delta: { gt: 0 }, ...inRange("createdAt") },
      }),
      prisma.salaryPayment.aggregate({
        _sum: { netPaid: true },
        where: { ...inRange("paymentDate") },
      }),
      prisma.$queryRaw<{ value: number | null }[]>`
        SELECT COALESCE(SUM(stock * "costPerUnit")::float8, 0) AS value
        FROM "InventoryItem"
      `,
    ]);

  const revenue = n(orders._sum.total);
  const expensesTotal = n(expenses._sum.amount);
  const salariesPaid = n(salaries._sum.netPaid);

  return {
    ordersCount: orders._count,
    revenue,
    expensesTotal,
    inventoryValue: n(invValue[0]?.value),
    supplierCount,
    supplierPurchases: n(purchases._sum.amount),
    salariesPaid,
    netProfit: revenue - expensesTotal - salariesPaid,
    range: b
      ? { from: b.from.toISOString(), to: b.to.toISOString() }
      : null,
  };
}

/** The date column each report filters/sorts on. */
export const REPORT_DATE_FIELD: Record<string, string> = {
  orders: "createdAt",
  suppliers: "createdAt",
  inventory: "createdAt",
  staff: "createdAt",
  expenses: "occurredAt",
};

/** Filter exported-shape rows to an inclusive [from, to] day range. */
export function filterRowsByDate(
  rows: DataRow[],
  field: string,
  range?: ReportRange,
): DataRow[] {
  if (!range?.from || !range?.to) return rows;
  const from = startOfDay(range.from).getTime();
  const to = startOfDay(addDays(range.to, 1)).getTime();
  return rows.filter((r) => {
    const v = r[field];
    if (v == null) return false;
    const t = new Date(v as string).getTime();
    return !Number.isNaN(t) && t >= from && t < to;
  });
}
