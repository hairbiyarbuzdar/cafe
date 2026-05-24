"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";
import { getSupplierLedger, type SupplierLedger } from "@/lib/queries/suppliers";

function round2(n: number): number { return Math.round(n * 100) / 100; }

export type CreateSupplierInput = {
  name: string;
  address?: string | null;
  phone?: string | null;
};

export type CreateSupplierResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string };

export async function createSupplierAction(
  input: CreateSupplierInput,
): Promise<CreateSupplierResult> {
  const name = input.name?.trim();
  if (!name) return { ok: false, error: "Name is required" };
  if (name.length > 80) return { ok: false, error: "Name is too long" };

  const address = input.address?.trim() || null;
  const phone = input.phone?.trim() || null;

  try {
    const { data: created, error } = await supabase
      .from("Supplier")
      .insert({ name, address, phone })
      .select("id, name")
      .single();
    if (error) throw error;
    revalidatePath("/inventory");
    await logActivity({
      type: "stock",
      title: `Supplier added — ${created.name}`,
      description: phone
        ? `Phone ${phone}${address ? ` · ${address}` : ""}`
        : address ?? "No contact details on file",
    });
    return { ok: true, id: created.id, name: created.name };
  } catch (err) {
    console.error("createSupplierAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create supplier" };
  }
}

export type LoadSupplierLedgerResult =
  | { ok: true; ledger: SupplierLedger }
  | { ok: false; error: string };

export async function loadSupplierLedgerAction(
  supplierId: string,
): Promise<LoadSupplierLedgerResult> {
  if (!supplierId) return { ok: false, error: "Missing supplier" };
  const ledger = await getSupplierLedger(supplierId);
  if (!ledger) return { ok: false, error: "Supplier not found" };
  return { ok: true, ledger };
}

export type PaySupplierInput = {
  supplierId: string;
  amount: number;
  paymentChannelId: string;
  note?: string;
};

export type PaySupplierResult =
  | { ok: true; paymentId: string; outstanding: number }
  | { ok: false; error: string };

export async function paySupplierAction(
  input: PaySupplierInput,
): Promise<PaySupplierResult> {
  if (!input.supplierId) return { ok: false, error: "Missing supplier" };
  if (!input.paymentChannelId) return { ok: false, error: "Pick a payment method to pay from" };
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }

  const amount = round2(input.amount);
  const note = input.note?.trim() || null;

  const [
    { data: supplier },
    { data: channel },
    { data: movements },
    { data: payments },
  ] = await Promise.all([
    supabase.from("Supplier").select("id, name").eq("id", input.supplierId).maybeSingle(),
    supabase.from("PaymentChannel").select("id, name, archived, currentBalance").eq("id", input.paymentChannelId).maybeSingle(),
    supabase.from("InventoryMovement").select("amount, paidAmount").eq("supplierId", input.supplierId),
    supabase.from("SupplierPayment").select("amount").eq("supplierId", input.supplierId),
  ]);

  if (!supplier) return { ok: false, error: "Supplier not found" };
  if (!channel || channel.archived) return { ok: false, error: "Payment method isn't active" };

  const cost = (movements ?? []).reduce((s, m) => s + Number(m.amount ?? 0), 0);
  const paidUpfront = (movements ?? []).reduce((s, m) => s + Number(m.paidAmount ?? 0), 0);
  const paidLater = (payments ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const outstanding = round2(Math.max(0, cost - paidUpfront - paidLater));

  if (outstanding <= 0) return { ok: false, error: `${supplier.name} has no outstanding balance` };
  if (amount > outstanding) {
    return { ok: false, error: `Outstanding is ${outstanding.toLocaleString()} — pay that or less` };
  }
  const balance = Number(channel.currentBalance);
  if (amount > balance) {
    return { ok: false, error: `${channel.name} only has ${balance.toLocaleString()} available` };
  }

  try {
    const { data: payment, error } = await supabase
      .from("SupplierPayment")
      .insert({ supplierId: input.supplierId, paymentChannelId: input.paymentChannelId, amount, note })
      .select("id")
      .single();
    if (error) throw error;
    await supabase.from("PaymentChannel").update({ currentBalance: balance - amount }).eq("id", input.paymentChannelId);

    revalidatePath("/inventory");
    revalidatePath("/settings");
    await logActivity({
      type: "stock",
      title: `Supplier paid — ${supplier.name}`,
      description: `${amount.toLocaleString()} via ${channel.name}${note ? ` · ${note}` : ""}`,
    });

    return { ok: true, paymentId: payment.id, outstanding: round2(outstanding - amount) };
  } catch (err) {
    console.error("paySupplierAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to record payment" };
  }
}
