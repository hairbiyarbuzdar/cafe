"use client";

import * as React from "react";
import JsBarcode from "jsbarcode";

/**
 * Code 128 barcode rendered inline as SVG. Mounted via a ref so
 * JsBarcode (which is DOM-driven) gets a real SVG element to draw
 * into. The same `value` is also displayed beneath the bars so a
 * cashier can verify by sight even if their scanner is offline.
 *
 * Uses Code 128 because it covers the alphanumeric receipt numbers
 * we generate (e.g. "BR-5810", "L-K2A4F") in a denser footprint than
 * Code 39 would.
 */
export function Barcode({
  value,
  height = 36,
  width = 1.4,
  displayValue = true,
  className,
}: {
  value: string;
  height?: number;
  width?: number;
  displayValue?: boolean;
  className?: string;
}) {
  const ref = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    if (!value) return;
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        height,
        width,
        displayValue,
        font: "monospace",
        fontSize: 10,
        margin: 0,
        background: "transparent",
        lineColor: "#000",
      });
    } catch {
      // Invalid characters for Code 128 — render an empty <svg/>
      // rather than crashing the receipt preview.
    }
  }, [value, height, width, displayValue]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={`Barcode for ${value}`}
      className={className}
    />
  );
}

/**
 * Generate a PNG data URL for the same Code 128 barcode, suitable
 * for embedding in jsPDF via `doc.addImage(...)`. Runs in the
 * browser only — JsBarcode needs a DOM (`HTMLCanvasElement`).
 *
 * Returns `null` if the input can't be encoded — callers should
 * skip the addImage step rather than aborting the whole PDF.
 */
export function barcodeDataUrl(
  value: string,
  options: { height?: number; width?: number } = {},
): string | null {
  if (typeof document === "undefined" || !value) return null;
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      height: options.height ?? 50,
      width: options.width ?? 1.6,
      displayValue: true,
      font: "monospace",
      fontSize: 12,
      margin: 0,
      background: "#ffffff",
      lineColor: "#000000",
    });
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
