"use client";

import { create } from "zustand";

import type { AssignableStaff } from "@/types";

/**
 * Client-side mirror of the assignable staff (waiters + delivery riders),
 * seeded by `DataHydrator`. Read by the Tables dialog (assign a waiter)
 * and the POS place-order modal (pick waiter / rider).
 */
type State = {
  staff: AssignableStaff[];
  hydrate: (staff: AssignableStaff[]) => void;
};

export const useStaff = create<State>()((set) => ({
  staff: [],
  hydrate: (staff) => set({ staff }),
}));

export function waitersOf(staff: AssignableStaff[]): AssignableStaff[] {
  return staff.filter((s) => s.role === "waiter");
}

export function ridersOf(staff: AssignableStaff[]): AssignableStaff[] {
  return staff.filter((s) => s.role === "delivery");
}
