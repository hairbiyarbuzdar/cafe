import "server-only";

import { supabase } from "@/lib/supabase";
import type { DataRow } from "@/lib/data-transfer/types";

export type ReportRange = { from?: Date; to?: Date };

function startOfDay(date: Date): Date { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; }
function addDays(date: Date, days: number): Date { const d = new Date(date); d.setDate(d.getDate() + days); return d; }

export function rangeBounds(range?: ReportRange): { from: Date; to: Date } | null {
  if (!range?.from || !range?.to) return null;
  return { from: startOfDay(range.from), to: startOfDay(addDays(range.to, 1)) };
}

export interface ReportsSummary {
  ordersCount: number; revenue: number; expensesTotal: number; inventoryValue: number;
  supplierCount: number; supplierPurchases: number; salariesPaid: number; netProfit: number;
  range: { from: string; to: string } | null;
}

export async function reportsSummary(range?: ReportRange): Promise<ReportsSummary> {
  const b = rangeBounds(range);

  let ordersQ = supabase.from("Order").select("total").not("status", "in", '("cancelled","refunded")');
  if (b) ordersQ = ordersQ.gte("createdAt", b.from.toISOString()).lt("createdAt", b.to.toISOString());

  let expQ = supabase.from("Expense").select("amount");
  if (b) expQ = expQ.gte("occurredAt", b.from.toISOString()).lt("occurredAt", b.to.toISOString());

  let purchQ = supabase.from("InventoryMovement").select("amount").gt("delta", 0).not("amount", "is", null);
  if (b) purchQ = purchQ.gte("createdAt", b.from.toISOString()).lt("createdAt", b.to.toISOString());

  let salQ = supabase.from("SalaryPayment").select("netPaid");
  if (b) salQ = salQ.gte("paymentDate", b.from.toISOString()).lt("paymentDate", b.to.toISOString());

  const [{ data: orders }, { data: expenses }, { count: supplierCount }, { data: purchases }, { data: salaries }, { data: inventory }] = await Promise.all([
    ordersQ,
    expQ,
    supabase.from("Supplier").select("*", { count: "exact", head: true }),
    purchQ,
    salQ,
    supabase.from("InventoryItem").select("stock, costPerUnit"),
  ]);

  const revenue = (orders ?? []).reduce((s, r) => s + Number(r.total), 0);
  const expensesTotal = (expenses ?? []).reduce((s, r) => s + Number(r.amount), 0);
  const supplierPurchases = (purchases ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const salariesPaid = (salaries ?? []).reduce((s, r) => s + Number(r.netPaid), 0);
  const inventoryValue = (inventory ?? []).reduce((s, r) => s + Number(r.stock) * Number(r.costPerUnit), 0);

  return {
    ordersCount: (orders ?? []).length, revenue, expensesTotal, inventoryValue,
    supplierCount: supplierCount ?? 0, supplierPurchases, salariesPaid,
    netProfit: revenue - expensesTotal - salariesPaid,
    range: b ? { from: b.from.toISOString(), to: b.to.toISOString() } : null,
  };
}

export const REPORT_DATE_FIELD: Record<string, string> = {
  orders: "createdAt", suppliers: "createdAt", inventory: "createdAt", staff: "createdAt", expenses: "occurredAt",
};

export function filterRowsByDate(rows: DataRow[], field: string, range?: ReportRange): DataRow[] {
  if (!range?.from || !range?.to) return rows;
  const from = startOfDay(range.from).getTime();
  const to = startOfDay(addDays(range.to, 1)).getTime();
  return rows.filter((r) => {
    const v = r[field]; if (v == null) return false;
    const t = new Date(v as string).getTime();
    return !Number.isNaN(t) && t >= from && t < to;
  });
}
