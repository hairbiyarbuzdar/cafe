"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { TicketStatus } from "@/types";

/**
 * Tickets are derived from orders at render time, but their
 * lifecycle status is mutated per station — so we persist a small
 * override map keyed by `${orderId}__${stationId}`.
 *
 * If an override is absent, the kitchen page falls back to a sensible
 * default based on the parent order's status.
 */
type State = {
  statuses: Record<string, TicketStatus>;
  setStatus: (ticketId: string, status: TicketStatus) => void;
  reset: () => void;
};

export const useKitchenTickets = create<State>()(
  persist(
    (set) => ({
      statuses: {},
      setStatus: (ticketId, status) =>
        set((s) => ({ statuses: { ...s.statuses, [ticketId]: status } })),
      reset: () => set({ statuses: {} }),
    }),
    {
      name: "brewline_kitchen_tickets",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
