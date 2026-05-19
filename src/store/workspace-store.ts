"use client";

import { create } from "zustand";

import type { Workspace } from "@/lib/queries/workspace";

/**
 * Client-side mirror of the singleton Workspace row. Hydrated by
 * `DataHydrator` at the top of the (app) tree so any client
 * component (receipt dialogs, sidebar surfaces, etc.) can read the
 * café's name / address / receipt-width without prop-drilling.
 *
 * The server is still the source of truth; this is read-only here.
 */
type State = {
  workspace: Workspace | null;
  hydrate: (workspace: Workspace) => void;
};

export const useWorkspace = create<State>()((set) => ({
  workspace: null,
  hydrate: (workspace) => set({ workspace }),
}));
