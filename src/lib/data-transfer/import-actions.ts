"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth";
import type { Permission } from "@/types/auth";
import { importModuleRows } from "./import.server";
import { getModule } from "./registry";
import type { ImportResult, ModuleKey } from "./types";

export interface ImportPayload {
  modules: { key: ModuleKey; rows: Record<string, string>[] }[];
}

function can(permissions: Permission[] | undefined, perm: Permission): boolean {
  return !!permissions?.includes(perm);
}

// Routes whose server data is affected by importing a given module.
const REVALIDATE: Record<ModuleKey, string[]> = {
  orders: ["/orders", "/dashboard", "/reports"],
  menu: ["/menu", "/pos"],
  inventory: ["/inventory"],
  suppliers: ["/inventory"],
  staff: ["/staff", "/settings"],
  expenses: ["/expenses", "/reports"],
  customers: [],
  paymentMethods: ["/settings", "/pos"],
};

/**
 * Import previously-parsed rows (keyed by module column key). Validates,
 * skips duplicate ids, and reports per-module counts + errors. Requires
 * `settings.edit` since it writes across the whole system.
 */
export async function importDataAction(
  payload: ImportPayload,
): Promise<ImportResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: "Not signed in", modules: [] };
  if (!can(session.user.permissions, "settings.edit")) {
    return {
      ok: false,
      error: "You don't have permission to import data",
      modules: [],
    };
  }
  if (!payload.modules.length) {
    return { ok: false, error: "Nothing to import", modules: [] };
  }

  const results = [];
  const touched = new Set<string>();
  try {
    for (const { key, rows } of payload.modules) {
      if (!getModule(key)?.importable) continue;
      results.push(await importModuleRows(key, rows));
      REVALIDATE[key]?.forEach((p) => touched.add(p));
    }
  } catch (err) {
    console.error("importDataAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Import failed",
      modules: results,
    };
  }

  touched.add("/dashboard");
  touched.forEach((p) => revalidatePath(p));

  return { ok: true, modules: results };
}
