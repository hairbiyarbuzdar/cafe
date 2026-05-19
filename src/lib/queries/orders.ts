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
    payment: o.payment ? (o.payment as PaymentMethod) : undefined,
    paidAt: o.paidAt ? o.paidAt.toISOString() : undefined,
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

/**
 * Just the orders currently on hold (unpaid, not cancelled/refunded/completed).
 * Used by the POS "Add to held order" picker — kept slim and ordered
 * newest-first so cashiers grab the right one fast.
 */
export type HeldOrderLine = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: string[];
  note?: string;
};

export type HeldOrderSummary = {
  id: string;
  number: string;
  channel: OrderChannel;
  table?: string;
  customerName?: string;
  total: number;
  itemCount: number;
  createdAt: string;
  /** Line items belonging to the order. Pre-loaded so the POS held
   * orders picker can expand a row inline without a follow-up fetch. */
  items: HeldOrderLine[];
};

export async function listHeldOrders(): Promise<HeldOrderSummary[]> {
  const rows = await prisma.order.findMany({
    where: {
      paidAt: null,
      status: { notIn: ["cancelled", "refunded", "completed"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      channel: true,
      customerName: true,
      total: true,
      createdAt: true,
      table: { select: { name: true } },
      _count: { select: { items: true } },
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          unitPrice: true,
          modifiers: true,
          note: true,
        },
      },
    },
  });
  return rows.map((o) => ({
    id: o.id,
    number: o.number,
    channel: o.channel as OrderChannel,
    table: o.table?.name,
    customerName: o.customerName ?? undefined,
    total: toNumber(o.total),
    itemCount: o._count.items,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: toNumber(i.unitPrice),
      modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
      note: i.note ?? undefined,
    })),
  }));
}

/** Single-order fetch used by the POS "Pay" flow. Returns null when
 * the order has already been paid/cancelled/refunded since the picker
 * was loaded — the caller surfaces that as a friendly toast. */
export async function getOrderById(id: string): Promise<Order | null> {
  const o = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      staff: { select: { name: true } },
      table: { select: { name: true } },
    },
  });
  if (!o) return null;
  return {
    id: o.id,
    number: o.number,
    status: o.status as OrderStatus,
    channel: o.channel as OrderChannel,
    customer: o.customerName
      ? { name: o.customerName, phone: o.customerPhone ?? undefined }
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
    payment: o.payment ? (o.payment as PaymentMethod) : undefined,
    paidAt: o.paidAt ? o.paidAt.toISOString() : undefined,
    staff: o.staff?.name ?? ANON_STAFF,
    notes: o.notes ?? undefined,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    fiscalInvoiceNumber: o.fiscalInvoiceNumber ?? undefined,
    fiscalSubmittedAt: o.fiscalSubmittedAt
      ? o.fiscalSubmittedAt.toISOString()
      : undefined,
    fiscalLastError: o.fiscalLastError ?? undefined,
  };
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
