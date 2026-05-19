import "server-only";

import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ActivityType = "order" | "stock" | "staff" | "system";

type LogActivityInput = {
  type: ActivityType;
  title: string;
  description?: string | null;
  /** Order this event relates to, if any. */
  orderId?: string | null;
  /** Override for the actor (defaults to the current session user). */
  actorName?: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * Append an event to the audit log. Best-effort — failures here must
 * never roll back the calling business action, so we catch and log
 * rather than throw. Use sparingly: every UI-visible state change
 * worth surfacing on the dashboard.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  let actorName = input.actorName ?? null;
  let actorId: string | null = null;
  try {
    if (actorName === null) {
      const session = await getServerSession();
      actorName = session?.user.name ?? null;
      actorId = session?.user.id ?? null;
    }
    await prisma.activity.create({
      data: {
        type: input.type,
        title: input.title,
        description: input.description?.trim() || null,
        actorName,
        actorId,
        orderId: input.orderId ?? null,
        metadata: input.metadata ? (input.metadata as object) : undefined,
      },
    });
  } catch (err) {
    console.error("logActivity failed", err);
  }
}
