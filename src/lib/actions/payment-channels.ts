"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import type { PaymentMethod } from "@/types";

const PAYMENT_KINDS: readonly PaymentMethod[] = ["cash", "card", "wallet", "online"];

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type CreateChannelInput = {
  name: string;
  kind: PaymentMethod;
  openingBalance: number;
};

export async function createPaymentChannelAction(
  input: CreateChannelInput,
): Promise<ActionResult<{ id: string }>> {
  const name = input.name?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!PAYMENT_KINDS.includes(input.kind)) return { ok: false, error: "Pick a payment kind" };
  if (!Number.isFinite(input.openingBalance) || input.openingBalance < 0) {
    return { ok: false, error: "Opening balance must be 0 or greater" };
  }

  const { data: existing } = await supabase
    .from("PaymentChannel")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (existing) return { ok: false, error: `"${name}" already exists` };

  try {
    const { data: created, error } = await supabase
      .from("PaymentChannel")
      .insert({ name, kind: input.kind, openingBalance: input.openingBalance, currentBalance: input.openingBalance })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createPaymentChannelAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to add method" };
  }
}

export async function updatePaymentChannelKindAction(
  id: string,
  kind: PaymentMethod,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  if (!PAYMENT_KINDS.includes(kind)) return { ok: false, error: "Invalid kind" };
  try {
    const { error } = await supabase.from("PaymentChannel").update({ kind }).eq("id", id);
    if (error) throw error;
    revalidatePath("/settings");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("updatePaymentChannelKindAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update kind" };
  }
}

export async function renamePaymentChannelAction(
  id: string,
  name: string,
): Promise<ActionResult> {
  const next = name?.trim();
  if (!id) return { ok: false, error: "No method specified" };
  if (!next || next.length < 2) return { ok: false, error: "Name is required" };

  const { data: conflict } = await supabase
    .from("PaymentChannel")
    .select("id")
    .eq("name", next)
    .neq("id", id)
    .maybeSingle();
  if (conflict) return { ok: false, error: `"${next}" already exists` };

  try {
    const { error } = await supabase.from("PaymentChannel").update({ name: next }).eq("id", id);
    if (error) throw error;
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("renamePaymentChannelAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to rename" };
  }
}

export async function archivePaymentChannelAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  try {
    const { error } = await supabase
      .from("PaymentChannel")
      .update({ archived: true, archivedAt: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("archivePaymentChannelAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to archive" };
  }
}

export async function restorePaymentChannelAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  const { data: target } = await supabase
    .from("PaymentChannel")
    .select("archived")
    .eq("id", id)
    .maybeSingle();
  if (!target) return { ok: false, error: "Method not found" };
  if (!target.archived) return { ok: true };

  try {
    const { error } = await supabase
      .from("PaymentChannel")
      .update({ archived: false, archivedAt: null })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("restorePaymentChannelAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to restore" };
  }
}

export type CreateTransferInput = {
  fromId: string;
  toId: string;
  amount: number;
  occurredAt: string;
  note?: string;
};

export async function createTransferAction(
  input: CreateTransferInput,
): Promise<ActionResult<{ id: string }>> {
  if (!input.fromId || !input.toId) return { ok: false, error: "Pick both sides of the transfer" };
  if (input.fromId === input.toId) return { ok: false, error: "Source and destination must differ" };
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }
  const occurredAt = new Date(input.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) return { ok: false, error: "Invalid date" };

  const [{ data: from }, { data: to }] = await Promise.all([
    supabase.from("PaymentChannel").select("id, name, archived, currentBalance").eq("id", input.fromId).maybeSingle(),
    supabase.from("PaymentChannel").select("id, name, archived").eq("id", input.toId).maybeSingle(),
  ]);
  if (!from || !to) return { ok: false, error: "Method not found" };
  if (from.archived || to.archived) return { ok: false, error: "Archived methods can't be used for transfers" };
  if (Number(from.currentBalance) < input.amount) {
    return { ok: false, error: `${from.name} only has Rs ${Number(from.currentBalance).toLocaleString()} available` };
  }

  try {
    await supabase.from("PaymentChannel").update({ currentBalance: Number(from.currentBalance) - input.amount }).eq("id", input.fromId);
    const { data: toRow } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", input.toId).single();
    await supabase.from("PaymentChannel").update({ currentBalance: Number(toRow?.currentBalance ?? 0) + input.amount }).eq("id", input.toId);
    const { data: transfer, error } = await supabase
      .from("PaymentTransfer")
      .insert({ fromId: input.fromId, toId: input.toId, amount: input.amount, occurredAt: occurredAt.toISOString(), note: input.note?.trim() || null })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/settings");
    return { ok: true, data: { id: transfer.id } };
  } catch (err) {
    console.error("createTransferAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Transfer failed" };
  }
}
