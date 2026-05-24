"use server";

import { revalidatePath } from "next/cache";

import {
  probeLocalDevice,
  resolveEndpoint,
  submitInvoiceToBra,
} from "@/lib/bra/client";
import { buildBraInvoicePayload } from "@/lib/bra/payload";
import { supabase } from "@/lib/supabase";
import type { FiscalEnvironment, FiscalMode } from "@/lib/queries/fiscal";
import type { OrderChannel, OrderItem, PaymentMethod } from "@/types";

const SINGLETON_ID = "default";
const DEFAULT_TAX_RATE = 0.085;

type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type UpdateFiscalConfigInput = {
  enabled: boolean;
  mode: FiscalMode;
  environment: FiscalEnvironment;
  posId: string;
  accessCode?: string;
  bearerToken?: string;
  localBaseUrl: string;
  defaultPctCode: string;
  businessName: string;
  bntn: string;
  autoSubmit: boolean;
};

export async function updateFiscalConfigAction(
  input: UpdateFiscalConfigInput,
): Promise<ActionResult> {
  const posId = input.posId.trim();
  const localBaseUrl = input.localBaseUrl.trim() || "http://localhost:8524";
  const defaultPctCode = (input.defaultPctCode.trim() || "00000000").replace(/[^0-9]/g, "");
  if (defaultPctCode.length < 4) return { ok: false, error: "PCT code must be at least 4 digits" };
  if (input.enabled && input.mode === "disabled") return { ok: false, error: "Pick a submission mode to enable fiscalization" };
  if (input.mode !== "disabled" && !posId) return { ok: false, error: "POS ID is required" };

  const data = {
    id: SINGLETON_ID,
    enabled: input.enabled,
    mode: input.mode,
    environment: input.environment,
    posId: posId || null,
    localBaseUrl,
    defaultPctCode,
    businessName: input.businessName.trim() || null,
    bntn: input.bntn.trim() || null,
    autoSubmit: input.autoSubmit,
    ...(input.accessCode !== undefined ? { accessCode: input.accessCode.trim() || null } : {}),
    ...(input.bearerToken !== undefined ? { bearerToken: input.bearerToken.trim() || null } : {}),
  };

  try {
    const { error } = await supabase.from("FiscalConfig").upsert(data, { onConflict: "id" });
    if (error) throw error;
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("updateFiscalConfigAction failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't save" };
  }
}

export async function probeFiscalConnectionAction(): Promise<ActionResult<{ message: string }>> {
  const { data: cfg } = await supabase.from("FiscalConfig").select("*").eq("id", SINGLETON_ID).maybeSingle();
  if (!cfg || cfg.mode === "disabled") return { ok: false, error: "No fiscal mode configured" };

  if (cfg.mode === "local") {
    const result = await probeLocalDevice(cfg.localBaseUrl);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: { message: result.message || "Service is responding" } };
  }

  if (!cfg.bearerToken) return { ok: false, error: "Cloud mode needs a bearer token" };
  const endpoint = resolveEndpoint({ mode: "cloud", environment: cfg.environment as FiscalEnvironment, bearerToken: cfg.bearerToken });
  return { ok: true, data: { message: `Cloud endpoint configured: ${endpoint}` } };
}

