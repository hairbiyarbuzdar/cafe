"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { KITCHEN_STATIONS } from "@/mock/stations";
import type { KitchenStation } from "@/types";

type State = {
  stations: KitchenStation[];
  create: (draft: Omit<KitchenStation, "id">) => KitchenStation;
  update: (id: string, patch: Partial<KitchenStation>) => void;
  remove: (id: string) => void;
  toggleActive: (id: string) => void;
};

function newId(name: string): string {
  return `stn_${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useStations = create<State>()(
  persist(
    (set) => ({
      stations: KITCHEN_STATIONS,

      create: (draft) => {
        const station: KitchenStation = { id: newId(draft.name), ...draft };
        set((s) => ({ stations: [...s.stations, station] }));
        return station;
      },

      update: (id, patch) =>
        set((s) => ({
          stations: s.stations.map((st) =>
            st.id === id ? { ...st, ...patch } : st,
          ),
        })),

      remove: (id) =>
        set((s) => ({ stations: s.stations.filter((st) => st.id !== id) })),

      toggleActive: (id) =>
        set((s) => ({
          stations: s.stations.map((st) =>
            st.id === id ? { ...st, active: !st.active } : st,
          ),
        })),
    }),
    {
      name: "brewline_stations",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
