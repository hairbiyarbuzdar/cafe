/**
 * XLSX exporter (xlsx-js-style).
 *
 * Produces ONE workbook with one styled sheet per module. Every sheet
 * opens with a branded header block (café name, address, phone) sourced
 * from Settings → Workspace, then the column headers, then banded data
 * rows. Numeric/money columns stay numeric so Excel can aggregate them.
 */

import * as XLSX from "xlsx-js-style";

import { xlsxCell, xlsxNumberFormat } from "./cells";
import type { ExportBranding, ModuleDataset } from "./types";

// Premium coffee-toned palette, kept consistent with the PDF report.
const BRAND_FILL = "3B2A20"; // deep espresso — title
const HEADER_FILL = "6F4E37"; // coffee — column header band
const BAND_FILL = "F6F3EF"; // warm off-white — zebra striping
const BORDER = "E7E1DA";

const thin = { style: "thin", color: { rgb: BORDER } } as const;
const allBorders = { top: thin, bottom: thin, left: thin, right: thin };

function buildSheet(ds: ModuleDataset, branding: ExportBranding): XLSX.WorkSheet {
  const colCount = ds.columns.length;
  const addressBits = [branding.addressLine, branding.city]
    .filter(Boolean)
    .join(", ");

  // ---- assemble the rows as an array-of-arrays ----------------------
  const titleRow = [branding.cafeName, ...Array(colCount - 1).fill("")];
  const addressRow = [addressBits || "", ...Array(colCount - 1).fill("")];
  const phoneRow = [
    branding.phone ? `Phone: ${branding.phone}` : "",
    ...Array(colCount - 1).fill(""),
  ];
  const metaRow = [
    `${ds.label} · ${ds.rows.length} record${ds.rows.length === 1 ? "" : "s"} · generated ${branding.generatedAt.slice(0, 10)}`,
    ...Array(colCount - 1).fill(""),
  ];
  const blankRow = Array(colCount).fill("");
  const headerRow = ds.columns.map((c) => c.header);
  const dataRows = ds.rows.map((row) =>
    ds.columns.map((c) => xlsxCell(row[c.key] ?? null, c.type)),
  );

  const aoa = [
    titleRow,
    addressRow,
    phoneRow,
    metaRow,
    blankRow,
    headerRow,
    ...dataRows,
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const HEADER_ROW = 5; // 0-indexed row of the column headers
  const FIRST_DATA_ROW = HEADER_ROW + 1;

  // Merge the four branding rows across all columns.
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: colCount - 1 } },
  ];

  // Column widths from the registry hints.
  ws["!cols"] = ds.columns.map((c) => ({ wch: c.width ?? 16 }));
  ws["!rows"] = [{ hpt: 22 }, { hpt: 16 }, { hpt: 16 }, { hpt: 15 }];

  const setStyle = (r: number, c: number, s: XLSX.CellObject["s"]) => {
    const ref = XLSX.utils.encode_cell({ r, c });
    const cell = ws[ref] as XLSX.CellObject | undefined;
    if (cell) cell.s = s;
  };

  // Branding rows.
  setStyle(0, 0, {
    font: { bold: true, sz: 16, color: { rgb: BRAND_FILL } },
    alignment: { horizontal: "left", vertical: "center" },
  });
  setStyle(1, 0, {
    font: { sz: 10, color: { rgb: "6B6B6B" } },
    alignment: { horizontal: "left" },
  });
  setStyle(2, 0, {
    font: { sz: 10, color: { rgb: "6B6B6B" } },
    alignment: { horizontal: "left" },
  });
  setStyle(3, 0, {
    font: { italic: true, sz: 9, color: { rgb: "9A8C7E" } },
    alignment: { horizontal: "left" },
  });

  // Column header band.
  for (let c = 0; c < colCount; c++) {
    setStyle(HEADER_ROW, c, {
      font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: HEADER_FILL } },
      alignment: { horizontal: "left", vertical: "center" },
      border: allBorders,
    });
  }

  // Data rows: zebra striping + numeric formats + borders.
  for (let i = 0; i < dataRows.length; i++) {
    const r = FIRST_DATA_ROW + i;
    const banded = i % 2 === 1;
    for (let c = 0; c < colCount; c++) {
      const colType = ds.columns[c]!.type;
      const numFmt = xlsxNumberFormat(colType);
      const isNumeric =
        colType === "money" || colType === "number" || colType === "integer";
      setStyle(r, c, {
        font: { sz: 10, color: { rgb: "2A2118" } },
        fill: banded
          ? { patternType: "solid", fgColor: { rgb: BAND_FILL } }
          : undefined,
        alignment: { horizontal: isNumeric ? "right" : "left", vertical: "center" },
        border: allBorders,
        ...(numFmt ? { numFmt } : {}),
      });
    }
  }

  ws["!autofilter"] = {
    ref: XLSX.utils.encode_range(
      { r: HEADER_ROW, c: 0 },
      { r: FIRST_DATA_ROW + Math.max(dataRows.length - 1, 0), c: colCount - 1 },
    ),
  };

  return ws;
}

export function datasetsToXlsx(
  datasets: ModuleDataset[],
  branding: ExportBranding,
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  for (const ds of datasets) {
    const ws = buildSheet(ds, branding);
    // Sheet names are capped at 31 chars and must be unique.
    const name = ds.sheetName.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  return XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
}
