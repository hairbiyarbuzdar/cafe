/**
 * Client-safe module registry for the import/export system.
 *
 * Defines WHAT each module looks like (label, sheet name, columns,
 * primary key, import/export capability) without any data-fetching or
 * Prisma access — so both client components (export menu, import wizard)
 * and the server (`modules.server.ts`) share one source of truth.
 *
 * To add a new module: add a `ModuleKey`, add an entry here, then add a
 * `fetchModuleRows` case (and optionally an importer) in
 * `modules.server.ts`. Everything else — CSV/XLSX/JSON/PDF export, sheet
 * detection, dedupe — picks it up automatically.
 */

import type { ColumnDef, ModuleKey, ModuleMeta } from "./types";

const col = (
  key: string,
  header: string,
  type: ColumnDef["type"],
  opts: Partial<Omit<ColumnDef, "key" | "header" | "type">> = {},
): ColumnDef => ({ key, header, type, ...opts });

export const MODULES: Record<ModuleKey, ModuleMeta> = {
  orders: {
    key: "orders",
    label: "Orders",
    sheetName: "Orders",
    description: "Settled and in-progress orders with totals and payment.",
    idField: "id",
    exportable: true,
    // Orders are export-only: a flat sheet can't faithfully recreate line
    // items, balances, or inventory side-effects without corrupting them.
    importable: false,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("number", "Order #", "text", { width: 12 }),
      col("status", "Status", "text", { width: 12 }),
      col("channel", "Channel", "text", { width: 12 }),
      col("customerName", "Customer", "text", { width: 18 }),
      col("customerPhone", "Phone", "text", { width: 14 }),
      col("itemCount", "Items", "integer", { width: 7 }),
      col("subtotal", "Subtotal", "money", { width: 12 }),
      col("tax", "Tax", "money", { width: 10 }),
      col("discount", "Discount", "money", { width: 10 }),
      col("tip", "Tip", "money", { width: 10 }),
      col("total", "Total", "money", { width: 12 }),
      col("payment", "Payment", "text", { width: 10 }),
      col("paymentChannel", "Payment method", "text", { width: 16 }),
      col("staff", "Staff", "text", { width: 16 }),
      col("paidAt", "Paid at", "datetime", { width: 18 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  menu: {
    key: "menu",
    label: "Menu",
    sheetName: "Menu",
    description: "Menu items with pricing, category, and availability.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("name", "Name", "text", { width: 24, required: true }),
      col("category", "Category", "text", { width: 16, required: true }),
      col("price", "Price", "money", { width: 12, required: true }),
      col("sku", "SKU", "text", { width: 14 }),
      col("station", "Station", "text", { width: 16 }),
      col("available", "Available", "boolean", { width: 10 }),
      col("posVisible", "POS visible", "boolean", { width: 11 }),
      col("popular", "Popular", "boolean", { width: 9 }),
      col("prepTimeMinutes", "Prep (min)", "integer", { width: 10 }),
      col("description", "Description", "text", { width: 30 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  inventory: {
    key: "inventory",
    label: "Inventory",
    sheetName: "Inventory",
    description: "Stock items with quantities, cost, and supplier.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("name", "Name", "text", { width: 24, required: true }),
      col("sku", "SKU", "text", { width: 14, required: true }),
      col("category", "Category", "text", { width: 16, required: true }),
      col("unit", "Unit", "text", { width: 8, required: true }),
      col("stock", "Stock", "number", { width: 10 }),
      col("reorderLevel", "Reorder level", "number", { width: 12 }),
      col("costPerUnit", "Cost / unit", "money", { width: 12 }),
      col("supplier", "Supplier", "text", { width: 18 }),
      col("lastRestocked", "Last restocked", "datetime", { width: 18 }),
      col("expiresAt", "Expires", "date", { width: 14 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  suppliers: {
    key: "suppliers",
    label: "Suppliers",
    sheetName: "Suppliers",
    description: "Supplier directory with contact details.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("name", "Name", "text", { width: 24, required: true }),
      col("contact", "Contact person", "text", { width: 18 }),
      col("email", "Email", "text", { width: 22 }),
      col("phone", "Phone", "text", { width: 16 }),
      col("address", "Address", "text", { width: 28 }),
      col("rating", "Rating", "number", { width: 8 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  staff: {
    key: "staff",
    label: "Staff",
    sheetName: "Staff",
    description: "Team members, roles, and salary configuration.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("name", "Name", "text", { width: 22, required: true }),
      col("email", "Email", "text", { width: 24, required: true }),
      col("phone", "Phone", "text", { width: 16 }),
      col("role", "Role", "text", { width: 14, required: true }),
      col("monthlySalary", "Monthly salary", "money", { width: 14 }),
      col("overtimeRate", "Overtime rate", "money", { width: 13 }),
      col("standardWorkingDays", "Working days", "integer", { width: 12 }),
      col("active", "Active", "boolean", { width: 8 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  expenses: {
    key: "expenses",
    label: "Expenses",
    sheetName: "Expenses",
    description: "Recorded expenses by head and payment method.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("head", "Expense head", "text", { width: 20, required: true }),
      col("amount", "Amount", "money", { width: 12, required: true }),
      col("paymentChannel", "Payment method", "text", { width: 16, required: true }),
      col("detail", "Detail", "text", { width: 28 }),
      col("occurredAt", "Date", "date", { width: 14, required: true }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },

  customers: {
    key: "customers",
    label: "Customers",
    sheetName: "Customers",
    description: "Distinct customers derived from order history.",
    idField: "id",
    exportable: true,
    // Derived from orders — there is no Customer table to import into.
    importable: false,
    columns: [
      col("id", "ID", "text", { width: 16 }),
      col("name", "Name", "text", { width: 22 }),
      col("phone", "Phone", "text", { width: 16 }),
      col("orderCount", "Orders", "integer", { width: 8 }),
      col("totalSpent", "Total spent", "money", { width: 14 }),
      col("lastOrderAt", "Last order", "datetime", { width: 18 }),
    ],
  },

  paymentMethods: {
    key: "paymentMethods",
    label: "Payment methods",
    sheetName: "Payment Methods",
    description: "Custom payment channels and balances.",
    idField: "id",
    exportable: true,
    importable: true,
    columns: [
      col("id", "ID", "text", { width: 26 }),
      col("name", "Name", "text", { width: 20, required: true }),
      col("kind", "Kind", "text", { width: 10, required: true }),
      col("openingBalance", "Opening balance", "money", { width: 15 }),
      col("currentBalance", "Current balance", "money", { width: 15 }),
      col("archived", "Archived", "boolean", { width: 9 }),
      col("createdAt", "Created", "datetime", { width: 18 }),
    ],
  },
};

/** Stable display/sheet order for the modules. */
export const MODULE_ORDER: ModuleKey[] = [
  "orders",
  "menu",
  "inventory",
  "suppliers",
  "staff",
  "expenses",
  "customers",
  "paymentMethods",
];

export const ALL_MODULES: ModuleMeta[] = MODULE_ORDER.map((k) => MODULES[k]);

export const EXPORTABLE_MODULES: ModuleMeta[] = ALL_MODULES.filter(
  (m) => m.exportable,
);

export const IMPORTABLE_MODULES: ModuleMeta[] = ALL_MODULES.filter(
  (m) => m.importable,
);

export function getModule(key: ModuleKey): ModuleMeta {
  return MODULES[key];
}

/**
 * Match an arbitrary sheet/file name to a module. Tolerant of case,
 * spaces, plurals, and the "Payment Methods" → paymentMethods mapping so
 * a re-imported export round-trips cleanly.
 */
export function matchModuleByName(rawName: string): ModuleKey | null {
  const norm = rawName.trim().toLowerCase().replace(/[\s_-]+/g, "");
  for (const m of ALL_MODULES) {
    const candidates = [m.key, m.label, m.sheetName].map((s) =>
      s.toLowerCase().replace(/[\s_-]+/g, ""),
    );
    if (candidates.includes(norm)) return m.key;
    // also accept singular forms ("order" → orders)
    if (candidates.some((c) => c === `${norm}s` || `${c}` === `${norm}s`)) {
      return m.key;
    }
  }
  return null;
}
