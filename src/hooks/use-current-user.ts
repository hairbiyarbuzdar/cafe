"use client";

import { useSessionUser } from "@/providers/session-provider";
import { hasPermission } from "@/lib/permissions";
import type { Permission } from "@/types/auth";

export function useCurrentUser() {
  return useSessionUser();
}

export function useCan(permission: Permission): boolean {
  const user = useSessionUser();
  return hasPermission(user, permission);
}
