"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setKitchenTicketStatusAction } from "@/lib/actions/kitchen";
import { placeOrderAction } from "@/lib/actions/orders";
import {
  listQueuedMutations,
  markMutationFailed,
  parseLocalTicketId,
  removeMutation,
  type QueuedMutation,
} from "@/lib/offline/queue";
import { useOnlineStatus } from "@/lib/offline/use-online-status";
import { useOfflineOrders } from "@/store/offline-orders-store";
import { useOfflineTicketStatuses } from "@/store/offline-ticket-statuses-store";

const MAX_AUTOMATIC_RETRIES = 3;

/**
 * Mounted once in the authenticated layout. Responsibilities:
 *
 *   1. On boot, rehydrate both sync mirrors (offline-orders +
 *      offline-ticket-statuses) from IndexedDB so the kitchen board
 *      and the topbar pill show the right state before any network
 *      activity happens.
 *   2. Whenever the browser transitions to online — and once on
 *      mount when already online — drain the queue by replaying each
 *      mutation against its server action.
 *
 * `placeOrder` mutations replay first (in createdAt order) so any
 * `setTicketStatus` updates that depend on the parent order existing
 * server-side will succeed on the second sweep.
 *
 * Renders nothing.
 */
export function OfflineReplay() {
  const router = useRouter();
  const online = useOnlineStatus();
  const setAllShadows = useOfflineOrders((s) => s.setAll);
  const removeShadow = useOfflineOrders((s) => s.remove);
  const setAllOverrides = useOfflineTicketStatuses((s) => s.setAll);
  const removeOverride = useOfflineTicketStatuses((s) => s.removeByQueueId);
  const inFlight = React.useRef<Set<string>>(new Set());

  // Hydrate the sync mirrors from IDB on first mount so the UI
  // reflects whatever was queued before this tab opened.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const queued = await listQueuedMutations();
      if (cancelled) return;
      setAllShadows(
        queued.flatMap((m) => (m.type === "placeOrder" ? [m.shadow] : [])),
      );
      setAllOverrides(
        queued.flatMap((m) =>
          // Both server-bound (`setTicketStatus`) and local-only
          // (`setLocalTicketStatus`) overrides participate in the
          // kitchen-board render. The replay loop differentiates by
          // type — only the server-bound flavour actually fires the
          // action.
          m.type === "setTicketStatus" || m.type === "setLocalTicketStatus"
            ? [{ queueId: m.id, ticketId: m.input.ticketId, status: m.input.status }]
            : [],
        ),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [setAllShadows, setAllOverrides]);

  React.useEffect(() => {
    if (!online) return;

    let cancelled = false;

    async function replayOne(m: QueuedMutation) {
      try {
        if (m.type === "placeOrder") {
          const result = await placeOrderAction(m.input);
          if (result.ok) {
            await removeMutation(m.id);
            removeShadow(m.id);
            // The shadow tickets that just disappeared took any
            // `setLocalTicketStatus` overrides with them — purge
            // the orphans so the offline ticket-statuses store
            // doesn't grow unbounded across days of offline work.
            await purgeOrphanedLocalOverrides(m.id);
            toast.success(
              `Synced ${m.shadow.number} → ${result.orderNumber}`,
              { description: "Offline order is now in the kitchen queue." },
            );
            router.refresh();
          } else {
            await markMutationFailed(m, result.error);
            if (m.attempts + 1 >= MAX_AUTOMATIC_RETRIES) {
              toast.error(`Could not sync ${m.shadow.number}`, {
                description: `${result.error} — open the order from IndexedDB to inspect or remove it.`,
              });
            }
          }
        } else if (m.type === "setTicketStatus") {
          const result = await setKitchenTicketStatusAction(
            m.input.ticketId,
            m.input.status,
          );
          if (result.ok) {
            await removeMutation(m.id);
            removeOverride(m.id);
            router.refresh();
          } else {
            await markMutationFailed(m, result.error);
            if (m.attempts + 1 >= MAX_AUTOMATIC_RETRIES) {
              toast.error("Couldn't sync ticket status", {
                description: `${result.error} — the kitchen update will not auto-retry further.`,
              });
            }
          }
        }
        // `setLocalTicketStatus` has no server effect — it lives in
        // the queue purely for hydration, and is collected by
        // `purgeOrphanedLocalOverrides` once the parent order syncs.
      } catch (err) {
        // Network blip during replay — leave it in the queue, we'll
        // retry on the next `online` event.
        const msg = err instanceof Error ? err.message : String(err);
        await markMutationFailed(m, msg);
      }
    }

    async function purgeOrphanedLocalOverrides(syncedLocalOrderId: string) {
      const queue = await listQueuedMutations();
      for (const entry of queue) {
        if (entry.type !== "setLocalTicketStatus") continue;
        const parsed = parseLocalTicketId(entry.input.ticketId);
        if (parsed?.localOrderId === syncedLocalOrderId) {
          await removeMutation(entry.id);
          removeOverride(entry.id);
        }
      }
    }

    const drain = async () => {
      const queue = await listQueuedMutations();
      // Two passes: placeOrder first so any dependent setTicketStatus
      // mutations (whose ticket ids reference orders that only just
      // landed on the server) succeed on the second pass.
      // setLocalTicketStatus entries are skipped — they're handled
      // by `purgeOrphanedLocalOverrides` when their parent syncs.
      const orders = queue.filter((m) => m.type === "placeOrder");
      const statuses = queue.filter((m) => m.type === "setTicketStatus");
      for (const m of [...orders, ...statuses]) {
        if (cancelled) return;
        if (inFlight.current.has(m.id)) continue;
        inFlight.current.add(m.id);
        try {
          await replayOne(m);
        } finally {
          inFlight.current.delete(m.id);
        }
      }
    };

    drain();
    return () => {
      cancelled = true;
    };
  }, [online, router, removeShadow, removeOverride]);

  return null;
}
