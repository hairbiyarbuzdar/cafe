import "server-only";

import { supabase } from "@/lib/supabase";
import type { KitchenStation } from "@/types";

export async function listKitchenStations(): Promise<KitchenStation[]> {
  const { data, error } = await supabase.from("KitchenStation").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    printer: s.printer ?? undefined,
    active: s.active,
    color: s.color,
  }));
}
