import "server-only";

import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/types";

export type PaymentChannel = {
  id: string;
  name: string;
  kind: PaymentMethod;
  openingBalance: number;
  currentBalance: number;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
};

export type Transfer = {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  occurredAt: string;
  note: string | null;
};

export type TransferRange = "all" | "today" | "week" | "month" | "custom";

export async function listPaymentChannels({
  includeArchived = false,
}: { includeArchived?: boolean } = {}): Promise<PaymentChannel[]> {
  const rows = await prisma.paymentChannel.findMany({
    where: includeArchived ? undefined : { archived: false },
    orderBy: [{ archived: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    kind: r.kind as PaymentMethod,
    openingBalance: toNumber(r.openingBalance),
    currentBalance: toNumber(r.currentBalance),
    archived: r.archived,
    archivedAt: r.archivedAt ? r.archivedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function listTransfers({
  from,
  to,
}: { from?: Date; to?: Date } = {}): Promise<Transfer[]> {
  const rows = await prisma.paymentTransfer.findMany({
    where: {
      occurredAt: {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      },
    },
    orderBy: { occurredAt: "desc" },
    include: {
      from: { select: { name: true } },
      to: { select: { name: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    fromId: r.fromId,
    fromName: r.from.name,
    toId: r.toId,
    toName: r.to.name,
    amount: toNumber(r.amount),
    occurredAt: r.occurredAt.toISOString(),
    note: r.note,
  }));
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
