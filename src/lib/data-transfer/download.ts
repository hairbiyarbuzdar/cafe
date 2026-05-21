/**
 * Client-side download helpers. Turns an in-memory string/blob into a
 * browser file download without a server round-trip.
 */

import type { ExportFormat } from "./types";

const MIME: Record<ExportFormat, string> = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
};

export function triggerDownload(
  data: Blob | ArrayBuffer | string,
  filename: string,
  format: ExportFormat,
): void {
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: MIME[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** kebab-case a label for use in filenames. */
export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "export"
  );
}

/** Builds a timestamped export filename, e.g. "brewline-orders-2026-05-21". */
export function buildFilename(
  scope: string,
  format: ExportFormat,
  prefix?: string | null,
): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const parts = [prefix ? slugify(prefix) : null, slugify(scope), stamp].filter(
    Boolean,
  );
  return `${parts.join("-")}.${format}`;
}
