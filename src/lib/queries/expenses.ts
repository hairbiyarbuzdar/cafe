import "server-only";

import { prisma } from "@/lib/prisma";

export type ExpenseHead = {
  id: string;
  name: string;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  expenseCount: number;
};

export type ExpenseRow = {
  id: string;
  expenseHeadId: string;
  expenseHeadName: string;
  paymentChannelId: string;
  paymentChannelName: string;
  amount: number;
  detail: string | null;
  occurredAt: string;
  createdAt: string;
};

export type ExpensesSummary = {
  totalRecords: number;
  totalAmount: number;
  activeHeads: number;
};

export async function listExpenseHeads({
  includeArchived = true,
}: { includeArchived?: boolean } = {}): Promise<ExpenseHead[]> {
  const rows = await prisma.expenseHead.findMany({
    where: includeArchived ? undefined : { archived: false },
    orderBy: [{ archived: "asc" }, { name: "asc" }],
    include: { _count: { select: { expenses: true } } },
  });
  return rows.map((h) => ({
    id: h.id,
    name: h.name,
    archived: h.archived,
    archivedAt: h.archivedAt ? h.archivedAt.toISOString() : null,
    createdAt: h.createdAt.toISOString(),
    expenseCount: h._count.expenses,
  }));
}

export async function listExpenses(): Promise<ExpenseRow[]> {
  const rows = await prisma.expense.findMany({
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    include: {
      expenseHead: { select: { name: true } },
      paymentChannel: { select: { name: true } },
    },
  });
  return rows.map((e) => ({
    id: e.id,
    expenseHeadId: e.expenseHeadId,
    expenseHeadName: e.expenseHead.name,
    paymentChannelId: e.paymentChannelId,
    paymentChannelName: e.paymentChannel.name,
    amount: toNumber(e.amount),
    detail: e.detail,
    occurredAt: e.occurredAt.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }));
}

export async function expensesSummary(): Promise<ExpensesSummary> {
  const [agg, activeHeads] = await Promise.all([
    prisma.expense.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expenseHead.count({ where: { archived: false } }),
  ]);
  return {
    totalRecords: agg._count._all,
    totalAmount: toNumber(agg._sum.amount),
    activeHeads,
  };
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}
