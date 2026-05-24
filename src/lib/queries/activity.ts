import "server-only";

import { supabase } from "@/lib/supabase";
import type { ActivityEvent } from "@/types";

export async function listRecentActivity(limit = 12): Promise<ActivityEvent[]> {
  const { data, error } = await supabase
    .from("Activity")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    type: r.type as ActivityEvent["type"],
    title: r.title,
    description: r.description ?? "",
    timestamp: r.createdAt,
    actor: r.actorName ? { name: r.actorName } : undefined,
  }));
}
