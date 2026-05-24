import "server-only";

import { supabase } from "@/lib/supabase";

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type WeekDay = (typeof DAYS)[number];
export type DayHours = { open: string | null; close: string | null };
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

function rowToWorkspace(row: Record<string, unknown>): Workspace {
  return {
    id: row.id as string,
    name: row.name as string,
    legalEntity: (row.legalEntity as string | null) ?? null,
    taxId: (row.taxId as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    currency: (row.currency as string) ?? "PKR",
    timezone: (row.timezone as string) ?? "Asia/Karachi",
    city: (row.city as string | null) ?? null,
    addressLine: (row.addressLine as string | null) ?? null,
    receiptFooter: (row.receiptFooter as string | null) ?? null,
    receiptWidth: row.receiptWidth === "58" ? "58" : "80",
    hours: {
      mon: { open: row.hoursMonOpen as string | null, close: row.hoursMonClose as string | null },
      tue: { open: row.hoursTueOpen as string | null, close: row.hoursTueClose as string | null },
      wed: { open: row.hoursWedOpen as string | null, close: row.hoursWedClose as string | null },
      thu: { open: row.hoursThuOpen as string | null, close: row.hoursThuClose as string | null },
      fri: { open: row.hoursFriOpen as string | null, close: row.hoursFriClose as string | null },
      sat: { open: row.hoursSatOpen as string | null, close: row.hoursSatClose as string | null },
      sun: { open: row.hoursSunOpen as string | null, close: row.hoursSunClose as string | null },
    },
    updatedAt: row.updatedAt as string,
  };
}

export async function getWorkspace(): Promise<Workspace | null> {
  const { data, error } = await supabase.from("Workspace").select("*").eq("id", "default").single();
  if (error || !data) return null;
  return rowToWorkspace(data as Record<string, unknown>);
}

export async function getOrCreateWorkspace(): Promise<Workspace> {
  const existing = await getWorkspace();
  if (existing) return existing;
  await supabase.from("Workspace").upsert({ id: "default", name: "My Café" }, { onConflict: "id" });
  const row = await getWorkspace();
  if (!row) throw new Error("Failed to create workspace");
  return row;
}
