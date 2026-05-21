/**
 * Client-side import parsing.
 *
 * Turns an uploaded File (CSV / XLSX / JSON) into a normalised
 * `ParsedImportFile`: a list of sheets, each matched to a module where
 * possible. Handles:
 *  - multi-sheet XLSX (one sheet per module)
 *  - branded XLSX exports (skips the café header block to find the real
 *    column-header row)
 *  - multi-section CSV produced by the full-system CSV export
 *  - JSON exports keyed by module
 *
 * Type coercion + dedupe live server-side (`import.server.ts`); this
 * layer only structures the data and reports detection.
 */

import * as XLSX from "xlsx-js-style";

import { getModule, matchModuleByName, MODULES } from "./registry";
import type {
  DataRow,
  ModuleKey,
  ModuleMeta,
  ParsedImportFile,
  ParsedSheet,
} from "./types";

const norm = (s: string): string =>
  s.trim().toLowerCase().replace(/[\s_-]+/g, "");

/** Map a source header cell to a module column key (by header or key). */
export function mapHeaderToKey(meta: ModuleMeta, header: string): string | null {
  const n = norm(header);
  for (const c of meta.columns) {
    if (norm(c.header) === n || norm(c.key) === n) return c.key;
  }
  return null;
}

/** Build the importer payload row (keyed by column key) for a sheet. */
export function rowsForModule(
  sheet: ParsedSheet,
  key: ModuleKey,
): Record<string, string>[] {
  const meta = getModule(key);
  const headerKeys = sheet.headers.map((h) => mapHeaderToKey(meta, h));
  return sheet.rows.map((row) => {
    const out: Record<string, string> = {};
    sheet.headers.forEach((h, i) => {
      const k = headerKeys[i];
      if (k) out[k] = row[h] ?? "";
    });
    return out;
  });
}

// ---- CSV ------------------------------------------------------------

/** Minimal RFC-4180-ish CSV parser (handles quotes + embedded newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore — handled by \n
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const SECTION_RE = /^#\s*(.+?)\s*\(\d+\)\s*$/;

function csvToSheets(text: string, fallbackName: string): ParsedSheet[] {
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (!rows.length) return [];

  // Multi-section full-system CSV → split on "# Label (n)" markers.
  const hasSections = rows.some((r) => r.length === 1 && SECTION_RE.test(r[0]!));
  if (hasSections) {
    const sheets: ParsedSheet[] = [];
    let current: { name: string; rows: string[][] } | null = null;
    for (const r of rows) {
      const m = r.length === 1 ? SECTION_RE.exec(r[0]!) : null;
      if (m) {
        if (current) sheets.push(tableToSheet(current.name, current.rows));
        current = { name: m[1]!, rows: [] };
      } else if (current) {
        current.rows.push(r);
      }
    }
    if (current) sheets.push(tableToSheet(current.name, current.rows));
    return sheets;
  }

  return [tableToSheet(fallbackName, rows)];
}

// ---- shared header detection ---------------------------------------

/**
 * Given an array-of-arrays, locate the column-header row and return the
 * structured sheet. Skips branding rows by matching against the module's
 * expected headers when the sheet name is recognised.
 */
function tableToSheet(name: string, aoa: string[][]): ParsedSheet {
  const matched = matchModuleByName(name);
  let headerIdx = 0;

  if (matched) {
    const expected = MODULES[matched].columns.map((c) => norm(c.header));
    let best = -1;
    let bestScore = 0;
    aoa.forEach((r, i) => {
      const score = r.filter((c) => expected.includes(norm(String(c)))).length;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best >= 0 && bestScore >= 1) headerIdx = best;
  } else {
    // First row with ≥2 non-empty cells is assumed to be the header.
    headerIdx = aoa.findIndex(
      (r) => r.filter((c) => String(c).trim() !== "").length >= 2,
    );
    if (headerIdx < 0) headerIdx = 0;
  }

  const headers = (aoa[headerIdx] ?? []).map((c) => String(c).trim());
  const dataRows = aoa.slice(headerIdx + 1);
  const rows = dataRows
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        if (h) obj[h] = r[i] == null ? "" : String(r[i]);
      });
      return obj;
    })
    .filter((obj) => Object.values(obj).some((v) => v.trim() !== ""));

  return { name, headers, rows, matchedModule: matched };
}

// ---- XLSX -----------------------------------------------------------

async function xlsxToSheets(file: File): Promise<ParsedSheet[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  return wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName]!;
    const aoa = XLSX.utils.sheet_to_json<string[]>(ws, {
      header: 1,
      blankrows: false,
      defval: "",
      raw: false,
    });
    return tableToSheet(sheetName, aoa as string[][]);
  });
}

// ---- JSON -----------------------------------------------------------

function jsonToSheets(text: string, fallbackName: string): ParsedSheet[] {
  const data = JSON.parse(text);
  const sheets: ParsedSheet[] = [];

  const arrayToSheet = (name: string, arr: unknown[]): ParsedSheet | null => {
    const rows = arr.filter((r) => r && typeof r === "object") as DataRow[];
    const headerSet = new Set<string>();
    rows.forEach((r) => Object.keys(r).forEach((k) => headerSet.add(k)));
    const headers = [...headerSet];
    return {
      name,
      headers,
      rows: rows.map((r) => {
        const o: Record<string, string> = {};
        headers.forEach((h) => {
          const v = (r as DataRow)[h];
          o[h] = v == null ? "" : String(v);
        });
        return o;
      }),
      matchedModule: matchModuleByName(name),
    };
  };

  if (Array.isArray(data)) {
    const s = arrayToSheet(fallbackName, data);
    if (s) sheets.push(s);
  } else if (data && typeof data === "object") {
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith("_")) continue; // skip _meta
      if (Array.isArray(v)) {
        const s = arrayToSheet(k, v);
        if (s) sheets.push(s);
      }
    }
  }
  return sheets;
}

// ---- entry point ----------------------------------------------------

export async function parseImportFile(file: File): Promise<ParsedImportFile> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const stem = file.name.replace(/\.[^.]+$/, "");
  let sheets: ParsedSheet[] = [];

  if (ext === "xlsx" || ext === "xls") {
    sheets = await xlsxToSheets(file);
  } else if (ext === "csv") {
    sheets = csvToSheets(await file.text(), stem);
  } else if (ext === "json") {
    sheets = jsonToSheets(await file.text(), stem);
  } else {
    throw new Error(
      `Unsupported file type ".${ext}". Use CSV, XLSX, or JSON.`,
    );
  }

  const warnings: string[] = [];
  for (const s of sheets) {
    if (!s.matchedModule) {
      warnings.push(`Sheet "${s.name}" didn't match any module — skipped.`);
    } else if (!getModule(s.matchedModule).importable) {
      warnings.push(
        `"${getModule(s.matchedModule).label}" is export-only and can't be imported — skipped.`,
      );
    }
  }
  return { sheets, warnings };
}
