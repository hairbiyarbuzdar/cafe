import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  Order,
  OrderChannel,
  OrderStatus,
  PaymentMethod,
} from "@/types";

const ANON_STAFF = "Unassigned";

export async function listOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      staff: { select: { name: true } },
      table: { select: { name: true } },
    },
  });

  return rows.map((o) => ({
    id: o.id,
    number: o.number,
    status: o.status as OrderStatus,
    channel: o.channel as OrderChannel,
    customer: o.customerName
      ? {
          name: o.customerName,
          phone: o.customerPhone ?? undefined,
        }
      : undefined,
    table: o.table?.name,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: toNumber(i.unitPrice),
      modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
      note: i.note ?? undefined,
    })),
    subtotal: toNumber(o.subtotal),
    tax: toNumber(o.tax),
    tip: o.tip != null ? toNumber(o.tip) : undefined,
    discount: o.discount != null ? toNumber(o.discount) : undefined,
    total: toNumber(o.total),
    payment: o.payment as PaymentMethod,
    staff: o.staff?.name ?? ANON_STAFF,
    notes: o.notes ?? undefined,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    fiscalInvoiceNumber: o.fiscalInvoiceNumber ?? undefined,
    fiscalSubmittedAt: o.fiscalSubmittedAt
      ? o.fiscalSubmittedAt.toISOString()
      : undefined,
    fiscalLastError: o.fiscalLastError ?? undefined,
  }));
}

export type OrdersSummary = {
  completed: number;
  pending: number;
  revenue: number;
};

export async function ordersSummary(): Promise<OrdersSummary> {
  const [completedCount, pendingCount, revenueAgg] = await Promise.all([
    prisma.order.count({ where: { status: "completed" } }),
    prisma.order.count({ where: { status: { in: ["pending", "preparing"] } } }),
    prisma.order.aggregate({
      where: { status: "completed" },
      _sum: { total: true },
    }),
  ]);
  return {
    completed: completedCount,
    pending: pendingCount,
    revenue: revenueAgg._sum.total ? toNumber(revenueAgg._sum.total) : 0,
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
