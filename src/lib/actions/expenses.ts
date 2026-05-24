"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

function round2(n: number): number { return Math.round(n * 100) / 100; }

export type ExpenseHeadResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string };

export async function createExpenseHeadAction(name: string): Promise<ExpenseHeadResult> {
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, error: "Name is required" };
  if (trimmed.length > 60) return { ok: false, error: "Name is too long" };

  const { data: existing } = await supabase
    .from("ExpenseHead")
    .select("id")
    .eq("name", trimmed)
    .maybeSingle();
  if (existing) return { ok: false, error: "An expense head with that name already exists" };

  try {
    const { data: row, error } = await supabase
      .from("ExpenseHead")
      .insert({ name: trimmed })
      .select("id, name")
      .single();
    if (error) throw error;
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create head" };
  }
}

export async function renameExpenseHeadAction(id: string, name: string): Promise<ExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, error: "Name is required" };
  if (trimmed.length > 60) return { ok: false, error: "Name is too long" };

  const { data: collision } = await supabase
    .from("ExpenseHead")
    .select("id")
    .eq("name", trimmed)
    .neq("id", id)
    .maybeSingle();
  if (collision) return { ok: false, error: "Another head already uses that name" };

  try {
    const { data: row, error } = await supabase
      .from("ExpenseHead")
      .update({ name: trimmed })
      .eq("id", id)
      .select("id, name")
      .single();
    if (error) throw error;
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to rename head" };
  }
}

export async function setExpenseHeadArchivedAction(
  id: string,
  archived: boolean,
): Promise<ExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  try {
    const { data: row, error } = await supabase
      .from("ExpenseHead")
      .update({ archived, archivedAt: archived ? new Date().toISOString() : null })
      .eq("id", id)
      .select("id, name")
      .single();
    if (error) throw error;
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update head" };
  }
}

export type DeleteExpenseHeadResult = { ok: true } | { ok: false; error: string };

export async function deleteExpenseHeadAction(id: string): Promise<DeleteExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  const { count } = await supabase
    .from("Expense")
    .select("*", { count: "exact", head: true })
    .eq("expenseHeadId", id);
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Used by ${count} expense${count === 1 ? "" : "s"} — archive it instead so history stays legible.`,
    };
  }
  try {
    const { error } = await supabase.from("ExpenseHead").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/expenses");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete head" };
  }
}

export type RecordExpenseInput = {
  expenseHeadId: string;
  paymentChannelId: string;
  amount: number;
  detail?: string;
  occurredAt: string;
};

export type RecordExpenseResult = { ok: true; id: string } | { ok: false; error: string };

export async function recordExpenseAction(
  input: RecordExpenseInput,
): Promise<RecordExpenseResult> {
  if (!input.expenseHeadId) return { ok: false, error: "Pick an expense head" };
  if (!input.paymentChannelId) return { ok: false, error: "Pick a payment source" };
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }

  const amount = round2(input.amount);
  const detail = input.detail?.trim() || null;
  const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();
  if (Number.isNaN(occurredAt.getTime())) return { ok: false, error: "Invalid expense date" };

  const [{ data: head }, { data: channel }] = await Promise.all([
    supabase.from("ExpenseHead").select("id, name, archived").eq("id", input.expenseHeadId).maybeSingle(),
    supabase.from("PaymentChannel").select("id, name, archived, currentBalance").eq("id", input.paymentChannelId).maybeSingle(),
  ]);
  if (!head) return { ok: false, error: "Expense head not found" };
  if (head.archived) return { ok: false, error: "That expense head is archived" };
  if (!channel || channel.archived) return { ok: false, error: "Payment source isn't active" };
  const balance = Number(channel.currentBalance);
  if (amount > balance) {
    return { ok: false, error: `${channel.name} only has ${balance.toLocaleString()} available` };
  }

  try {
    const { data: expense, error } = await supabase
      .from("Expense")
      .insert({ expenseHeadId: head.id, paymentChannelId: channel.id, amount, detail, occurredAt: occurredAt.toISOString() })
      .select("id")
      .single();
    if (error) throw error;

    await supabase.from("PaymentChannel").update({ currentBalance: balance - amount }).eq("id", channel.id);

    revalidatePath("/expenses");
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    await logActivity({
      type: "stock",
      title: `Expense — ${head.name}`,
      description: `${amount.toLocaleString()} via ${channel.name}${detail ? ` · ${detail}` : ""}`,
    });

    return { ok: true, id: expense.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to record expense" };
  }
}

export type DeleteExpenseResult = { ok: true } | { ok: false; error: string };

export async function deleteExpenseAction(id: string): Promise<DeleteExpenseResult> {
  if (!id) return { ok: false, error: "Missing expense" };
  const { data: expense } = await supabase
    .from("Expense")
    .select("id, amount, paymentChannelId, ExpenseHead(name), PaymentChannel(name)")
    .eq("id", id)
    .maybeSingle();
  if (!expense) return { ok: false, error: "Expense not found" };

  const headName = ((Array.isArray(expense.ExpenseHead) ? expense.ExpenseHead[0] : expense.ExpenseHead) as { name: string } | null)?.name ?? "";
  const channelName = ((Array.isArray(expense.PaymentChannel) ? expense.PaymentChannel[0] : expense.PaymentChannel) as { name: string } | null)?.name ?? "";
  const amount = Number(expense.amount);

  try {
    await supabase.from("Expense").delete().eq("id", id);
    if (expense.paymentChannelId) {
      const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", expense.paymentChannelId).single();
      await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) + amount }).eq("id", expense.paymentChannelId);
    }
    revalidatePath("/expenses");
    revalidatePath("/settings");
    await logActivity({
      type: "stock",
      title: `Expense reversed — ${headName}`,
      description: `${amount.toLocaleString()} returned to ${channelName}`,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete expense" };
  }
}
