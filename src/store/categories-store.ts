"use client";

import { create } from "zustand";

import type { Category } from "@/types";

type State = {
  categories: Category[];
  hydrate: (categories: Category[]) => void;
};

/** Read-only mirror of the MenuCategory table. Seeded by `DataHydrator`. */
export const useCategories = create<State>()((set) => ({
  categories: [],
  hydrate: (categories) => set({ categories }),
}));
