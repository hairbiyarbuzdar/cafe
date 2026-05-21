/**
 * CSV exporter. A single module produces a plain table; a multi-module
 * (full-system) export concatenates labelled sections separated by a
 * blank line, since CSV has no native multi-sheet concept (use XLSX for
 * true multi-sheet output).
 */

import { rawCell } from "./cells";
import type { ModuleDataset } from "./types";

function escape(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function datasetToRows(ds: ModuleDataset): string[] {
  const header = ds.columns.map((c) => escape(c.header)).join(",");
  const body = ds.rows.map((row) =>
    ds.columns.map((c) => escape(rawCell(row[c.key] ?? null, c.type))).join(","),
  );
  return [header, ...body];
}

export function datasetsToCsv(datasets: ModuleDataset[]): string {
  if (datasets.length === 1) {
    return datasetToRows(datasets[0]!).join("\r\n");
  }
  const blocks = datasets.map((ds) =>
    [`# ${ds.label} (${ds.rows.length})`, ...datasetToRows(ds)].join("\r\n"),
  );
  return blocks.join("\r\n\r\n");
}
