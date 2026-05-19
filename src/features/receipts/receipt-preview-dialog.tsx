"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Download,
  Loader2,
  Plug,
  Printer,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventorySlip } from "@/features/receipts/inventory-slip";
import { KitchenTicket } from "@/features/receipts/kitchen-ticket";
import { PaymentReceipt } from "@/features/receipts/payment-receipt";
import type {
  InventorySlipData,
  KitchenTicketData,
  PaymentReceiptData,
} from "@/features/receipts/receipt-models";
import {
  isWebSerialSupported,
  printEscPos,
  requestPrinter,
} from "@/lib/print/escpos";
import {
  buildInventorySlipBytes,
  buildKitchenTicketBytes,
  buildPaymentReceiptBytes,
} from "@/lib/print/escpos-receipt";
import {
  generateInventorySlipPdf,
  generateKitchenTicketPdf,
  generatePaymentReceiptPdf,
} from "@/lib/print/pdf-receipt";

export type ReceiptPayload =
  | { kind: "payment"; data: PaymentReceiptData }
  | { kind: "kitchen"; data: KitchenTicketData }
  | { kind: "inventory"; data: InventorySlipData };

/**
 * Single dialog that previews any receipt variant and exposes the
 * three print paths:
 *   - **Print thermal** — Web Serial → ESC/POS bytes
 *   - **Print to OS**   — window.print() with the receipt as the
 *                          only visible content
 *   - **Download PDF**  — jspdf, sized to the workspace roll width
 *
 * The Web Serial path needs Chrome/Edge desktop and a user-granted
 * port pairing; the other two are universal fallbacks.
 */
