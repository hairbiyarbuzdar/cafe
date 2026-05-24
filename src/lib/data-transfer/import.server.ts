import "server-only";

import { randomUUID } from "node:crypto";

import { supabase } from "@/lib/supabase";
import { getModule } from "./registry";
import type { ImportModuleResult, ModuleKey } from "./types";

type RawRow = Record<string, string>;

// ---- coercion + validation helpers ---------------------------------

const str = (v: unknown): string | null => {
  const s = v == null ? "" : String(v).trim();
  return s === "" ? null : s;
};
const numv = (v: unknown): number | null => {
  const s = str(v);
  if (s == null) return null;
  const n = Number(s.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const intv = (v: unknown): number | null => {
  const n = numv(v);
  return n == null ? null : Math.round(n);
};
const boolv = (v: unknown): boolean => {
  const s = (str(v) ?? "").toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "y";
};
const datev = (v: unknown): string | null => {
  const s = str(v);
  if (s == null) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function checkRequired(key: ModuleKey, row: RawRow): string | null {
  const meta = getModule(key);
  for (const c of meta.columns) {
    if (c.required && str(row[c.key]) == null) {
      return `missing required "${c.header}"`;
    }
  }
  return null;
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "23505"
  );
}

// ---- find-or-create lookups ----------------------------------------

async function categoryIdByName(name: string): Promise<string> {
  const { data: found } = await supabase.from("MenuCategory").select("id").eq("name", name).maybeSingle();
  if (found) return found.id;
  const { data: created, error } = await supabase.from("MenuCategory").insert({ name, slug: slugify(name), color: "#6F4E37" }).select("id").single();
  if (error) throw error;
  return created.id;
}

async function stationIdByName(name: string): Promise<string> {
  const { data: found } = await supabase.from("KitchenStation").select("id").eq("name", name).maybeSingle();
  if (found) return found.id;
  const { data: created, error } = await supabase.from("KitchenStation").insert({ name }).select("id").single();
  if (error) throw error;
  return created.id;
}

async function expenseHeadIdByName(name: string): Promise<string> {
  const { data: found } = await supabase.from("ExpenseHead").select("id").eq("name", name).maybeSingle();
  if (found) return found.id;
  const { data: created, error } = await supabase.from("ExpenseHead").insert({ name }).select("id").single();
  if (error) throw error;
  return created.id;
}

async function supplierIdByName(name: string): Promise<string | null> {
  const { data } = await supabase.from("Supplier").select("id").eq("name", name).maybeSingle();
  return data?.id ?? null;
}

async function paymentChannelIdByName(name: string): Promise<string | null> {
  const { data } = await supabase.from("PaymentChannel").select("id").eq("name", name).maybeSingle();
  return data?.id ?? null;
}

// ---- per-row insert builders ---------------------------------------

type RowInserter = (row: RawRow) => Promise<void>;

const INSERTERS: Record<
  Exclude<ModuleKey, "orders" | "customers">,
  RowInserter
> = {
  suppliers: async (row) => {
    const { error } = await supabase.from("Supplier").insert({
      id: str(row.id) ?? undefined,
      name: str(row.name)!,
      contact: str(row.contact),
      email: str(row.email),
      phone: str(row.phone),
      address: str(row.address),
      rating: numv(row.rating) ?? 0,
    });
    if (error) throw error;
  },

  paymentMethods: async (row) => {
    const kind = (str(row.kind) ?? "cash").toLowerCase();
    if (!["cash", "card", "wallet", "online"].includes(kind)) {
      throw new Error(`invalid kind "${kind}"`);
    }
    const opening = numv(row.openingBalance) ?? 0;
    const { error } = await supabase.from("PaymentChannel").insert({
      id: str(row.id) ?? undefined,
      name: str(row.name)!,
      kind: kind as "cash" | "card" | "wallet" | "online",
      openingBalance: opening,
      currentBalance: numv(row.currentBalance) ?? opening,
      archived: boolv(row.archived),
    });
    if (error) throw error;
  },

  inventory: async (row) => {
    const supplierName = str(row.supplier);
    const supplierId = supplierName ? await supplierIdByName(supplierName) : null;
    const { error } = await supabase.from("InventoryItem").insert({
      id: str(row.id) ?? undefined,
      name: str(row.name)!,
      sku: str(row.sku)!,
      category: str(row.category)!,
      unit: str(row.unit)!,
      stock: numv(row.stock) ?? 0,
      reorderLevel: numv(row.reorderLevel) ?? 0,
      costPerUnit: numv(row.costPerUnit) ?? 0,
      supplierId: supplierId ?? null,
      lastRestocked: datev(row.lastRestocked),
      expiresAt: datev(row.expiresAt),
    });
    if (error) throw error;
  },

  menu: async (row) => {
    const categoryId = await categoryIdByName(str(row.category)!);
    const stationId = await stationIdByName(str(row.station) ?? "Kitchen");
    const { error } = await supabase.from("MenuItem").insert({
      id: str(row.id) ?? undefined,
      name: str(row.name)!,
      description: str(row.description),
      price: numv(row.price) ?? 0,
      sku: str(row.sku),
      available: row.available == null ? true : boolv(row.available),
      posVisible: row.posVisible == null ? true : boolv(row.posVisible),
      popular: boolv(row.popular),
      prepTimeMinutes: intv(row.prepTimeMinutes),
      categoryId,
      stationId,
    });
    if (error) throw error;
  },

  staff: async (row) => {
    const { error } = await supabase.from("User").insert({
      id: str(row.id) ?? undefined,
      name: str(row.name)!,
      email: str(row.email)!.toLowerCase(),
      phone: str(row.phone),
      passwordHash: `imported:${randomUUID()}`,
      role: str(row.role)!,
      monthlySalary: numv(row.monthlySalary),
      overtimeRate: numv(row.overtimeRate),
      standardWorkingDays: intv(row.standardWorkingDays),
      active: row.active == null ? true : boolv(row.active),
    });
    if (error) throw error;
  },

  expenses: async (row) => {
    const headId = await expenseHeadIdByName(str(row.head)!);
    const channelId = await paymentChannelIdByName(str(row.paymentChannel)!);
    if (!channelId) {
      throw new Error(`payment method "${row.paymentChannel}" not found`);
    }
    const { error } = await supabase.from("Expense").insert({
      id: str(row.id) ?? undefined,
      expenseHeadId: headId,
      paymentChannelId: channelId,
      amount: numv(row.amount) ?? 0,
      detail: str(row.detail),
      occurredAt: datev(row.occurredAt) ?? new Date().toISOString(),
    });
    if (error) throw error;
  },
};

/** Tables to query for existing-id dedupe, per module. */
const DEDUPE_TABLE: Record<
  Exclude<ModuleKey, "orders" | "customers">,
  () => Promise<Set<string>>
> = {
  suppliers: async () => {
    const { data } = await supabase.from("Supplier").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
  paymentMethods: async () => {
    const { data } = await supabase.from("PaymentChannel").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
  inventory: async () => {
    const { data } = await supabase.from("InventoryItem").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
  menu: async () => {
    const { data } = await supabase.from("MenuItem").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
  staff: async () => {
    const { data } = await supabase.from("User").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
  expenses: async () => {
    const { data } = await supabase.from("Expense").select("id");
    return new Set((data ?? []).map((r) => r.id));
  },
};

/**
 * Import one module's rows. Skips rows whose id already exists (the
 * duplicate rule — never overwrites), validates required fields, and
 * collects per-row errors without aborting the run.
 */
export async function importModuleRows(
  key: ModuleKey,
  rows: RawRow[],
): Promise<ImportModuleResult> {
  const meta = getModule(key);
  const result: ImportModuleResult = {
    key,
    label: meta.label,
    total: rows.length,
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  if (!meta.importable || key === "orders" || key === "customers") {
    result.errors.push(`${meta.label} is export-only and was skipped.`);
    return result;
  }

  const importKey = key as Exclude<ModuleKey, "orders" | "customers">;
  const existingIds = await DEDUPE_TABLE[importKey]();
  const insert = INSERTERS[importKey];
  const seenInBatch = new Set<string>();

  let rowNum = 0;
  for (const row of rows) {
    rowNum++;
    const id = str(row.id);

    if (id && (existingIds.has(id) || seenInBatch.has(id))) {
      result.skipped++;
      continue;
    }

    const missing = checkRequired(key, row);
    if (missing) {
      result.errors.push(`Row ${rowNum}: ${missing}`);
      continue;
    }

    try {
      await insert(row);
      result.inserted++;
      if (id) {
        existingIds.add(id);
        seenInBatch.add(id);
      }
    } catch (err) {
      if (isUniqueViolation(err)) {
        result.skipped++;
      } else {
        const msg = err instanceof Error ? err.message : "insert failed";
        result.errors.push(`Row ${rowNum}: ${msg}`);
      }
    }
  }

  return result;
}
