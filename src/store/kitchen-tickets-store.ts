"use client";

import { create } from "zustand";

import type { TicketStatus } from "@/types";

/**
 * Optimistic kitchen-ticket overrides.
 *
 * The KDS reads the canonical state from the DB (via the server-loaded
 * `tickets` prop), but a cook moving a card from "preparing" to "ready"
 * shouldn't wait for the server round-trip + revalidation. We stash the
 * intended status here so the next render reflects it immediately, then
 * fire the server action; on failure we drop the override.
 *
 * The store is **not** persisted to localStorage anymore — the DB is
 * the source of truth, so a hard refresh always wins.
 */
type State = {
  statuses: Record<string, TicketStatus>;
  setLocal: (ticketId: string, status: TicketStatus) => void;
  clearLocal: (ticketId: string) => void;
  reset: () => void;
};

export const useKitchenTickets = create<State>()((set) => ({
  statuses: {},
  setLocal: (ticketId, status) =>
    set((s) => ({ statuses: { ...s.statuses, [ticketId]: status } })),
  clearLocal: (ticketId) =>
    set((s) => {
      if (!(ticketId in s.statuses)) return s;
      const next = { ...s.statuses };
      delete next[ticketId];
      return { statuses: next };
    }),
  reset: () => set({ statuses: {} }),
}));
