import "server-only";

import { supabase } from "@/lib/supabase";
import type { Order, OrderChannel, OrderStatus, PaymentMethod } from "@/types";

const ANON_STAFF = "Unassigned";

function mapOrder(o: Record<string, unknown>): Order {
  const items = (o.OrderItem as Record<string, unknown>[] | null) ?? [];
  const staff = (o.staff as { name: string } | null) ?? (Array.isArray(o.User) ? o.User[0] : null);
  const assignedStaff = o.assignedStaff as { name: string } | null;
  const table = (o.table as { name: string } | null) ?? (Array.isArray(o.Table) ? o.Table[0] : null);
  return {
    id: o.id as string,
    number: o.number as string,
    status: o.status as OrderStatus,
    channel: o.channel as OrderChannel,
    customer: o.customerName ? { name: o.customerName as string, phone: (o.customerPhone as string | null) ?? undefined } : undefined,
    table: (table as { name: string } | null)?.name,
    items: items.map((i) => ({
      id: i.id as string,
      productId: i.menuItemId as string | null ?? undefined,
      name: i.name as string,
      quantity: i.quantity as number,
      unitPrice: Number(i.unitPrice),
      modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
      note: (i.note as string | null) ?? undefined,
    })),
    subtotal: Number(o.subtotal),
    tax: Number(o.tax),
    tip: o.tip != null ? Number(o.tip) : undefined,
    discount: o.discount != null ? Number(o.discount) : undefined,
    total: Number(o.total),
    payment: o.payment ? (o.payment as PaymentMethod) : undefined,
    paymentChannelId: (o.paymentChannelId as string | null) ?? undefined,
    paidAt: (o.paidAt as string | null) ?? undefined,
    staff: (staff as { name: string } | null)?.name ?? ANON_STAFF,
    assignedStaff: (assignedStaff as { name: string } | null)?.name ?? undefined,
    notes: (o.notes as string | null) ?? undefined,
    createdAt: o.createdAt as string,
    updatedAt: o.updatedAt as string,
    fiscalInvoiceNumber: (o.fiscalInvoiceNumber as string | null) ?? undefined,
    fiscalSubmittedAt: (o.fiscalSubmittedAt as string | null) ?? undefined,
    fiscalLastError: (o.fiscalLastError as string | null) ?? undefined,
  };
}

const ORDER_SELECT = `
  *,
  OrderItem(*),
  staffUser:staffId(name),
  assignedUser:assignedStaffId(name),
  Table(name)
`;

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("Order")
    .select(ORDER_SELECT)
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((o) => mapOrder(o as unknown as Record<string, unknown>));
}

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
  status: OrderStatus;
  table?: string;
  customerName?: string;
  total: number;
  itemCount: number;
  createdAt: string;
  items: HeldOrderLine[];
};

export async function listHeldOrders(): Promise<HeldOrderSummary[]> {
  const { data, error } = await supabase
    .from("Order")
    .select("id, number, channel, status, customerName, total, createdAt, Table(name), OrderItem(id, name, quantity, unitPrice, modifiers, note)")
    .is("paidAt", null)
    .not("status", "in", '("cancelled","refunded","completed")')
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((o) => {
    const table = Array.isArray(o.Table) ? o.Table[0] : o.Table;
    const items = (o.OrderItem ?? []) as Record<string, unknown>[];
    return {
      id: o.id,
      number: o.number,
      channel: o.channel as OrderChannel,
      status: o.status as OrderStatus,
      table: (table as { name: string } | null)?.name,
      customerName: o.customerName ?? undefined,
      total: Number(o.total),
      itemCount: items.length,
      createdAt: o.createdAt,
      items: items.map((i) => ({
        id: i.id as string,
        name: i.name as string,
        quantity: i.quantity as number,
        unitPrice: Number(i.unitPrice),
        modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
        note: (i.note as string | null) ?? undefined,
      })),
    };
  });
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("Order")
    .select(ORDER_SELECT)
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapOrder(data as unknown as Record<string, unknown>);
}

export type OrdersSummary = { completed: number; pending: number; revenue: number };

export async function ordersSummary(): Promise<OrdersSummary> {
  const [{ count: completed }, { count: pending }, { data: rev }] = await Promise.all([
    supabase.from("Order").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("Order").select("*", { count: "exact", head: true }).in("status", ["pending", "preparing"]),
    supabase.from("Order").select("total").eq("status", "completed"),
  ]);
  const revenue = (rev ?? []).reduce((sum, r) => sum + Number(r.total), 0);
  return { completed: completed ?? 0, pending: pending ?? 0, revenue };
}
