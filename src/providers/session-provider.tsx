"use client";

import * as React from "react";

import { useAuth } from "@/store/auth-store";
import type { SessionUser } from "@/types/auth";

const SessionContext = React.createContext<SessionUser | null>(null);

/**
 * Seeds the client-side Zustand store with the user resolved by the
 * server (avoiding the unauthenticated-then-authenticated flicker)
 * and exposes that user to any descendant via context.
 */
export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    useAuth.setState({ user, hydrated: true });
  }, [user]);

  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSessionUser(): SessionUser | null {
  return React.useContext(SessionContext);
}
