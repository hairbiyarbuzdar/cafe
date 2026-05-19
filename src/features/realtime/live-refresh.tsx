"use client";

import { useRouter } from "next/navigation";

import type { RealtimeEventType } from "@/lib/realtime/events";
import { useRealtime } from "@/lib/realtime/use-realtime";

/**
 * Drop-in client component that calls `router.refresh()` whenever the
 * server pushes one of the listed realtime events.
 *
 * Usage from a server page:
 *
 *     <LiveRefresh on={["order.placed", "order.paid"]} />
 *
 * Renders nothing. The single EventSource it opens is per-mount, so
 * including this on a page hosts exactly one connection for that
 * route. If multiple pages stack via nested layouts, each gets its
 * own connection — fine in practice for a café POS.
 */
export function LiveRefresh({
  on,
}: {
  on: ReadonlyArray<RealtimeEventType>;
}) {
  const router = useRouter();
  const allowed = new Set(on);
  useRealtime((event) => {
    if (allowed.has(event.type)) router.refresh();
  });
  return null;
}
