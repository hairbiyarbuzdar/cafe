"use client";

import { create } from "zustand";

import { signOutAction } from "@/lib/actions/auth";
import type { SessionUser } from "@/types/auth";

type State = {
  user: SessionUser | null;
  hydrated: boolean;
  setUser: (user: SessionUser | null) => void;
  signOut: () => Promise<void>;
};

/**
 * Client-side mirror of the server session.
 *
 * The actual sign-in flow now lives in server actions (`lib/actions/auth.ts`)
 * since password verification needs bcrypt + DB. This store just caches
 * the current user — seeded by `SessionProvider` from the server-rendered
 * layout — so client components don't have to thread it through props.
 */
export const useAuth = create<State>((set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user, hydrated: true }),
  signOut: async () => {
    await signOutAction();
    set({ user: null });
  },
}));
