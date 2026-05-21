/**
 * Client-side export orchestrator. Given a bundle (datasets + branding)
 * and a target format, it generates the file in the browser and triggers
 * the download. Used by the shared <ExportMenu> and the Settings →
 * Data Import/Export screen.
 */

import { datasetsToCsv } from "./format-csv";
import { datasetsToJson } from "./format-json";
import { datasetsToPdf, type PdfOptions } from "./format-pdf";
import { datasetsToXlsx } from "./format-xlsx";
import { buildFilename } from "./download";
import { triggerDownload } from "./download";
import type { ExportBundle, ExportFormat } from "./types";

export interface RunExportOptions {
  /** Filename scope, e.g. "orders" or "full-system". */
  scope: string;
  /** Human title used for the PDF header. */
  title?: string;
  /** Optional PDF subtitle (active filters / date range). */
  subtitle?: string;
  pdf?: Pick<PdfOptions, "orientation">;
}

export async function runExport(
  bundle: ExportBundle,
  format: ExportFormat,
  options: RunExportOptions,
): Promise<void> {
  const { datasets, branding } = bundle;
  const filename = buildFilename(options.scope, format, branding.cafeName);

  switch (format) {
    case "csv":
      triggerDownload(datasetsToCsv(datasets), filename, "csv");
      return;
    case "json":
      triggerDownload(datasetsToJson(datasets, branding), filename, "json");
      return;
    case "xlsx":
      triggerDownload(datasetsToXlsx(datasets, branding), filename, "xlsx");
      return;
    case "pdf": {
      const buf = await datasetsToPdf(datasets, branding, {
        title: options.title ?? branding.cafeName,
        subtitle: options.subtitle,
        orientation: options.pdf?.orientation,
      });
      triggerDownload(buf, filename, "pdf");
      return;
    }
  }
}
