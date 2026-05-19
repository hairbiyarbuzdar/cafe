"use client";

import { create } from "zustand";

import type { TicketStatus } from "@/types";

/**
 * Sync mirror of `setTicketStatus` mutations sitting in IndexedDB.
 *
 * Why a separate store from `useKitchenTickets` (the existing
 * in-memory optimistic overrides):
 *   • The kitchen-tickets store is non-persistent — it survives only
 *     until the next page render. That's correct for the *online*
 *     case where the action round-trips quickly and the next
 *     `router.refresh()` picks up the canonical state.
 *   • Offline status changes need to survive page reloads and the
 *     SW-cached app shell until they actually sync. Backing them
 *     with IDB (via this store's hydration in OfflineReplay) is the
 *     persistence layer.
 *
 * Keyed by *queue mutation id* (so each cook intent is a distinct
 * entry that can be replayed/removed) but indexed by ticketId for the
 * O(1) read on the kitchen board.
 */
type State = {
  /** ticketId → most recent queued status. Last writer wins. */
  byTicketId: Record<string, TicketStatus>;
  /** queue mutation id → ticketId. Drains on replay. */
  byQueueId: Record<string, string>;

  setAll: (entries: { queueId: string; ticketId: string; status: TicketStatus }[]) => void;
  add: (queueId: string, ticketId: string, status: TicketStatus) => void;
  removeByQueueId: (queueId: string) => void;
};

export const useOfflineTicketStatuses = create<State>((set) => ({
  byTicketId: {},
  byQueueId: {},
  setAll: (entries) =>
    set(() => {
      const byTicketId: Record<string, TicketStatus> = {};
      const byQueueId: Record<string, string> = {};
      for (const e of entries) {
        byTicketId[e.ticketId] = e.status;
        byQueueId[e.queueId] = e.ticketId;
      }
      return { byTicketId, byQueueId };
    }),
  add: (queueId, ticketId, status) =>
    set((s) => ({
      byTicketId: { ...s.byTicketId, [ticketId]: status },
      byQueueId: { ...s.byQueueId, [queueId]: ticketId },
    })),
  removeByQueueId: (queueId) =>
    set((s) => {
      const ticketId = s.byQueueId[queueId];
      if (!ticketId) return s;
      const nextByQueue = { ...s.byQueueId };
      delete nextByQueue[queueId];
      // Only drop the ticketId override if no other queue entry still
      // refers to it (i.e. the cook didn't advance the same ticket
      // twice while offline).
      const stillReferenced = Object.values(nextByQueue).includes(ticketId);
      const nextByTicket = { ...s.byTicketId };
      if (!stillReferenced) delete nextByTicket[ticketId];
      return { byTicketId: nextByTicket, byQueueId: nextByQueue };
    }),
}));
