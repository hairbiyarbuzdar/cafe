/**
 * PDF exporter (jsPDF + jspdf-autotable). Client-side only.
 *
 * Every page carries:
 *  - a HEADER: logo (from /public, with a monogram fallback), café name,
 *    address, and city — all from Settings → Workspace;
 *  - a FOOTER strip: "Powered by AddsMint" (left), "System Generated
 *    Report" (center), workspace phone (right);
 *  - PAGE NUMBERS ("1 / 2", "2 / 2") only when the report spans more than
 *    one page — single-page reports show none.
 *
 * Used for both raw data exports and the premium Reports PDFs.
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { displayCell } from "./cells";
import type { ExportBranding, ModuleDataset } from "./types";

const ESPRESSO: [number, number, number] = [59, 42, 32];
const COFFEE: [number, number, number] = [111, 78, 55];
const BAND: [number, number, number] = [246, 243, 239];
const HAIRLINE: [number, number, number] = [225, 219, 211];
const MUTED: [number, number, number] = [122, 110, 98];
const INK: [number, number, number] = [42, 33, 24];

const FOOTER_BRAND = "Powered by AddsMint";
const FOOTER_CENTER = "System Generated Report";

const MARGIN_X = 40;
const HEADER_H = 92;
const FOOTER_H = 52;

export interface PdfOptions {
  /** Report title shown on the right of the header. */
  title?: string;
  /** Smaller line under the title (e.g. active filters / date range). */
  subtitle?: string;
  orientation?: "portrait" | "landscape";
}

interface LoadedLogo {
  dataUrl: string;
  w: number;
  h: number;
  format: "PNG" | "JPEG" | "WEBP";
}

function logoFormat(dataUrl: string): LoadedLogo["format"] | null {
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg"))
    return "JPEG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  // SVG and others aren't supported by jsPDF.addImage — use the monogram.
  return null;
}

async function loadLogo(url: string): Promise<LoadedLogo | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
    const format = logoFormat(dataUrl);
    if (!format) return null;
    const dims = await new Promise<{ w: number; h: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = dataUrl;
      },
    );
    return { dataUrl, format, ...dims };
  } catch {
    return null;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "C";
}

function drawHeader(
  doc: jsPDF,
  branding: ExportBranding,
  logo: LoadedLogo | null,
  opts: PdfOptions,
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const top = 26;
  const box = 42;

  // Logo (image) or monogram fallback.
  if (logo) {
    const scale = Math.min(box / logo.w, box / logo.h);
    const w = logo.w * scale;
    const h = logo.h * scale;
    doc.addImage(logo.dataUrl, logo.format, MARGIN_X, top, w, h);
  } else {
    doc.setFillColor(...ESPRESSO);
    doc.roundedRect(MARGIN_X, top, box, box, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(initials(branding.cafeName), MARGIN_X + box / 2, top + box / 2 + 5, {
      align: "center",
    });
  }

  // Café identity block.
  const tx = MARGIN_X + box + 12;
  doc.setTextColor(...ESPRESSO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(branding.cafeName, tx, top + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  if (branding.addressLine) doc.text(branding.addressLine, tx, top + 28);
  if (branding.city) doc.text(branding.city, tx, top + 39);

  // Report title / subtitle on the right.
  if (opts.title) {
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(opts.title, pageWidth - MARGIN_X, top + 14, { align: "right" });
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const stamp = `Generated ${branding.generatedAt.slice(0, 10)}`;
  doc.text(
    opts.subtitle ? `${opts.subtitle}` : stamp,
    pageWidth - MARGIN_X,
    top + 28,
    { align: "right" },
  );
  if (opts.subtitle) {
    doc.text(stamp, pageWidth - MARGIN_X, top + 39, { align: "right" });
  }

  // Divider under the header.
  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(1);
  doc.line(MARGIN_X, HEADER_H - 6, pageWidth - MARGIN_X, HEADER_H - 6);
}

function drawFooter(
  doc: jsPDF,
  branding: ExportBranding,
  pageNum: number,
  pageCount: number,
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const stripY = pageHeight - 30;

  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(1);
  doc.line(MARGIN_X, stripY - 10, pageWidth - MARGIN_X, stripY - 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);

  doc.text(FOOTER_BRAND, MARGIN_X, stripY);
  doc.text(FOOTER_CENTER, pageWidth / 2, stripY, { align: "center" });
  if (branding.phone) {
    doc.text(branding.phone, pageWidth - MARGIN_X, stripY, { align: "right" });
  }

  // Page numbers only when the report is multi-page.
  if (pageCount > 1) {
    doc.setFontSize(7.5);
    doc.setTextColor(...COFFEE);
    doc.text(`${pageNum} / ${pageCount}`, pageWidth / 2, stripY + 12, {
      align: "center",
    });
  }
}

function alignFor(type: string): "left" | "right" {
  return type === "money" || type === "number" || type === "integer"
    ? "right"
    : "left";
}

export async function datasetsToPdf(
  datasets: ModuleDataset[],
  branding: ExportBranding,
  opts: PdfOptions = {},
): Promise<ArrayBuffer> {
  const orientation =
    opts.orientation ??
    (datasets.some((d) => d.columns.length > 8) ? "landscape" : "portrait");

  const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logo = await loadLogo(branding.logoUrl);

  let cursorY = HEADER_H;

  datasets.forEach((ds, idx) => {
    // Section heading (only for multi-section / full exports).
    const showSection = datasets.length > 1;
    if (idx > 0 && cursorY > pageHeight - FOOTER_H - 80) {
      doc.addPage();
      cursorY = HEADER_H;
    }
    if (showSection) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...ESPRESSO);
      doc.text(`${ds.label}`, MARGIN_X, cursorY + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(
        `${ds.rows.length} record${ds.rows.length === 1 ? "" : "s"}`,
        pageWidth - MARGIN_X,
        cursorY + 6,
        { align: "right" },
      );
      cursorY += 14;
    }

    const head = [ds.columns.map((c) => c.header)];
    const body = ds.rows.map((row) =>
      ds.columns.map((c) =>
        displayCell(row[c.key] ?? null, c.type, branding.currencyCode),
      ),
    );
    const columnStyles: Record<number, { halign: "left" | "right" }> = {};
    ds.columns.forEach((c, i) => {
      columnStyles[i] = { halign: alignFor(c.type) };
    });

    autoTable(doc, {
      head,
      body,
      startY: cursorY + 4,
      margin: { top: HEADER_H, bottom: FOOTER_H, left: MARGIN_X, right: MARGIN_X },
      theme: "grid",
      tableWidth: "auto",
      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: 4,
        textColor: INK,
        lineColor: HAIRLINE,
        lineWidth: 0.5,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: COFFEE,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.5,
        lineColor: COFFEE,
        lineWidth: 0.5,
      },
      alternateRowStyles: { fillColor: BAND },
      columnStyles,
    });

    const finalY =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? cursorY + 20;
    cursorY = finalY + 20;

    if (showSection && ds.rows.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text("No records.", MARGIN_X, finalY + 2);
    }
  });

  // Header + footer on every page, now that the count is known.
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawHeader(doc, branding, logo, opts);
    drawFooter(doc, branding, p, pageCount);
  }

  return doc.output("arraybuffer");
}