export async function submitInvoiceToBraAction(
  orderId: string,
): Promise<ActionResult<{ fiscalInvoiceNumber: string; alreadySubmitted?: boolean }>> {
  if (!orderId) return { ok: false, error: "Missing order id" };

  const { data: cfg } = await supabase.from("FiscalConfig").select("*").eq("id", SINGLETON_ID).maybeSingle();
  if (!cfg || !cfg.enabled || cfg.mode === "disabled") return { ok: false, error: "Fiscalization is disabled" };
  if (!cfg.posId) return { ok: false, error: "POS ID is not configured" };

  const { data: order } = await supabase
    .from("Order")
    .select("id, number, channel, customerName, customerPhone, buyerNtn, buyerCnic, subtotal, tax, tip, discount, total, payment, paidAt, fiscalInvoiceNumber, createdAt")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (!order.payment || !order.paidAt) {
    return { ok: false, error: "Order isn't paid yet — collect payment before fiscalizing." };
  }
  if (order.fiscalInvoiceNumber) {
    return { ok: true, data: { fiscalInvoiceNumber: order.fiscalInvoiceNumber, alreadySubmitted: true } };
  }

  const { data: items } = await supabase
    .from("OrderItem")
    .select("id, menuItemId, name, quantity, unitPrice, modifiers, note")
    .eq("orderId", orderId);

  const menuItemIds = Array.from(new Set((items ?? []).map((i) => i.menuItemId).filter(Boolean)));
  const { data: pctRows } = await supabase.from("MenuItem").select("id, pctCode").in("id", menuItemIds);
  const pctByMenuItemId = new Map((pctRows ?? []).map((m) => [m.id, m.pctCode]));

  const payload = buildBraInvoicePayload({
    order: toPayloadOrder(order, items ?? []),
    posId: cfg.posId,
    defaultPctCode: cfg.defaultPctCode,
    pctCodeByMenuItemId: pctByMenuItemId,
    taxRate: DEFAULT_TAX_RATE,
  });

  const submission = await submitInvoiceToBra(payload, {
    mode: cfg.mode as "local" | "cloud",
    environment: cfg.environment as FiscalEnvironment,
    localBaseUrl: cfg.localBaseUrl,
    bearerToken: cfg.bearerToken ?? undefined,
  });

  const endpoint = resolveEndpoint({
    mode: cfg.mode as "local" | "cloud",
    environment: cfg.environment as FiscalEnvironment,
    localBaseUrl: cfg.localBaseUrl,
  });

  await supabase.from("FiscalSubmission").insert({
    orderId: order.id,
    mode: cfg.mode,
    environment: cfg.environment,
    endpoint,
    succeeded: submission.ok,
    fiscalInvoiceNumber: submission.ok ? submission.fiscalInvoiceNumber : null,
    responseCode: submission.ok ? submission.responseCode : (submission as { responseCode?: string }).responseCode ?? null,
    responseMessage: submission.ok ? submission.responseMessage : (submission as { responseMessage?: string }).responseMessage ?? null,
    errorMessage: submission.ok ? null : submission.error,
    requestBody: payload as unknown as object,
  });

  if (!submission.ok) {
    const { data: currentOrder } = await supabase.from("Order").select("fiscalAttempts").eq("id", order.id).single();
    await supabase.from("Order").update({
      fiscalAttempts: (currentOrder?.fiscalAttempts ?? 0) + 1,
      fiscalLastError: submission.error.slice(0, 500),
    }).eq("id", order.id);
    revalidatePath("/orders");
    revalidatePath("/settings");
    return { ok: false, error: submission.error };
  }

  const { data: currentOrder } = await supabase.from("Order").select("fiscalAttempts").eq("id", order.id).single();
  await supabase.from("Order").update({
    fiscalInvoiceNumber: submission.fiscalInvoiceNumber,
    fiscalSubmittedAt: new Date().toISOString(),
    fiscalAttempts: (currentOrder?.fiscalAttempts ?? 0) + 1,
    fiscalLastError: null,
  }).eq("id", order.id);

  revalidatePath("/orders");
  revalidatePath("/settings");
  return { ok: true, data: { fiscalInvoiceNumber: submission.fiscalInvoiceNumber } };
}

function toPayloadOrder(
  o: {
    number: string; channel: string; customerName: string | null; customerPhone: string | null;
    buyerNtn: string | null; buyerCnic: string | null; subtotal: unknown; tax: unknown; tip: unknown;
    discount: unknown; total: unknown; payment: string | null; createdAt: string;
  },
  items: { id: string; menuItemId: string; name: string; quantity: number; unitPrice: unknown; modifiers: unknown; note: string | null }[],
): Parameters<typeof buildBraInvoicePayload>[0]["order"] {
  return {
    number: o.number,
    channel: o.channel as OrderChannel,
    customer: o.customerName ? { name: o.customerName, phone: o.customerPhone ?? undefined } : undefined,
    subtotal: Number(o.subtotal),
    tax: Number(o.tax),
    tip: o.tip != null ? Number(o.tip) : undefined,
    discount: o.discount != null ? Number(o.discount) : undefined,
    total: Number(o.total),
    payment: (o.payment ?? "cash") as PaymentMethod,
    createdAt: o.createdAt,
    items: items.map<OrderItem>((i) => ({
      id: i.id,
      productId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
      note: i.note ?? undefined,
    })),
    buyerNtn: o.buyerNtn,
    buyerCnic: o.buyerCnic,
  };
}
