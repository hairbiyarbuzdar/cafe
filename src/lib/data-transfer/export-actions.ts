"use server";

import { getServerSession } from "@/lib/auth";
import type { Permission } from "@/types/auth";
import { buildExportBundle } from "./modules.server";
import type { ExportBundle, ModuleKey } from "./types";

export type ExportActionResult =
  | { ok: true; bundle: ExportBundle }
  | { ok: false; error: string };

function can(permissions: Permission[] | undefined, perm: Permission): boolean {
  return !!permissions?.includes(perm);
}

/**
 * Gather the requested modules' data + branding for client-side file
 * generation. Requires `reports.view` (the umbrella permission for
 * pulling cross-module data); admins always have it.
 */
export async function exportModulesAction(
  keys: ModuleKey[],
): Promise<ExportActionResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: "Not signed in" };
  if (!can(session.user.permissions, "reports.view")) {
    return { ok: false, error: "You don't have permission to export data" };
  }
  if (!keys.length) return { ok: false, error: "No modules selected" };

  try {
    const bundle = await buildExportBundle(keys);
    return { ok: true, bundle };
  } catch (err) {
    console.error("exportModulesAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Export failed",
    };
  }
}
