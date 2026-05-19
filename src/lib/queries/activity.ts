import "server-only";

import { prisma } from "@/lib/prisma";
import type { ActivityEvent } from "@/types";

/**
 * The "Recent activity" feed on the dashboard. Keep this slim — the
 * UI only renders ~8 most-recent events, and the dashboard server
 * page already runs several queries in parallel.
 */
export async function listRecentActivity(limit = 12): Promise<ActivityEvent[]> {
  const rows = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as ActivityEvent["type"],
    title: r.title,
    description: r.description ?? "",
    timestamp: r.createdAt.toISOString(),
    actor: r.actorName ? { name: r.actorName } : undefined,
  }));
}
