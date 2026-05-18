"use client";

import { create } from "zustand";

import type { InventoryItem } from "@/types";

type State = {
  items: InventoryItem[];
  hydrate: (items: InventoryItem[]) => void;
};

/** Read-only mirror of the InventoryItem table. Seeded by `DataHydrator`. */
export const useInventory = create<State>()((set) => ({
  items: [],
  hydrate: (items) => set({ items }),
}));
