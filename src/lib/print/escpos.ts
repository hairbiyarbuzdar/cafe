"use client";

/**
 * Tiny ESC/POS command builder + Web Serial driver.
 *
 * Targets the most common thermal printer dialect (Epson TM-* / Star
 * TSP-* / generic 80mm clones). The builder produces a `Uint8Array`
 * of raw bytes which `printEscPos()` ships out the serial port.
 *
 * Browser support: requires the **Web Serial API** (`navigator.serial`),
 * which is shipped in Chromium-based browsers on desktop OSes. Firefox
 * + Safari don't implement it — `isWebSerialSupported()` lets callers
 * fall back to the OS print dialog or PDF download gracefully.
 *
 * The first call to `requestPrinter()` shows the native printer
 * picker; we cache the chosen port on `navigator.serial.getPorts()`
 * so subsequent prints reuse the pairing without re-prompting.
 */

// ──────────────────────────────────────────────────────────────
// Browser capability detection
// ──────────────────────────────────────────────────────────────

export function isWebSerialSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return "serial" in navigator;
}

// ──────────────────────────────────────────────────────────────
// ESC/POS command bytes
// ──────────────────────────────────────────────────────────────

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

export const ALIGN_LEFT = 0;
export const ALIGN_CENTER = 1;
export const ALIGN_RIGHT = 2;

export class EscPosBuilder {
  private chunks: number[] = [];
  private columnWidth: number;

  /** `columns` = characters per line. 80mm rolls usually fit 42 in
   * the default Font A; 58mm rolls fit 32. */
  constructor(columns: number = 42) {
    this.columnWidth = columns;
    // Init printer + UTF-8 codepage so non-ASCII (Pakistan Rupee
    // sign, café accents) survives the trip.
    this.chunks.push(ESC, 0x40);
    this.chunks.push(ESC, 0x74, 6); // codepage 6 = approximately latin-1 / Win-1252
  }

  get columns(): number {
    return this.columnWidth;
  }

  align(value: 0 | 1 | 2): this {
    this.chunks.push(ESC, 0x61, value);
    return this;
  }

  bold(on: boolean): this {
    this.chunks.push(ESC, 0x45, on ? 1 : 0);
    return this;
  }

  /** Double height + width for headers. */
  big(on: boolean): this {
    this.chunks.push(GS, 0x21, on ? 0x11 : 0x00);
    return this;
  }

  /** Underline thickness 0..2. */
  underline(thickness: 0 | 1 | 2): this {
    this.chunks.push(ESC, 0x2d, thickness);
    return this;
  }

  /** Write a single line of text (newline appended). */
  line(text: string = ""): this {
    const bytes = encode(text);
    this.chunks.push(...bytes, LF);
    return this;
  }

  /** Two-column line: left text + right text. Pads with spaces so
   * the right edge lines up with the column width. Truncates the
   * left side if both together don't fit. */
  row(left: string, right: string): this {
    const leftStr = String(left);
    const rightStr = String(right);
    const space = Math.max(1, this.columnWidth - leftStr.length - rightStr.length);
    let line: string;
    if (space >= 1) {
      line = leftStr + " ".repeat(space) + rightStr;
    } else {
      // Truncate left to fit
      const keep = Math.max(0, this.columnWidth - rightStr.length - 1);
      line = leftStr.slice(0, keep) + " " + rightStr;
    }
    return this.line(line);
  }

  rule(char: string = "-"): this {
    return this.line(char.repeat(this.columnWidth));
  }

  blank(lines: number = 1): this {
    for (let i = 0; i < lines; i++) this.chunks.push(LF);
    return this;
  }

  /** Full paper cut. */
  cut(): this {
    this.chunks.push(GS, 0x56, 0x00);
    return this;
  }

  /** Trigger the cash drawer kick connector. Most café printers
   * have one wired to the till. */
  kickDrawer(): this {
    this.chunks.push(ESC, 0x70, 0x00, 0x19, 0xfa);
    return this;
  }

  build(): Uint8Array {
    return new Uint8Array(this.chunks);
  }
}

// ──────────────────────────────────────────────────────────────
// Web Serial transport
// ──────────────────────────────────────────────────────────────

type SerialPortLike = {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  writable: WritableStream<Uint8Array> | null;
};

type NavigatorSerialLike = {
  requestPort: (options?: { filters?: Array<{ usbVendorId?: number }> }) => Promise<SerialPortLike>;
  getPorts: () => Promise<SerialPortLike[]>;
};

function getSerial(): NavigatorSerialLike | null {
  if (typeof navigator === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n = navigator as any;
  return n.serial ?? null;
}

let cachedPort: SerialPortLike | null = null;

/**
 * Prompt the user to pick a thermal printer. Cached for the page
 * lifetime; call `forgetPrinter()` to reset. Shows the native browser
 * device picker the first time.
 */
export async function requestPrinter(): Promise<SerialPortLike | null> {
  const serial = getSerial();
  if (!serial) throw new Error("Web Serial isn't available in this browser");
  const port = await serial.requestPort();
  cachedPort = port;
  return port;
}

export async function getCachedPrinter(): Promise<SerialPortLike | null> {
  if (cachedPort) return cachedPort;
  const serial = getSerial();
  if (!serial) return null;
  const ports = await serial.getPorts();
  cachedPort = ports[0] ?? null;
  return cachedPort;
}

export function forgetPrinter(): void {
  cachedPort = null;
}

/**
 * Ship raw ESC/POS bytes to the configured printer. Opens the port at
 * 9600 baud (sensible default — Epson/Star ship at this rate unless
 * dipswitches say otherwise), writes the payload, and closes again so
 * other prints can reuse the device.
 */
export async function printEscPos(
  bytes: Uint8Array,
  options: { baudRate?: number } = {},
): Promise<void> {
  const port = await getCachedPrinter();
  if (!port) {
    throw new Error("No printer paired. Click \"Connect printer\" first.");
  }

  await port.open({ baudRate: options.baudRate ?? 9600 });
  try {
    if (!port.writable) throw new Error("Printer port isn't writable");
    const writer = port.writable.getWriter();
    try {
      await writer.write(bytes);
    } finally {
      await writer.releaseLock();
    }
  } finally {
    await port.close();
  }
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function encode(text: string): number[] {
  // Best-effort: replace common non-ASCII glyphs with safe fallbacks
  // before passing through TextEncoder. Thermal printers don't ship
  // the full Unicode set; doing this on the way out avoids garbled
  // squares for currency signs and bullet chars.
  const safe = text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/–|—/g, "-")
    .replace(/•/g, "*")
    .replace(/₨/g, "Rs."); // Pakistan Rupee
  return Array.from(new TextEncoder().encode(safe));
}

/** Columns per line, given the active workspace receipt width. */
export function columnsFor(width: "80" | "58"): number {
  return width === "58" ? 32 : 42;
}
