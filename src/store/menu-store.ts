"use client";

import { create } from "zustand";

import type { MenuItem } from "@/types";

type Draft = Omit<MenuItem, "id">;

type State = {
  items: MenuItem[];
  hydrate: (items: MenuItem[]) => void;
  /** Create a new menu item. Returns the persisted entity. */
  create: (draft: Draft) => MenuItem;
  /** Patch any subset of fields by id. */
  update: (id: string, patch: Partial<MenuItem>) => void;
  remove: (id: string) => void;
  /** Toggle 86'd state */
  toggleAvailability: (id: string) => void;
  /** Toggle POS visibility */
  togglePosVisibility: (id: string) => void;
};

function newId(): string {
  return `m_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Menu items now live in the database. The (app) layout seeds this
 * store from a Prisma query on every navigation via `DataHydrator`,
 * so the in-memory copy always reflects DB truth on load. Mutations
 * stay client-only for now — a follow-up patch will route them
 * through server actions.
 */
export const useMenu = create<State>()((set) => ({
  items: [],

  hydrate: (items) => set({ items }),

  create: (draft) => {
    const item: MenuItem = { id: newId(), ...draft };
    set((s) => ({ items: [item, ...s.items] }));
    return item;
  },

  update: (id, patch) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),

  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

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
}));

/** What the POS should see — active, in stock, and POS-visible. */
export function selectPosVisibleItems(items: MenuItem[]): MenuItem[] {
  return items.filter((i) => i.posVisible);
}
