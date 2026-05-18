"use client";

import * as React from "react";

import { useCan } from "@/hooks/use-current-user";
import type { Permission } from "@/types/auth";

type Props = {
  /** Permission required to render the children */
  permission: Permission;
  /** Optional fallback rendered when the user lacks the permission */
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function RoleGate({ permission, fallback = null, children }: Props) {
  const allowed = useCan(permission);
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
