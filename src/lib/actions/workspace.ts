"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export type ActionResult<T = { id: string }> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const ALLOWED_CURRENCIES = new Set([
  "PKR", "USD", "EUR", "GBP", "CAD", "INR", "AED", "SAR",
]);

const TIMEZONE_RE = /^[A-Za-z][A-Za-z0-9_+\-/]{1,63}$/;
const HHMM_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function parseHHmm(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!HHMM_RE.test(trimmed)) return null;
  const [h, m] = trimmed.split(":");
  return `${h!.padStart(2, "0")}:${m}`;
}

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHoursInput = { open: string | null; close: string | null };

export type UpdateWorkspaceInput = {
  name: string;
  legalEntity?: string | null;
  taxId?: string | null;
  phone?: string | null;
  currency: string;
  timezone: string;
  city?: string | null;
  addressLine?: string | null;
  receiptFooter?: string | null;
  receiptWidth?: "80" | "58";
  hours: Record<DayKey, DayHoursInput>;
};

type Hours = {
  hoursMonOpen: string | null; hoursMonClose: string | null;
  hoursTueOpen: string | null; hoursTueClose: string | null;
  hoursWedOpen: string | null; hoursWedClose: string | null;
  hoursThuOpen: string | null; hoursThuClose: string | null;
  hoursFriOpen: string | null; hoursFriClose: string | null;
  hoursSatOpen: string | null; hoursSatClose: string | null;
  hoursSunOpen: string | null; hoursSunClose: string | null;
};

const DAY_FIELDS: Record<DayKey, { open: keyof Hours; close: keyof Hours }> = {
  mon: { open: "hoursMonOpen", close: "hoursMonClose" },
  tue: { open: "hoursTueOpen", close: "hoursTueClose" },
  wed: { open: "hoursWedOpen", close: "hoursWedClose" },
  thu: { open: "hoursThuOpen", close: "hoursThuClose" },
  fri: { open: "hoursFriOpen", close: "hoursFriClose" },
  sat: { open: "hoursSatOpen", close: "hoursSatClose" },
  sun: { open: "hoursSunOpen", close: "hoursSunClose" },
};

export async function updateWorkspaceAction(
  input: UpdateWorkspaceInput,
): Promise<ActionResult> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 60) {
    return { ok: false, error: "Café name must be 2–60 characters" };
  }

  const currency = input.currency.trim().toUpperCase();
  if (!ALLOWED_CURRENCIES.has(currency)) {
    return { ok: false, error: "Unsupported currency" };
  }

  const timezone = input.timezone.trim();
  if (!TIMEZONE_RE.test(timezone)) {
    return { ok: false, error: "Time zone is malformed" };
  }

  const hoursPatch: Partial<Hours> = {};
  for (const day of Object.keys(DAY_FIELDS) as DayKey[]) {
    const pair = input.hours[day];
    const open = parseHHmm(pair?.open);
    const close = parseHHmm(pair?.close);
    if (!open || !close) {
      hoursPatch[DAY_FIELDS[day].open] = null;
      hoursPatch[DAY_FIELDS[day].close] = null;
    } else {
      hoursPatch[DAY_FIELDS[day].open] = open;
      hoursPatch[DAY_FIELDS[day].close] = close;
    }
  }

  const receiptWidth = input.receiptWidth === "58" ? "58" : "80";

  const data = {
    id: "default",
    name,
    legalEntity: input.legalEntity?.trim() || null,
    taxId: input.taxId?.trim() || null,
    phone: input.phone?.trim() || null,
    currency,
    timezone,
    city: input.city?.trim() || null,
    addressLine: input.addressLine?.trim() || null,
    receiptFooter: input.receiptFooter?.trim() || null,
    receiptWidth,
    ...hoursPatch,
  };

  try {
    const { error } = await supabase
      .from("Workspace")
      .upsert(data, { onConflict: "id" });
    if (error) throw error;
    revalidatePath("/", "layout");
    return { ok: true, data: { id: "default" } };
  } catch (err) {
    console.error("updateWorkspaceAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to save workspace",
    };
  }
}
