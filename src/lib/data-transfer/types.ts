/**
 * Shared types for the global data import/export system.
 *
 * This file is import-safe on both the client and the server — it holds
 * only plain types and no Prisma / Node imports. The server-only data
 * fetching + import writing lives in `modules.server.ts`; the client-safe
 * column metadata lives in `registry.ts`; the file formatters
 * (`format-*.ts`) are also client-safe.
 */

/** Logical column value kind — drives formatting in every exporter. */
export type ColumnType =
  | "text"
  | "integer"
  | "number"
  | "money"
  | "date"
  | "datetime"
  | "boolean";

export interface ColumnDef {
  /** Machine key — matches the row object key. */
  key: string;
  /** Human header used in CSV/XLSX/PDF and as the import column name. */
  header: string;
  type: ColumnType;
  /** Approx. character width hint for XLSX columns / PDF layout. */
  width?: number;
  /** Required when importing — a missing/empty value fails validation. */
  required?: boolean;
}

/** The eight first-class modules the system can move in and out. */
export type ModuleKey =
  | "orders"
  | "menu"
  | "inventory"
  | "suppliers"
  | "staff"
  | "expenses"
  | "customers"
  | "paymentMethods";

export interface ModuleMeta {
  key: ModuleKey;
  /** Display label, e.g. "Orders". */
  label: string;
  /** XLSX sheet name (≤ 31 chars, unique, no special chars). */
  sheetName: string;
  description: string;
  columns: ColumnDef[];
  /** Primary-key column used for duplicate detection on import. */
  idField: string;
  exportable: boolean;
  /** Some modules (orders, customers) are export-only — see registry. */
  importable: boolean;
}

/** A single exported/imported record. Values are JSON-serialisable. */
export type DataRow = Record<string, string | number | boolean | null>;

/** A module's metadata bundled with its actual rows — self-contained so
 * the formatters never need to reach back into the registry. */
export interface ModuleDataset {
  key: ModuleKey;
  label: string;
  sheetName: string;
  columns: ColumnDef[];
  idField: string;
  rows: DataRow[];
}

/** Workspace-driven branding stamped onto XLSX headers and PDF
 * headers/footers. Sourced from Settings → Workspace. */
export interface ExportBranding {
  cafeName: string;
  addressLine: string | null;
  city: string | null;
  phone: string | null;
  /** ISO 4217 code driving money formatting in exports. */
  currencyCode: string;
  /** Static path under /public; resolved client-side for PDF. */
  logoUrl: string;
  /** ISO timestamp of when the export was generated. */
  generatedAt: string;
}

export interface ExportBundle {
  branding: ExportBranding;
  datasets: ModuleDataset[];
}

export type ExportFormat = "csv" | "xlsx" | "json" | "pdf";

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: "CSV",
  xlsx: "Excel (XLSX)",
  json: "JSON",
  pdf: "PDF",
};

/** Per-module outcome of an import run. */
export interface ImportModuleResult {
  key: ModuleKey;
  label: string;
  /** Rows present in the source for this module. */
  total: number;
  inserted: number;
  /** Skipped because the id already exists (duplicate). */
  skipped: number;
  /** Per-row validation/insert failures (human-readable). */
  errors: string[];
}

export interface ImportResult {
  ok: boolean;
  /** Set when the whole run failed before touching any module. */
  error?: string;
  modules: ImportModuleResult[];
}

/** A parsed sheet from an uploaded file, before module mapping. */
export interface ParsedSheet {
  /** Raw sheet name (XLSX) or file stem (CSV/JSON). */
  name: string;
  /** Header row, in source order. */
  headers: string[];
  /** Data rows keyed by header. */
  rows: Record<string, string>[];
  /** Module the sheet was matched to, or null if unrecognised. */
  matchedModule: ModuleKey | null;
}

export interface ParsedImportFile {
  sheets: ParsedSheet[];
  /** Soft warnings (unrecognised sheets, etc.). */
  warnings: string[];
}
