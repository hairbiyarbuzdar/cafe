"use client";

import type { ReceiptPayload } from "@/features/receipts/receipt-preview-dialog";
import {
  getCachedPrinter,
  isWebSerialSupported,
  printEscPos,
} from "@/lib/print/escpos";
import {
  buildInventorySlipBytes,
  buildKitchenTicketBytes,
  buildPaymentReceiptBytes,
} from "@/lib/print/escpos-receipt";

/** Render a receipt payload to raw ESC/POS bytes. */
export function receiptToBytes(p: ReceiptPayload): Uint8Array {
  switch (p.kind) {
    case "payment":
      return buildPaymentReceiptBytes(p.data);
    case "kitchen":
      return buildKitchenTicketBytes(p.data);
    case "inventory":
      return buildInventorySlipBytes(p.data);
  }
}

/**
 * Best-effort silent print to a previously-paired thermal printer.
 *
 * Returns `true` when every receipt was sent to the printer, `false`
 * when no printer is available (Web Serial unsupported, or none paired
 * yet) so the caller can fall back to the on-screen preview modal.
 * Throws if a paired printer is reachable but the write fails, so the
 * caller can surface a printer error.
 *
 * The point: once a thermal printer is paired on the device, placement
 * prints with zero extra clicks — no code change needed to "turn on"
 * auto-print. Until then, callers show the preview modal.
 *
 * Receipts print one after another (each its own paper cut), which
 * covers both a single shared kitchen printer rolling out one ticket
 * per station and the single-receipt payment case.
 */
export async function tryAutoPrintReceipts(
  receipts: ReceiptPayload[],
): Promise<boolean> {
  if (receipts.length === 0) return true;
  if (!isWebSerialSupported()) return false;

  let port;
  try {
    port = await getCachedPrinter();
  } catch {
    return false;
  }
  if (!port) return false;

  for (const receipt of receipts) {
    await printEscPos(receiptToBytes(receipt));
  }
  return true;
}
