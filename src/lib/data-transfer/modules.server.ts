import "server-only";

import { supabase } from "@/lib/supabase";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { getModule, MODULE_ORDER } from "./registry";
import type {
  DataRow,
  ExportBranding,
  ExportBundle,
  ModuleDataset,
  ModuleKey,
} from "./types";

export const LOGO_PUBLIC_PATH = "/logo.png";

const num = (d: unknown): number | null => (d == null ? null : Number(d));
const iso = (d: string | Date | null | undefined): string | null => {
  if (d == null) return null;
  if (typeof d === "string") return d;
  return d.toISOString();
};

export async function getExportBranding(): Promise<ExportBranding> {
  const ws = await getOrCreateWorkspace();
  return {
    cafeName: ws.name,
    addressLine: ws.addressLine,
    city: ws.city,
    phone: ws.phone,
    currencyCode: ws.currency,
    logoUrl: LOGO_PUBLIC_PATH,
    generatedAt: new Date().toISOString(),
  };
}

async function fetchOrders(): Promise<DataRow[]> {
  const { data: orders } = await supabase
    .from("Order")
    .select("*, paymentChannel:paymentChannelId(name), staff:staffId(name)")
    .order("createdAt", { ascending: false });

  if (!orders?.length) return [];

  const orderIds = orders.map((o) => o.id);
  const { data: items } = await supabase
    .from("OrderItem")
    .select("orderId")
    .in("orderId", orderIds);

  const countMap = new Map<string, number>();
  for (const item of items ?? []) {
    countMap.set(item.orderId, (countMap.get(item.orderId) ?? 0) + 1);
  }

  return orders.map((o) => {
    const pc = Array.isArray(o.paymentChannel) ? o.paymentChannel[0] : o.paymentChannel;
    const st = Array.isArray(o.staff) ? o.staff[0] : o.staff;
    return {
      id: o.id,
      number: o.number,
      status: o.status,
      channel: o.channel,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      itemCount: countMap.get(o.id) ?? 0,
      subtotal: num(o.subtotal),
      tax: num(o.tax),
      discount: num(o.discount),
      tip: num(o.tip),
      total: num(o.total),
      payment: o.payment ?? null,
      paymentChannel: (pc as { name?: string } | null)?.name ?? null,
      staff: (st as { name?: string } | null)?.name ?? null,
      paidAt: iso(o.paidAt),
      createdAt: iso(o.createdAt),
    };
  });
}

async function fetchMenu(): Promise<DataRow[]> {
  const { data: rows } = await supabase
    .from("MenuItem")
    .select("*, category:categoryId(name), station:stationId(name)")
    .order("name");

  return (rows ?? []).map((m) => {
    const cat = Array.isArray(m.category) ? m.category[0] : m.category;
    const sta = Array.isArray(m.station) ? m.station[0] : m.station;
    return {
      id: m.id,
      name: m.name,
      category: (cat as { name?: string } | null)?.name ?? null,
      price: num(m.price),
      sku: m.sku,
      station: (sta as { name?: string } | null)?.name ?? null,
      available: m.available,
      posVisible: m.posVisible,
      popular: m.popular,
      prepTimeMinutes: m.prepTimeMinutes,
      description: m.description,
      createdAt: iso(m.createdAt),
    };
  });
}

async function fetchInventory(): Promise<DataRow[]> {
  const { data: rows } = await supabase
    .from("InventoryItem")
    .select("*, supplier:supplierId(name)")
    .order("name");

  return (rows ?? []).map((i) => {
    const sup = Array.isArray(i.supplier) ? i.supplier[0] : i.supplier;
    return {
      id: i.id,
      name: i.name,
      sku: i.sku,
      category: i.category,
      unit: i.unit,
      stock: num(i.stock),
      reorderLevel: num(i.reorderLevel),
      costPerUnit: num(i.costPerUnit),
      supplier: (sup as { name?: string } | null)?.name ?? null,
      lastRestocked: iso(i.lastRestocked),
      expiresAt: iso(i.expiresAt),
      createdAt: iso(i.createdAt),
    };
  });
}

