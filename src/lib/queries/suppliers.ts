import "server-only";

import { supabase } from "@/lib/supabase";

export type SupplierLedgerEntry =
  | { kind: "purchase"; id: string; occurredAt: string; itemName: string; quantity: number; unit: string; cost: number; paid: number; outstanding: number; channelName: string | null; reason: string }
  | { kind: "payment"; id: string; occurredAt: string; amount: number; channelName: string; note: string | null };

export type SupplierLedger = {
  supplier: { id: string; name: string; phone: string | null; address: string | null };
  totals: { purchased: number; paid: number; outstanding: number };
  entries: SupplierLedgerEntry[];
};

export async function getSupplierLedger(supplierId: string): Promise<SupplierLedger | null> {
  const [{ data: supplier }, { data: movements }, { data: payments }] = await Promise.all([
    supabase.from("Supplier").select("id, name, phone, address").eq("id", supplierId).single(),
    supabase.from("InventoryMovement")
      .select("id, createdAt, delta, reason, amount, paidAmount, InventoryItem(name, unit), PaymentChannel(name)")
      .eq("supplierId", supplierId)
      .not("amount", "is", null)
      .order("createdAt", { ascending: false }),
    supabase.from("SupplierPayment")
      .select("id, createdAt, amount, note, PaymentChannel(name)")
      .eq("supplierId", supplierId)
      .order("createdAt", { ascending: false }),
  ]);

  if (!supplier) return null;

  const purchaseEntries: SupplierLedgerEntry[] = (movements ?? []).map((m) => {
    const item = (Array.isArray(m.InventoryItem) ? m.InventoryItem[0] : m.InventoryItem) as { name: string; unit: string } | null;
    const channel = (Array.isArray(m.PaymentChannel) ? m.PaymentChannel[0] : m.PaymentChannel) as { name: string } | null;
    const cost = Number(m.amount);
    const paid = Number(m.paidAmount ?? 0);
    return {
      kind: "purchase", id: m.id, occurredAt: m.createdAt,
      itemName: item?.name ?? "", quantity: Number(m.delta), unit: item?.unit ?? "",
      cost, paid, outstanding: Math.max(0, round2(cost - paid)),
      channelName: channel?.name ?? null, reason: m.reason,
    };
  });

  const paymentEntries: SupplierLedgerEntry[] = (payments ?? []).map((p) => {
    const channel = (Array.isArray(p.PaymentChannel) ? p.PaymentChannel[0] : p.PaymentChannel) as { name: string };
    return { kind: "payment", id: p.id, occurredAt: p.createdAt, amount: Number(p.amount), channelName: channel?.name ?? "", note: p.note };
  });

  const entries = [...purchaseEntries, ...paymentEntries].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

  const totalPurchased = round2(purchaseEntries.reduce((s, e) => s + (e.kind === "purchase" ? e.cost : 0), 0));
  const totalPaidUpfront = purchaseEntries.reduce((s, e) => s + (e.kind === "purchase" ? e.paid : 0), 0);
  const totalPaidLater = paymentEntries.reduce((s, e) => s + (e.kind === "payment" ? e.amount : 0), 0);
  const totalPaid = round2(totalPaidUpfront + totalPaidLater);

  return { supplier, totals: { purchased: totalPurchased, paid: totalPaid, outstanding: round2(Math.max(0, totalPurchased - totalPaid)) }, entries };
}

function round2(n: number) { return Math.round(n * 100) / 100; }
