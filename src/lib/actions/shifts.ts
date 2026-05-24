"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export type ShiftStatus = "scheduled" | "confirmed" | "completed" | "missed";

const STATUSES: readonly ShiftStatus[] = [
  "scheduled", "confirmed", "completed", "missed",
];

export type ShiftActionResult<T = { id: string }> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type CreateShiftInput = {
  userId: string;
  date: string;
  start: string;
  end: string;
  status?: ShiftStatus;
  notes?: string | null;
};

function parseHHmm(value: string): { h: number; m: number } | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]) };
}

function buildShiftWindow(date: string, start: string, end: string):
  | { start: Date; end: Date; date: Date }
  | { error: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Date must be YYYY-MM-DD" };
  const startHm = parseHHmm(start);
  const endHm = parseHHmm(end);
  if (!startHm) return { error: "Start time must be HH:mm" };
  if (!endHm) return { error: "End time must be HH:mm" };
  const [y, mo, d] = date.split("-").map(Number);
  const anchor = new Date(y!, (mo ?? 1) - 1, d!, 0, 0, 0, 0);
  const startAt = new Date(anchor);
  startAt.setHours(startHm.h, startHm.m, 0, 0);
  const endAt = new Date(anchor);
  endAt.setHours(endHm.h, endHm.m, 0, 0);
  if (endAt <= startAt) endAt.setDate(endAt.getDate() + 1);
  return { start: startAt, end: endAt, date: anchor };
}

export async function createShiftAction(
  input: CreateShiftInput,
): Promise<ShiftActionResult> {
  if (!input.userId) return { ok: false, error: "Pick a team member" };

  const status: ShiftStatus = input.status ?? "scheduled";
  if (!STATUSES.includes(status)) return { ok: false, error: "Invalid status" };

  const window = buildShiftWindow(input.date, input.start, input.end);
  if ("error" in window) return { ok: false, error: window.error };

  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("id", input.userId)
    .maybeSingle();
  if (!user) return { ok: false, error: "Team member not found" };

  try {
    const { data: row, error } = await supabase
      .from("Shift")
      .insert({
        userId: input.userId,
        date: window.date.toISOString().slice(0, 10),
        start: window.start.toISOString(),
        end: window.end.toISOString(),
        status,
        notes: input.notes?.trim() || null,
      })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true, data: { id: row.id } };
  } catch (err) {
    console.error("createShiftAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create shift",
    };
  }
}

export type UpdateShiftInput = {
  id: string;
  date: string;
  start: string;
  end: string;
  status: ShiftStatus;
  notes?: string | null;
};

export async function updateShiftAction(
  input: UpdateShiftInput,
): Promise<ShiftActionResult> {
  if (!input.id) return { ok: false, error: "Shift id required" };
  if (!STATUSES.includes(input.status)) return { ok: false, error: "Invalid status" };

  const window = buildShiftWindow(input.date, input.start, input.end);
  if ("error" in window) return { ok: false, error: window.error };

  try {
    const { data: row, error } = await supabase
      .from("Shift")
      .update({
        date: window.date.toISOString().slice(0, 10),
        start: window.start.toISOString(),
        end: window.end.toISOString(),
        status: input.status,
        notes: input.notes?.trim() || null,
      })
      .eq("id", input.id)
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true, data: { id: row.id } };
  } catch (err) {
    console.error("updateShiftAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update shift",
    };
  }
}

export async function deleteShiftAction(
  id: string,
): Promise<ShiftActionResult<{ deleted: true }>> {
  if (!id) return { ok: false, error: "Shift id required" };
  try {
    const { error } = await supabase.from("Shift").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true, data: { deleted: true } };
  } catch (err) {
    console.error("deleteShiftAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete shift",
    };
  }
}
