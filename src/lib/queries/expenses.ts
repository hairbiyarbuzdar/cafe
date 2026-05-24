import "server-only";

import { supabase } from "@/lib/supabase";

export type ExpenseHead = { id: string; name: string; archived: boolean; archivedAt: string | null; createdAt: string; expenseCount: number };
export type ExpenseRow = { id: string; expenseHeadId: string; expenseHeadName: string; paymentChannelId: string; paymentChannelName: string; amount: number; detail: string | null; occurredAt: string; createdAt: string };
export type ExpensesSummary = { totalRecords: number; totalAmount: number; activeHeads: number };

export async function listExpenseHeads({ includeArchived = true } = {}): Promise<ExpenseHead[]> {
  const [{ data: heads, error }, { data: expenses }] = await Promise.all([
    supabase.from("ExpenseHead").select("*").order("archived").order("name"),
    supabase.from("Expense").select("expenseHeadId"),
  ]);
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const e of expenses ?? []) counts[e.expenseHeadId] = (counts[e.expenseHeadId] ?? 0) + 1;

  return (heads ?? [])
    .filter((h) => includeArchived || !h.archived)
    .map((h) => ({
      id: h.id, name: h.name, archived: h.archived,
      archivedAt: h.archivedAt ?? null, createdAt: h.createdAt,
      expenseCount: counts[h.id] ?? 0,
    }));
}

export async function listExpenses(): Promise<ExpenseRow[]> {
  const { data, error } = await supabase
    .from("Expense")
    .select("*, ExpenseHead(name), PaymentChannel(name)")
    .order("occurredAt", { ascending: false })
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((e) => {
    const head = (Array.isArray(e.ExpenseHead) ? e.ExpenseHead[0] : e.ExpenseHead) as { name: string } | null;
    const channel = (Array.isArray(e.PaymentChannel) ? e.PaymentChannel[0] : e.PaymentChannel) as { name: string } | null;
    return {
      id: e.id, expenseHeadId: e.expenseHeadId, expenseHeadName: head?.name ?? "",
      paymentChannelId: e.paymentChannelId, paymentChannelName: channel?.name ?? "",
      amount: Number(e.amount), detail: e.detail,
      occurredAt: e.occurredAt, createdAt: e.createdAt,
    };
  });
}

export async function expensesSummary(): Promise<ExpensesSummary> {
  const [{ data: expenses }, { count: activeHeads }] = await Promise.all([
    supabase.from("Expense").select("amount"),
    supabase.from("ExpenseHead").select("*", { count: "exact", head: true }).eq("archived", false),
  ]);
  const totalAmount = (expenses ?? []).reduce((s, e) => s + Number(e.amount), 0);
  return { totalRecords: (expenses ?? []).length, totalAmount, activeHeads: activeHeads ?? 0 };
}