async function fetchSuppliers(): Promise<DataRow[]> {
  const { data: rows } = await supabase.from("Supplier").select("*").order("name");
  return (rows ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    contact: s.contact,
    email: s.email,
    phone: s.phone,
    address: s.address,
    rating: s.rating,
    createdAt: iso(s.createdAt),
  }));
}

async function fetchStaff(): Promise<DataRow[]> {
  const { data: rows } = await supabase.from("User").select("*").order("name");
  return (rows ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    monthlySalary: num(u.monthlySalary),
    overtimeRate: num(u.overtimeRate),
    standardWorkingDays: u.standardWorkingDays,
    active: u.active,
    createdAt: iso(u.createdAt),
  }));
}

async function fetchExpenses(): Promise<DataRow[]> {
  const { data: rows } = await supabase
    .from("Expense")
    .select("*, expenseHead:expenseHeadId(name), paymentChannel:paymentChannelId(name)")
    .order("occurredAt", { ascending: false });

  return (rows ?? []).map((e) => {
    const head = Array.isArray(e.expenseHead) ? e.expenseHead[0] : e.expenseHead;
    const pc = Array.isArray(e.paymentChannel) ? e.paymentChannel[0] : e.paymentChannel;
    return {
      id: e.id,
      head: (head as { name?: string } | null)?.name ?? null,
      amount: num(e.amount),
      paymentChannel: (pc as { name?: string } | null)?.name ?? null,
      detail: e.detail,
      occurredAt: iso(e.occurredAt),
      createdAt: iso(e.createdAt),
    };
  });
}

async function fetchCustomers(): Promise<DataRow[]> {
  const { data: orders } = await supabase
    .from("Order")
    .select("customerName, customerPhone, total, createdAt")
    .or("customerName.not.is.null,customerPhone.not.is.null");

  const map = new Map<
    string,
    { name: string | null; phone: string | null; count: number; spent: number; last: string }
  >();

  for (const o of orders ?? []) {
    const key = ((o.customerPhone || o.customerName) ?? "").toLowerCase();
    if (!key) continue;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.spent += Number(o.total);
      if (o.createdAt > existing.last) existing.last = o.createdAt;
    } else {
      map.set(key, {
        name: o.customerName,
        phone: o.customerPhone,
        count: 1,
        spent: Number(o.total),
        last: o.createdAt,
      });
    }
  }

  return [...map.entries()].map(([key, c]) => ({
    id: key,
    name: c.name,
    phone: c.phone,
    orderCount: c.count,
    totalSpent: c.spent,
    lastOrderAt: c.last,
  }));
}

async function fetchPaymentMethods(): Promise<DataRow[]> {
  const { data: rows } = await supabase
    .from("PaymentChannel")
    .select("*")
    .order("archived")
    .order("createdAt");

  return (rows ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    kind: p.kind,
    openingBalance: num(p.openingBalance),
    currentBalance: num(p.currentBalance),
    archived: p.archived,
    createdAt: iso(p.createdAt),
  }));
}

const FETCHERS: Record<ModuleKey, () => Promise<DataRow[]>> = {
  orders: fetchOrders,
  menu: fetchMenu,
  inventory: fetchInventory,
  suppliers: fetchSuppliers,
  staff: fetchStaff,
  expenses: fetchExpenses,
  customers: fetchCustomers,
  paymentMethods: fetchPaymentMethods,
};

export async function fetchModuleRows(key: ModuleKey): Promise<DataRow[]> {
  return FETCHERS[key]();
}

export async function buildExportBundle(keys: ModuleKey[]): Promise<ExportBundle> {
  const ordered = MODULE_ORDER.filter((k) => keys.includes(k));
  const branding = await getExportBranding();
  const datasets: ModuleDataset[] = [];
  for (const key of ordered) {
    const meta = getModule(key);
    const rows = await fetchModuleRows(key);
    datasets.push({
      key,
      label: meta.label,
      sheetName: meta.sheetName,
      columns: meta.columns,
      idField: meta.idField,
      rows,
    });
  }
  return { branding, datasets };
}
