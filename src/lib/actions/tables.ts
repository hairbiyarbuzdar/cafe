"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

function nextNameFromExisting(names: string[]): { name: string; next: number } {
  const used = new Set(
    names
      .map((n) => /^T-(\d+)$/.exec(n)?.[1])
      .filter((s): s is string => Boolean(s))
      .map((s) => parseInt(s, 10)),
  );
  let n = 1;
  while (used.has(n)) n++;
  return { name: `T-${n}`, next: n };
}

export async function createTableAction(
  capacity: number,
): Promise<ActionResult<{ id: string }>> {
  if (!Number.isFinite(capacity) || capacity < 1) {
    return { ok: false, error: "Capacity must be at least 1" };
  }
  const { data: existing } = await supabase.from("Table").select("name");
  const { name } = nextNameFromExisting((existing ?? []).map((t) => t.name));
  try {
    const { data: created, error } = await supabase
      .from("Table")
      .insert({ name, capacity: Math.floor(capacity), occupancy: 0 })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createTableAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add table",
    };
  }
}

export async function removeTableAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  const { data: inUse } = await supabase
    .from("Order")
    .select("id")
    .eq("tableId", id)
    .is("paidAt", null)
    .not("status", "in", '("cancelled","refunded")')
    .limit(1)
    .maybeSingle();
  if (inUse) {
    return {
      ok: false,
      error: "An open order is on this table. Settle or cancel it first.",
    };
  }
  try {
    const { error } = await supabase.from("Table").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("removeTableAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to remove table",
    };
  }
}

export async function setTableCapacityAction(
  id: string,
  capacity: number,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  if (!Number.isFinite(capacity) || capacity < 1) {
    return { ok: false, error: "Capacity must be at least 1" };
  }
  const { data: row } = await supabase
    .from("Table")
    .select("occupancy")
    .eq("id", id)
    .maybeSingle();
  if (!row) return { ok: false, error: "Table not found" };
  const cap = Math.floor(capacity);
  try {
    const { error } = await supabase
      .from("Table")
      .update({ capacity: cap, occupancy: Math.min(row.occupancy, cap) })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableCapacityAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update capacity",
    };
  }
}

export async function setTableWaiterAction(
  id: string,
  waiterId: string | null,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  const { data: table } = await supabase
    .from("Table")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!table) return { ok: false, error: "Table not found" };

  if (waiterId) {
    const { data: waiter } = await supabase
      .from("User")
      .select("role")
      .eq("id", waiterId)
      .maybeSingle();
    if (!waiter || waiter.role !== "waiter") {
      return { ok: false, error: "Pick a valid waiter" };
    }
  }

  try {
    const { error } = await supabase
      .from("Table")
      .update({ waiterId })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableWaiterAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to assign waiter",
    };
  }
}

export async function setTableOccupancyAction(
  id: string,
  occupancy: number,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  if (!Number.isFinite(occupancy) || occupancy < 0) {
    return { ok: false, error: "Occupancy must be 0 or greater" };
  }
  const { data: row } = await supabase
    .from("Table")
    .select("capacity")
    .eq("id", id)
    .maybeSingle();
  if (!row) return { ok: false, error: "Table not found" };
  const value = Math.max(0, Math.min(Math.floor(occupancy), row.capacity));
  try {
    const { error } = await supabase
      .from("Table")
      .update({ occupancy: value })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableOccupancyAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update occupancy",
    };
  }
}
