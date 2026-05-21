import "server-only";

import { prisma } from "@/lib/prisma";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { getModule, MODULE_ORDER } from "./registry";
import type {
  DataRow,
  ExportBranding,
  ExportBundle,
  ModuleDataset,
  ModuleKey,
} from "./types";

/** Logo path under /public. The user drops their file here; the PDF
 * falls back to a café-initials monogram if it's missing. */
export const LOGO_PUBLIC_PATH = "/logo.png";

const num = (d: unknown): number | null => (d == null ? null : Number(d));
const iso = (d: Date | null | undefined): string | null =>
  d ? d.toISOString() : null;

/** Build the workspace-driven branding stamped onto exports. */
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
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { items: true } },
      paymentChannel: { select: { name: true } },
      staff: { select: { name: true } },
    },
  });
  return rows.map((o) => ({
    id: o.id,
    number: o.number,
    status: o.status,
    channel: o.channel,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    itemCount: o._count.items,
    subtotal: num(o.subtotal),
    tax: num(o.tax),
    discount: num(o.discount),
    tip: num(o.tip),
    total: num(o.total),
    payment: o.payment ?? null,
    paymentChannel: o.paymentChannel?.name ?? null,
    staff: o.staff?.name ?? null,
    paidAt: iso(o.paidAt),
    createdAt: iso(o.createdAt),
  }));
}

async function fetchMenu(): Promise<DataRow[]> {
  const rows = await prisma.menuItem.findMany({
    orderBy: { name: "asc" },
    include: {
      category: { select: { name: true } },
      station: { select: { name: true } },
    },
  });
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category?.name ?? null,
    price: num(m.price),
    sku: m.sku,
    station: m.station?.name ?? null,
    available: m.available,
    posVisible: m.posVisible,
    popular: m.popular,
    prepTimeMinutes: m.prepTimeMinutes,
    description: m.description,
    createdAt: iso(m.createdAt),
  }));
}

async function fetchInventory(): Promise<DataRow[]> {
  const rows = await prisma.inventoryItem.findMany({
    orderBy: { name: "asc" },
    include: { supplier: { select: { name: true } } },
  });
  return rows.map((i) => ({
    id: i.id,
    name: i.name,
    sku: i.sku,
    category: i.category,
    unit: i.unit,
    stock: num(i.stock),
    reorderLevel: num(i.reorderLevel),
    costPerUnit: num(i.costPerUnit),
    supplier: i.supplier?.name ?? null,
    lastRestocked: iso(i.lastRestocked),
    expiresAt: iso(i.expiresAt),
    createdAt: iso(i.createdAt),
  }));
}

async function fetchSuppliers(): Promise<DataRow[]> {
  const rows = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return rows.map((s) => ({
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
  const rows = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return rows.map((u) => ({
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
  const rows = await prisma.expense.findMany({
    orderBy: { occurredAt: "desc" },
    include: {
      expenseHead: { select: { name: true } },
      paymentChannel: { select: { name: true } },
    },
  });
  return rows.map((e) => ({
    id: e.id,
    head: e.expenseHead?.name ?? null,
    amount: num(e.amount),
    paymentChannel: e.paymentChannel?.name ?? null,
    detail: e.detail,
    occurredAt: iso(e.occurredAt),
    createdAt: iso(e.createdAt),
  }));
}

async function fetchCustomers(): Promise<DataRow[]> {
  // No Customer table — derive distinct customers from order history.
  const orders = await prisma.order.findMany({
    where: { OR: [{ customerName: { not: null } }, { customerPhone: { not: null } }] },
    select: { customerName: true, customerPhone: true, total: true, createdAt: true },
  });
  const map = new Map<
    string,
    { name: string | null; phone: string | null; count: number; spent: number; last: Date }
  >();
  for (const o of orders) {
    const key = (o.customerPhone || o.customerName || "").toLowerCase();
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
    lastOrderAt: iso(c.last),
  }));
}

async function fetchPaymentMethods(): Promise<DataRow[]> {
  const rows = await prisma.paymentChannel.findMany({
    orderBy: [{ archived: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => ({
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

/** Gather the requested modules into a self-contained export bundle. */
export async function buildExportBundle(
  keys: ModuleKey[],
): Promise<ExportBundle> {
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
