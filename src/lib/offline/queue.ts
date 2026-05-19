"use client";

import { idbDelete, idbGetAll, idbPut } from "@/lib/offline/db";
import type { PlaceOrderInput } from "@/lib/actions/orders";
import type {
  KitchenTicketItem,
  OrderChannel,
  TicketStatus,
} from "@/types";

/**
 * Per-station breakdown captured at offline placement time, so the
 * kitchen board can render synthetic tickets for an order that hasn't
 * yet reached the server. The menu store could in principle re-derive
 * this from `PlaceOrderInput.items` + `stationId` lookups, but baking
 * it into the shadow makes the kitchen board purely synchronous and
 * decouples it from station/menu refetches that might happen between
 * placement and sync.
 */
export type ShadowStation = {
  stationId: string;
  items: KitchenTicketItem[];
};

export type ShadowOrder = {
  /** Same id as the queued mutation; lets us pair shadow ↔ queue. */
  id: string;
  number: string;
  total: number;
  itemCount: number;
  channel: OrderChannel;
  tableName: string | null;
  createdAt: number;
  /** Per-station synthetic kitchen tickets while we wait to sync. */
  stations: ShadowStation[];
  notes?: string | null;
};

type BaseQueued = {
  id: string;
  attempts: number;
  lastError?: string;
};

export type QueuedMutation =
  | (BaseQueued & {
      type: "placeOrder";
      input: PlaceOrderInput;
      shadow: ShadowOrder;
    })
  | (BaseQueued & {
      type: "setTicketStatus";
      /** Real ticket id (synthetic `${orderId}__${stationId}` form). */
      input: { ticketId: string; status: TicketStatus };
    })
  | (BaseQueued & {
      /**
       * Status change against a *shadow* ticket — i.e. one whose
       * parent order still sits in the offline queue. There is no
       * server action to replay (the server doesn't know this ticket
       * exists yet); the entry exists purely so the override survives
       * a refresh. Drains automatically when the parent order syncs,
       * via the orphan-cleanup pass in OfflineReplay.
       */
      type: "setLocalTicketStatus";
      input: { ticketId: string; status: TicketStatus };
    });

export async function enqueueMutation(m: QueuedMutation): Promise<void> {
  await idbPut(m);
}

export async function listQueuedMutations(): Promise<QueuedMutation[]> {
  try {
    const all = await idbGetAll<QueuedMutation>();
    return all.sort((a, b) => sortKey(a) - sortKey(b));
  } catch {
    return [];
  }
}

function sortKey(m: QueuedMutation): number {
  if (m.type === "placeOrder") return m.shadow.createdAt;
  return 0;
}

export async function removeMutation(id: string): Promise<void> {
  await idbDelete(id);
}

export async function markMutationFailed(
  m: QueuedMutation,
  error: string,
): Promise<void> {
  await idbPut({ ...m, attempts: m.attempts + 1, lastError: error });
}

/**
 * Client-side local order number. We prefix with `L-` and use a short
 * random suffix so multiple offline orders within one session sort
 * naturally and don't collide. The server's real `#NNNN` arrives on
 * replay and supersedes this label.
 */
export function generateLocalOrderNumber(): string {
  const stamp = Date.now().toString(36).slice(-5).toUpperCase();
  return `L-${stamp}`;
}

export function generateLocalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

/**
 * Tickets generated client-side from a shadow order use this synthetic
 * id shape so they slot into the existing `${orderId}__${stationId}`
 * pattern the kitchen UI already understands.
 */
export function localTicketId(localOrderId: string, stationId: string): string {
  return `local-${localOrderId}__${stationId}`;
}

export function isLocalTicketId(ticketId: string): boolean {
  return ticketId.startsWith("local-");
}

/**
 * Extract the parent shadow-order id from a local ticket id. Returns
 * `null` for ill-formed strings. Used by OfflineReplay to garbage-
 * collect `setLocalTicketStatus` mutations whose parent placeOrder
 * has already synced.
 */
export function parseLocalTicketId(
  ticketId: string,
): { localOrderId: string; stationId: string } | null {
  if (!ticketId.startsWith("local-")) return null;
  const sep = ticketId.indexOf("__");
  if (sep <= "local-".length) return null;
  return {
    localOrderId: ticketId.slice("local-".length, sep),
    stationId: ticketId.slice(sep + 2),
  };
}
