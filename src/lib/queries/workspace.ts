import "server-only";

import { prisma } from "@/lib/prisma";

export const DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type WeekDay = (typeof DAYS)[number];

export type DayHours = {
  /** "HH:mm" or null = closed. */
  open: string | null;
  close: string | null;
};

export type ReceiptWidth = "80" | "58";

export type Workspace = {
  id: string;
  name: string;
  legalEntity: string | null;
  taxId: string | null;
  phone: string | null;
  currency: string;
  timezone: string;
  city: string | null;
  addressLine: string | null;
  receiptFooter: string | null;
  receiptWidth: ReceiptWidth;
  hours: Record<WeekDay, DayHours>;
  updatedAt: string;
};

/**
 * Read the singleton workspace row. If absent (fresh DB), returns
 * `null` — callers that need a guaranteed row (settings page,
 * onboarding) call `ensureWorkspace()` first.
 */
export async function getWorkspace(): Promise<Workspace | null> {
  const row = await prisma.workspace.findUnique({ where: { id: "default" } });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    legalEntity: row.legalEntity,
    taxId: row.taxId,
    phone: row.phone,
    currency: row.currency,
    timezone: row.timezone,
    city: row.city,
    addressLine: row.addressLine,
    receiptFooter: row.receiptFooter,
    receiptWidth: row.receiptWidth === "58" ? "58" : "80",
    hours: {
      mon: { open: row.hoursMonOpen, close: row.hoursMonClose },
      tue: { open: row.hoursTueOpen, close: row.hoursTueClose },
      wed: { open: row.hoursWedOpen, close: row.hoursWedClose },
      thu: { open: row.hoursThuOpen, close: row.hoursThuClose },
      fri: { open: row.hoursFriOpen, close: row.hoursFriClose },
      sat: { open: row.hoursSatOpen, close: row.hoursSatClose },
      sun: { open: row.hoursSunOpen, close: row.hoursSunClose },
    },
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * Convenience: returns the workspace (creating one with defaults if
 * missing). Use in surfaces that must render *something*, like the
 * sidebar — never returns null.
 */
export async function getOrCreateWorkspace(): Promise<Workspace> {
  const existing = await getWorkspace();
  if (existing) return existing;
  await prisma.workspace.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
  const row = await getWorkspace();
  if (!row) throw new Error("Failed to create workspace");
  return row;
}
