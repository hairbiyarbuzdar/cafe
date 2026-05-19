"use client";

import { create } from "zustand";

import type { Table, TableStatus } from "@/types";

/**
 * Client-side mirror of the `Table` table — seeded by `DataHydrator`
 * from a server-side query. Mutations are no longer in this store;
 * they go through server actions (`createTableAction`, etc.) and the
 * resulting `router.refresh()` re-fills `tables` via the hydrator.
 *
 * `selectedTableId` is the only piece of session-only state (which
 * table the current cart is pinned to) and lives here.
 */
type State = {
  tables: Table[];
  selectedTableId?: string;
  hydrate: (tables: Table[]) => void;
  selectTable: (id: string | undefined) => void;
};

export const useTables = create<State>()((set) => ({
  tables: [],
  selectedTableId: undefined,
  hydrate: (tables) => set({ tables }),
  selectTable: (selectedTableId) => set({ selectedTableId }),
}));

export function tableStatus(t: Table): TableStatus {
  if (t.occupancy <= 0) return "empty";
  if (t.occupancy >= t.capacity) return "full";
  return "partial";
}
