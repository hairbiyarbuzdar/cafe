import "server-only";

import { supabase } from "@/lib/supabase";
import type { Table } from "@/types";

export async function listTables(): Promise<Table[]> {
  const { data, error } = await supabase
    .from("Table")
    .select("id, name, capacity, occupancy, waiterId, User(name)")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => {
    const waiter = Array.isArray(t.User) ? t.User[0] : t.User;
    return {
      id: t.id,
      name: t.name,
      capacity: t.capacity,
      occupancy: t.occupancy,
      waiterId: t.waiterId,
      waiterName: waiter?.name ?? null,
    };
  });
}
