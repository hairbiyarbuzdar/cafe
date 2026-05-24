"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type StationInput = {
  name: string;
  printer?: string | null;
  color: string;
  active?: boolean;
};

type SanitizedStation = { name: string; printer: string | null; color: string; active: boolean };
type SanitizeResult = | { ok: true; data: SanitizedStation } | { ok: false; error: string };

function sanitize(input: StationInput): SanitizeResult {
  const name = input.name?.trim();
  const color = input.color?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!color) return { ok: false, error: "Pick a color" };
  return {
    ok: true,
    data: { name, printer: input.printer?.trim() || null, color, active: input.active ?? true },
  };
}

export async function createStationAction(
  input: StationInput,
): Promise<ActionResult<{ id: string }>> {
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const { data: dup } = await supabase
    .from("KitchenStation")
    .select("id")
    .eq("name", sanitized.data.name)
    .maybeSingle();
  if (dup) return { ok: false, error: `Station "${sanitized.data.name}" already exists` };

  try {
    const { data: created, error } = await supabase
      .from("KitchenStation")
      .insert(sanitized.data)
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create station",
    };
  }
}

export async function updateStationAction(
  id: string,
  input: StationInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const { data: dup } = await supabase
    .from("KitchenStation")
    .select("id")
    .eq("name", sanitized.data.name)
    .neq("id", id)
    .maybeSingle();
  if (dup) return { ok: false, error: `Station "${sanitized.data.name}" already exists` };

  try {
    const { error } = await supabase
      .from("KitchenStation")
      .update(sanitized.data)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true };
  } catch (err) {
    console.error("updateStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update station",
    };
  }
}

export async function toggleStationActiveAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };
  const { data: row } = await supabase
    .from("KitchenStation")
    .select("active")
    .eq("id", id)
    .maybeSingle();
  if (!row) return { ok: false, error: "Station not found" };
  await supabase.from("KitchenStation").update({ active: !row.active }).eq("id", id);
  revalidatePath("/menu");
  revalidatePath("/kitchen");
  return { ok: true };
}

export async function deleteStationAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };

  const { data: referenced } = await supabase
    .from("MenuItem")
    .select("id")
    .eq("stationId", id)
    .limit(1)
    .maybeSingle();
  if (referenced) {
    return {
      ok: false,
      error: "At least one menu item routes to this station. Reassign those items before deleting.",
    };
  }

  try {
    const { error } = await supabase.from("KitchenStation").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true };
  } catch (err) {
    console.error("deleteStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete station",
    };
  }
}
