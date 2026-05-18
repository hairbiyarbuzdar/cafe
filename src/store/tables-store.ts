"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Table, TableStatus } from "@/types";

type State = {
  tables: Table[];
  selectedTableId?: string;
  createTable: (capacity: number) => Table;
  removeTable: (id: string) => void;
  setCapacity: (id: string, capacity: number) => void;
  setOccupancy: (id: string, occupancy: number) => void;
  selectTable: (id: string | undefined) => void;
  /** Convenience for the cart: pin current order to a table. */
  assignSelected: () => void;
  reset: () => void;
};

const DEFAULTS: Table[] = [
  { id: "tbl_1", name: "T-1", capacity: 2, occupancy: 0 },
  { id: "tbl_2", name: "T-2", capacity: 4, occupancy: 2 },
  { id: "tbl_3", name: "T-3", capacity: 4, occupancy: 4 },
  { id: "tbl_4", name: "T-4", capacity: 6, occupancy: 0 },
  { id: "tbl_5", name: "T-5", capacity: 2, occupancy: 1 },
];

function nextName(tables: Table[]): { name: string; index: number } {
  const used = new Set(
    tables
      .map((t) => /^T-(\d+)$/.exec(t.name)?.[1])
      .filter((s): s is string => Boolean(s))
      .map((s) => parseInt(s, 10)),
  );
  let n = 1;
  while (used.has(n)) n++;
  return { name: `T-${n}`, index: n };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const useTables = create<State>()(
  persist(
    (set) => ({
      tables: DEFAULTS,
      selectedTableId: undefined,

      createTable: (capacity) => {
        let created!: Table;
        set((state) => {
          const { name, index } = nextName(state.tables);
          const cap = Math.max(1, Math.floor(capacity || 1));
          const table: Table = {
            id: `tbl_${index}_${Date.now().toString(36)}`,
            name,
            capacity: cap,
            occupancy: 0,
          };
          created = table;
          return { tables: [...state.tables, table] };
        });
        return created;
      },

      removeTable: (id) =>
        set((state) => ({
          tables: state.tables.filter((t) => t.id !== id),
          selectedTableId:
            state.selectedTableId === id ? undefined : state.selectedTableId,
        })),

      setCapacity: (id, capacity) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  capacity: Math.max(1, Math.floor(capacity || 1)),
                  occupancy: Math.min(t.occupancy, Math.max(1, Math.floor(capacity || 1))),
                }
              : t,
          ),
        })),

      setOccupancy: (id, occupancy) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id ? { ...t, occupancy: clamp(occupancy, 0, t.capacity) } : t,
          ),
        })),

      selectTable: (id) => set({ selectedTableId: id }),
      assignSelected: () => {},
      reset: () => set({ tables: DEFAULTS, selectedTableId: undefined }),
    }),
    {
      name: "brewline_tables",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tables: state.tables,
        selectedTableId: state.selectedTableId,
      }),
    },
  ),
);

export function tableStatus(t: Table): TableStatus {
  if (t.occupancy <= 0) return "empty";
  if (t.occupancy >= t.capacity) return "full";
  return "partial";
}
