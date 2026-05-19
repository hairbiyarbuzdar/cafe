"use client";

import { create } from "zustand";

import type { ShadowOrder } from "@/lib/offline/queue";

/**
 * In-memory mirror of the IndexedDB queue, scoped to the
 * UI-relevant `ShadowOrder` projection.
 *
 * On app boot the OfflineReplay component hydrates `setAll(shadows)`
 * from IDB so a refresh-while-offline still surfaces the pending
 * queue. After that, the store and IDB are mutated in lockstep by the
 * code paths that enqueue / replay.
 */
type State = {
  shadows: ShadowOrder[];
  setAll: (shadows: ShadowOrder[]) => void;
  add: (shadow: ShadowOrder) => void;
  remove: (id: string) => void;
};

export const useOfflineOrders = create<State>((set) => ({
  shadows: [],
  setAll: (shadows) => set({ shadows: [...shadows] }),
  add: (shadow) =>
    set((s) =>
      s.shadows.some((x) => x.id === shadow.id)
        ? s
        : { shadows: [...s.shadows, shadow] },
    ),
  remove: (id) =>
    set((s) => ({ shadows: s.shadows.filter((x) => x.id !== id) })),
}));
