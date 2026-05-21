/**
 * Client-safe value helpers shared by every formatter.
 *
 * Two rendering modes:
 *  - `rawCell`     → machine-friendly strings for CSV (numbers stay plain,
 *                    dates stay ISO, booleans become true/false) so an
 *                    exported file re-imports losslessly.
 *  - `displayCell` → human-friendly strings for PDF (grouped numbers,
 *                    formatted money/dates, Yes/No booleans).
 *  - `xlsxCell`    → typed value for XLSX (real numbers stay numeric so
 *                    Excel can sum them; everything else is a string).
 */

import { CURRENCIES, DEFAULT_CURRENCY, formatMoney } from "@/lib/currency";
import type { ColumnType } from "./types";

type Primitive = string | number | boolean | null;

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** ISO/parseable date → "YYYY-MM-DD". Empty string for null/invalid. */
export function isoDate(value: Primitive): string {
  if (value == null || value === "") return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** ISO/parseable date → "YYYY-MM-DD HH:mm". */
export function isoDateTime(value: Primitive): string {
  if (value == null || value === "") return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${isoDate(value)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function moneyConfig(currencyCode: string) {
  return (
    (CURRENCIES as Record<string, typeof DEFAULT_CURRENCY>)[currencyCode] ??
    DEFAULT_CURRENCY
  );
}

/** Machine-friendly cell for CSV — round-trips back through import. */
export function rawCell(value: Primitive, type: ColumnType): string {
  if (value == null) return "";
  switch (type) {
    case "boolean":
      return value ? "true" : "false";
    case "date":
      return isoDate(value);
    case "datetime":
      // Server rows carry ISO strings already; keep them lossless for CSV.
      return String(value);
    case "money":
    case "number":
    case "integer":
      return typeof value === "number" ? String(value) : String(value);
    default:
      return String(value);
  }
}

/** Human-friendly cell for PDF tables. */
export function displayCell(
  value: Primitive,
  type: ColumnType,
  currencyCode: string,
): string {
  if (value == null || value === "") return "—";
  switch (type) {
    case "boolean":
      return value ? "Yes" : "No";
    case "date":
      return isoDate(value);
    case "datetime":
      return isoDateTime(value);
    case "money": {
      const n = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(n)) return String(value);
      return formatMoney(n, {}, moneyConfig(currencyCode));
    }
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(n)) return String(value);
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 3,
      }).format(n);
    }
    case "integer": {
      const n = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(n)) return String(value);
      return new Intl.NumberFormat("en-US").format(n);
    }
    default:
      return String(value);
  }
}

/** Typed XLSX cell value — numerics stay numbers so Excel can aggregate. */
export function xlsxCell(value: Primitive, type: ColumnType): string | number {
  if (value == null || value === "") return "";
  switch (type) {
    case "money":
    case "number":
    case "integer": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isNaN(n) ? String(value) : n;
    }
    case "boolean":
      return value ? "Yes" : "No";
    case "date":
      return isoDate(value);
    case "datetime":
      return isoDateTime(value);
    default:
      return String(value);
  }
}

/** Number format code applied to money/number XLSX columns. */
export function xlsxNumberFormat(type: ColumnType): string | undefined {
  switch (type) {
    case "money":
      return "#,##0.00";
    case "number":
      return "#,##0.###";
    case "integer":
      return "#,##0";
    default:
      return undefined;
  }
}