export function ReceiptPreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  receipts,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Array so callers can show multiple receipts at once (e.g. one
   *  kitchen ticket per routed station after placing an order). */
  receipts: ReceiptPayload[];
}) {
  const [index, setIndex] = React.useState(0);
  const [printing, setPrinting] = React.useState<"thermal" | "pdf" | "os" | null>(
    null,
  );
  const webSerial = React.useMemo(() => isWebSerialSupported(), []);

  React.useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  const current = receipts[index];
  if (!current) return null;

  async function printThermal() {
    setPrinting("thermal");
    try {
      // For multi-receipt sets (kitchen tickets), print all of them.
      const items = receipts;
      for (const r of items) {
        const bytes = bytesFor(r);
        await printEscPos(bytes);
      }
      toast.success(
        items.length === 1
          ? "Sent to printer"
          : `Sent ${items.length} receipts to printer`,
      );
      onOpenChange(false);
    } catch (err) {
      toast.error("Couldn't reach the printer", {
        description:
          err instanceof Error ? err.message : "Unknown printer error",
      });
    } finally {
      setPrinting(null);
    }
  }

  async function pairPrinter() {
    try {
      const port = await requestPrinter();
      if (port) toast.success("Printer paired");
    } catch (err) {
      // User cancelling the picker shows up as "NotFoundError" — swallow.
      const msg = err instanceof Error ? err.message : String(err);
      if (!/NotFoundError|canceled/i.test(msg)) {
        toast.error("Couldn't pair printer", { description: msg });
      }
    }
  }

  function downloadPdf() {
    setPrinting("pdf");
    try {
      receipts.forEach((r, i) => {
        const doc = pdfFor(r);
        doc.save(filenameFor(r, i));
      });
      toast.success(
        receipts.length === 1 ? "Receipt downloaded" : `${receipts.length} PDFs downloaded`,
      );
    } catch (err) {
      toast.error("Couldn't generate PDF", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setPrinting(null);
    }
  }

  function printOs() {
    setPrinting("os");
    // Two body classes drive the print stylesheet:
    //   `receipt-printing`   — flips visibility to the print stack;
    //   `print-roll-{80,58}` — selects the named @page rule + clamps
    //                          the receipt width so it doesn't
    //                          stretch across an A4 page if the
    //                          driver falls back to default paper.
    // The print stack itself is a direct child of <body>, so it
    // escapes the Dialog portal's transform + ScrollArea's overflow
    // ancestors that previously clipped everything except the header.
    const widthClass =
      receipts[0]?.data.header.workspace.receiptWidth === "58"
        ? "print-roll-58"
        : "print-roll-80";
    document.body.classList.add("receipt-printing", widthClass);

    const cleanup = () => {
      document.body.classList.remove("receipt-printing", widthClass);
      window.removeEventListener("afterprint", cleanup);
      setPrinting(null);
    };
    window.addEventListener("afterprint", cleanup);
    // Give the layout a tick to apply the class before printing —
    // Chrome occasionally races otherwise.
    setTimeout(() => {
      window.print();
    }, 50);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-receipt-dialog
        className="flex max-h-[92dvh] w-[min(560px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[560px]"
      >
        <DialogHeader className="border-b px-5 pb-3 pt-4 print:hidden">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-[12.5px]">
              {description}
            </DialogDescription>
          ) : null}
          {receipts.length > 1 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {receipts.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={index === i}
                  className={
                    "rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors " +
                    (index === i
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted")
                  }
                >
                  {tabLabel(r)}
                </button>
              ))}
            </div>
          ) : null}
        </DialogHeader>

        <ScrollArea className="flex-1 bg-muted/40 px-3 py-4">
          {renderReceipt(current)}
        </ScrollArea>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-surface-1 px-5 py-3 print:hidden">
          {webSerial ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={pairPrinter}
              disabled={printing !== null}
            >
              <Plug className="size-3.5" />
              Pair printer
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={printOs}
            disabled={printing !== null}
          >
            {printing === "os" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Printer className="size-3.5" />
            )}
            OS print
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={downloadPdf}
            disabled={printing !== null}
          >
            {printing === "pdf" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Download PDF
          </Button>

          {webSerial ? (
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={printThermal}
              disabled={printing !== null}
              title={
                receipts.length > 1
                  ? `Sends all ${receipts.length} receipts to the paired thermal printer`
                  : "Sends to the paired thermal printer over Web Serial"
              }
            >
              {printing === "thermal" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Printing…
                </>
              ) : (
                <>
                  <Printer className="size-3.5" />
                  Print thermal
                </>
              )}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={printing !== null}
          >
            <X className="size-3.5" />
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Body-attached print stack — kept hidden on screen via the
       * `.receipt-print-stack` class in globals.css, revealed only
       * when the cashier hits OS print (we add a `receipt-printing`
       * class on <body> for the duration of the print dialog). Being
       * a direct child of <body> means it escapes the Radix Dialog
       * portal's transform context, so the receipt isn't clipped to
       * the scroll viewport. */}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="receipt-print-stack" aria-hidden>
              {receipts.map((r, i) => (
                <div key={i} className="receipt-print-page">
                  {renderReceipt(r)}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </Dialog>
  );
}

function renderReceipt(p: ReceiptPayload): React.ReactNode {
  switch (p.kind) {
    case "payment":
      return <PaymentReceipt data={p.data} />;
    case "kitchen":
      return <KitchenTicket data={p.data} />;
    case "inventory":
      return <InventorySlip data={p.data} />;
  }
}

function tabLabel(p: ReceiptPayload): string {
  switch (p.kind) {
    case "payment":
      return p.data.receiptNumber;
    case "kitchen":
      return p.data.stationName;
    case "inventory":
      return p.data.direction === "IN" ? "In" : "Out";
  }
}

function bytesFor(p: ReceiptPayload): Uint8Array {
  switch (p.kind) {
    case "payment":
      return buildPaymentReceiptBytes(p.data);
    case "kitchen":
      return buildKitchenTicketBytes(p.data);
    case "inventory":
      return buildInventorySlipBytes(p.data);
  }
}

function pdfFor(p: ReceiptPayload) {
  switch (p.kind) {
    case "payment":
      return generatePaymentReceiptPdf(p.data);
    case "kitchen":
      return generateKitchenTicketPdf(p.data);
    case "inventory":
      return generateInventorySlipPdf(p.data);
  }
}

function filenameFor(p: ReceiptPayload, index: number): string {
  switch (p.kind) {
    case "payment":
      return `receipt-${p.data.orderNumber.replace(/[^\w-]/g, "")}.pdf`;
    case "kitchen":
      return `kitchen-${p.data.orderNumber.replace(/[^\w-]/g, "")}-${p.data.stationName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    case "inventory":
      return `inventory-${p.data.direction.toLowerCase()}-${p.data.movementId}-${index + 1}.pdf`;
  }
}
