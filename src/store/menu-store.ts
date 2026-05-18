"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { MENU_ITEMS } from "@/mock/menu";
import type { MenuItem } from "@/types";

type Draft = Omit<MenuItem, "id">;

type State = {
  items: MenuItem[];
  /** Create a new menu item. Returns the persisted entity. */
  create: (draft: Draft) => MenuItem;
  /** Patch any subset of fields by id. */
  update: (id: string, patch: Partial<MenuItem>) => void;
  remove: (id: string) => void;
  /** Toggle 86'd state */
  toggleAvailability: (id: string) => void;
  /** Toggle POS visibility */
  togglePosVisibility: (id: string) => void;
  /** Restore defaults — useful from settings */
  reset: () => void;
};

function newId(): string {
  return `m_${Math.random().toString(36).slice(2, 9)}`;
}

export const useMenu = create<State>()(
  persist(
    (set) => ({
      items: MENU_ITEMS,

      create: (draft) => {
        const item: MenuItem = { id: newId(), ...draft };
        set((s) => ({ items: [item, ...s.items] }));
        return item;
      },

      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      toggleAvailability: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, available: !i.available } : i,
          ),
        })),

      togglePosVisibility: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, posVisible: !i.posVisible } : i,
          ),
        })),

      reset: () => set({ items: MENU_ITEMS }),
    }),
    {
      name: "brewline_menu",
      storage: createJSONStorage(() => localStorage),
      // bump when MenuItem shape changes so stale clients fall back
      version: 1,
    },
  ),
);

/** What the POS should see — active, in stock, and POS-visible. */
export function selectPosVisibleItems(items: MenuItem[]): MenuItem[] {
  return items.filter((i) => i.posVisible);
}
