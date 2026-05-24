import "server-only";

import { supabase } from "@/lib/supabase";
import { getServerSession } from "@/lib/auth";

type ActivityType = "order" | "stock" | "staff" | "system";

type LogActivityInput = {
  type: ActivityType;
  title: string;
  description?: string | null;
  orderId?: string | null;
  actorName?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logActivity(input: LogActivityInput): Promise<void> {
  let actorName = input.actorName ?? null;
  let actorId: string | null = null;
  try {
    if (actorName === null) {
      const session = await getServerSession();
      actorName = session?.user.name ?? null;
      actorId = session?.user.id ?? null;
    }
    await supabase.from("Activity").insert({
      type: input.type,
      title: input.title,
      description: input.description?.trim() || null,
      actorName,
      actorId,
      orderId: input.orderId ?? null,
      metadata: input.metadata ?? null,
    });
  } catch (err) {
    console.error("logActivity failed", err);
  }
}
