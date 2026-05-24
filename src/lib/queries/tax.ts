import "server-only";

import { supabase } from "@/lib/supabase";

export type TaxConfig = { rate: number; label: string };

export async function getTaxConfig(): Promise<TaxConfig> {
  const { data } = await supabase.from("TaxConfig").select("rate, label").eq("id", "default").single();
  return { rate: Number(data?.rate ?? 0.085), label: data?.label ?? "Tax" };
}
