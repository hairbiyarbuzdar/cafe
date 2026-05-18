"use client";

import { create } from "zustand";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  parseSession,
  serializeSession,
} from "@/lib/session";
import {
  findUserByCredentials,
  findUserById,
  MOCK_USERS,
} from "@/mock/users";
import type { SessionUser } from "@/types/auth";

type State = {
  user: SessionUser | null;
  hydrated: boolean;
  hydrate: () => void;
  signIn: (email: string, password: string) => SessionUser | null;
  signInAs: (userId: string) => SessionUser | null;
  signOut: () => void;
};

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
  return entry ? entry.slice(SESSION_COOKIE.length + 1) : null;
}

function writeCookie(value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
}

function deleteCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

function toSafe(user: (typeof MOCK_USERS)[number]): SessionUser {
  const { password: _password, ...safe } = user;
  void _password;
  return safe;
}

export const useAuth = create<State>((set) => ({
  user: null,
  hydrated: false,

  hydrate: () => {
    const session = parseSession(readCookie());
    set({ user: session?.user ?? null, hydrated: true });
  },

  signIn: (email, password) => {
    const found = findUserByCredentials(email, password);
    if (!found) return null;
    writeCookie(serializeSession(found.id));
    const safe = toSafe(found);
    set({ user: safe, hydrated: true });
    return safe;
  },

  signInAs: (userId) => {
    const found = findUserById(userId);
    if (!found) return null;
    writeCookie(serializeSession(found.id));
    const safe = toSafe(found);
    set({ user: safe, hydrated: true });
    return safe;
  },

  signOut: () => {
    deleteCookie();
    set({ user: null });
  },
}));
