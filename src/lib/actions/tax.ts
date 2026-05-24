"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export type UpdateTaxResult =
  | { ok: true; data: { rate: number; label: string } }
  | { ok: false; error: string };

export async function updateTaxConfigAction(input: {
  rate: number;
  label: string;
}): Promise<UpdateTaxResult> {
  const rate = Number(input.rate);
  const label = input.label.trim();

  if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
    return {
      ok: false,
      error: "Tax rate must be a decimal between 0 and 1 (e.g. 0.085 for 8.5%)",
    };
  }
  if (label.length < 1 || label.length > 24) {
    return { ok: false, error: "Label is required (1–24 chars)" };
  }

  const { data: row, error } = await supabase
    .from("TaxConfig")
    .upsert({ id: "default", rate, label }, { onConflict: "id" })
    .select("rate, label")
    .single();

  if (error || !row) {
    return { ok: false, error: error?.message ?? "Failed to save" };
  }

  revalidatePath("/", "layout");
  return { ok: true, data: { rate: Number(row.rate), label: row.label } };
}
