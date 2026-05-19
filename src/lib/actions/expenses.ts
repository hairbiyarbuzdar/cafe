"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ──────────────────────────────────────────────────────────────
// Expense heads
// ──────────────────────────────────────────────────────────────

export type ExpenseHeadResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string };

export async function createExpenseHeadAction(
  name: string,
): Promise<ExpenseHeadResult> {
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, error: "Name is required" };
  if (trimmed.length > 60) return { ok: false, error: "Name is too long" };

  const existing = await prisma.expenseHead.findUnique({
    where: { name: trimmed },
    select: { id: true },
  });
  if (existing) return { ok: false, error: "An expense head with that name already exists" };

  try {
    const row = await prisma.expenseHead.create({
      data: { name: trimmed },
      select: { id: true, name: true },
    });
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create head",
    };
  }
}

export async function renameExpenseHeadAction(
  id: string,
  name: string,
): Promise<ExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, error: "Name is required" };
  if (trimmed.length > 60) return { ok: false, error: "Name is too long" };

  // Uniqueness violation surfaces as P2002 — pre-check for a friendlier
  // message, but the unique constraint is still the source of truth.
  const collision = await prisma.expenseHead.findFirst({
    where: { name: trimmed, NOT: { id } },
    select: { id: true },
  });
  if (collision) return { ok: false, error: "Another head already uses that name" };

  try {
    const row = await prisma.expenseHead.update({
      where: { id },
      data: { name: trimmed },
      select: { id: true, name: true },
    });
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to rename head",
    };
  }
}

export async function setExpenseHeadArchivedAction(
  id: string,
  archived: boolean,
): Promise<ExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  try {
    const row = await prisma.expenseHead.update({
      where: { id },
      data: { archived, archivedAt: archived ? new Date() : null },
      select: { id: true, name: true },
    });
    revalidatePath("/expenses");
    return { ok: true, id: row.id, name: row.name };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update head",
    };
  }
}

export type DeleteExpenseHeadResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteExpenseHeadAction(
  id: string,
): Promise<DeleteExpenseHeadResult> {
  if (!id) return { ok: false, error: "Missing head" };
  const used = await prisma.expense.count({ where: { expenseHeadId: id } });
  if (used > 0) {
    return {
      ok: false,
      error: `Used by ${used} expense${used === 1 ? "" : "s"} — archive it instead so history stays legible.`,
    };
  }
  try {
    await prisma.expenseHead.delete({ where: { id } });
    revalidatePath("/expenses");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete head",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Expenses
// ──────────────────────────────────────────────────────────────

export type RecordExpenseInput = {
  expenseHeadId: string;
  paymentChannelId: string;
  amount: number;
  detail?: string;
  /** YYYY-MM-DD or full ISO. The action normalises to a Date. */
  occurredAt: string;
};

export type RecordExpenseResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Record an outgoing expense against a payment channel.
 *
 * Invariants enforced server-side:
 *   • amount > 0
 *   • amount ≤ channel.currentBalance (no negative balances)
 *   • head must be non-archived
 *
 * The channel debit + expense row creation share a transaction so a
 * crash mid-flight can't leave the books inconsistent.
 */
export async function recordExpenseAction(
  input: RecordExpenseInput,
): Promise<RecordExpenseResult> {
  if (!input.expenseHeadId) return { ok: false, error: "Pick an expense head" };
  if (!input.paymentChannelId) {
    return { ok: false, error: "Pick a payment source" };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }

  const amount = round2(input.amount);
  const detail = input.detail?.trim() || null;
  const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();
  if (Number.isNaN(occurredAt.getTime())) {
    return { ok: false, error: "Invalid expense date" };
  }

  const [head, channel] = await Promise.all([
    prisma.expenseHead.findUnique({
      where: { id: input.expenseHeadId },
      select: { id: true, name: true, archived: true },
    }),
    prisma.paymentChannel.findUnique({
      where: { id: input.paymentChannelId },
      select: { id: true, name: true, archived: true, currentBalance: true },
    }),
  ]);
  if (!head) return { ok: false, error: "Expense head not found" };
  if (head.archived) {
    return { ok: false, error: "That expense head is archived" };
  }
  if (!channel || channel.archived) {
    return { ok: false, error: "Payment source isn't active" };
  }
  const balance = toNumber(channel.currentBalance);
  if (amount > balance) {
    return {
      ok: false,
      error: `${channel.name} only has ${balance.toLocaleString()} available`,
    };
  }

  try {
    const row = await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          expenseHeadId: head.id,
          paymentChannelId: channel.id,
          amount,
          detail,
          occurredAt,
        },
        select: { id: true },
      });
      await tx.paymentChannel.update({
        where: { id: channel.id },
        data: { currentBalance: { decrement: amount } },
      });
      return expense;
    });

    revalidatePath("/expenses");
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    await logActivity({
      type: "stock",
      title: `Expense — ${head.name}`,
      description: `${amount.toLocaleString()} via ${channel.name}${
        detail ? ` · ${detail}` : ""
      }`,
    });

    return { ok: true, id: row.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record expense",
    };
  }
}

export type DeleteExpenseResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Refund-and-delete an expense. The channel is credited back the
 * amount so balances stay consistent. Useful for fixing typos
 * shortly after recording; the activity log preserves the original
 * entry so an audit trail still exists.
 */
export async function deleteExpenseAction(
  id: string,
): Promise<DeleteExpenseResult> {
  if (!id) return { ok: false, error: "Missing expense" };
  const expense = await prisma.expense.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      paymentChannelId: true,
      expenseHead: { select: { name: true } },
      paymentChannel: { select: { name: true } },
    },
  });
  if (!expense) return { ok: false, error: "Expense not found" };
  const amount = toNumber(expense.amount);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.expense.delete({ where: { id } });
      await tx.paymentChannel.update({
        where: { id: expense.paymentChannelId },
        data: { currentBalance: { increment: amount } },
      });
    });
    revalidatePath("/expenses");
    revalidatePath("/settings");
    await logActivity({
      type: "stock",
      title: `Expense reversed — ${expense.expenseHead.name}`,
      description: `${amount.toLocaleString()} returned to ${expense.paymentChannel.name}`,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete expense",
    };
  }
}
