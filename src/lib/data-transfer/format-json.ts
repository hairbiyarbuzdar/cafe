/**
 * JSON exporter. Emits a single object whose top-level keys are module
 * keys mapped to row arrays, plus a `_meta` block carrying branding. This
 * shape round-trips through the importer (`import-parse.ts` treats every
 * array-valued top-level key as a sheet).
 */

import type { ExportBranding, ModuleDataset } from "./types";

export function datasetsToJson(
  datasets: ModuleDataset[],
  branding: ExportBranding,
): string {
  const out: Record<string, unknown> = {
    _meta: {
      cafeName: branding.cafeName,
      generatedAt: branding.generatedAt,
      modules: datasets.map((d) => d.key),
    },
  };
  for (const ds of datasets) {
    out[ds.key] = ds.rows;
  }
  return JSON.stringify(out, null, 2);
}
