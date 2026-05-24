import "server-only";

import { supabase } from "@/lib/supabase";
import type { PaymentMethod } from "@/types";

export type PaymentChannel = {
  id: string; name: string; kind: PaymentMethod;
  openingBalance: number; currentBalance: number;
  archived: boolean; archivedAt: string | null; createdAt: string;
};

export type Transfer = {
  id: string; fromId: string; fromName: string;
  toId: string; toName: string; amount: number; occurredAt: string; note: string | null;
};

export type TransferRange = "all" | "today" | "week" | "month" | "custom";

export async function listPaymentChannels({ includeArchived = false } = {}): Promise<PaymentChannel[]> {
  let q = supabase.from("PaymentChannel").select("*").order("archived").order("createdAt");
  if (!includeArchived) q = q.eq("archived", false);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id, name: r.name, kind: r.kind as PaymentMethod,
    openingBalance: Number(r.openingBalance), currentBalance: Number(r.currentBalance),
    archived: r.archived, archivedAt: r.archivedAt ?? null, createdAt: r.createdAt,
  }));
}

export async function listTransfers({ from, to }: { from?: Date; to?: Date } = {}): Promise<Transfer[]> {
  let q = supabase
    .from("PaymentTransfer")
    .select("id, fromId, toId, amount, occurredAt, note, fromChannel:fromId(name), toChannel:toId(name)")
    .order("occurredAt", { ascending: false });
  if (from) q = q.gte("occurredAt", from.toISOString());
  if (to) q = q.lte("occurredAt", to.toISOString());
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const fromCh = (Array.isArray(r.fromChannel) ? r.fromChannel[0] : r.fromChannel) as { name: string } | null;
    const toCh = (Array.isArray(r.toChannel) ? r.toChannel[0] : r.toChannel) as { name: string } | null;
    return {
      id: r.id, fromId: r.fromId, fromName: fromCh?.name ?? "",
      toId: r.toId, toName: toCh?.name ?? "",
      amount: Number(r.amount), occurredAt: r.occurredAt, note: r.note,
    };
  });
}
