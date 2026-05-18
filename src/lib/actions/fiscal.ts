"use server";

import { revalidatePath } from "next/cache";

import {
  probeLocalDevice,
  resolveEndpoint,
  submitInvoiceToBra,
} from "@/lib/bra/client";
import { buildBraInvoicePayload } from "@/lib/bra/payload";
import { prisma } from "@/lib/prisma";
import type {
  FiscalEnvironment,
  FiscalMode,
} from "@/lib/queries/fiscal";
import type { OrderChannel, OrderItem, PaymentMethod } from "@/types";

const SINGLETON_ID = "default";
const DEFAULT_TAX_RATE = 0.085; // matches the POS cart store

type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

// ──────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────

export type UpdateFiscalConfigInput = {
  enabled: boolean;
  mode: FiscalMode;
  environment: FiscalEnvironment;
  posId: string;
  /** Pass undefined to leave the stored credential untouched (UI behavior). */
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
  const defaultPctCode = (input.defaultPctCode.trim() || "00000000").replace(
    /[^0-9]/g,
    "",
  );
  if (defaultPctCode.length < 4) {
    return { ok: false, error: "PCT code must be at least 4 digits" };
  }
  if (input.enabled && input.mode === "disabled") {
    return { ok: false, error: "Pick a submission mode to enable fiscalization" };
  }
  if (input.mode !== "disabled" && !posId) {
    return { ok: false, error: "POS ID is required" };
  }

  const data = {
    enabled: input.enabled,
    mode: input.mode,
    environment: input.environment,
    posId: posId || null,
    localBaseUrl,
    defaultPctCode,
    businessName: input.businessName.trim() || null,
    bntn: input.bntn.trim() || null,
    autoSubmit: input.autoSubmit,
    // Only overwrite credentials when the caller explicitly sent a new value.
    ...(input.accessCode !== undefined
      ? { accessCode: input.accessCode.trim() || null }
      : {}),
    ...(input.bearerToken !== undefined
      ? { bearerToken: input.bearerToken.trim() || null }
      : {}),
  };

  try {
    await prisma.fiscalConfig.upsert({
      where: { id: SINGLETON_ID },
      update: data,
      create: { id: SINGLETON_ID, ...data },
    });
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("updateFiscalConfigAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Couldn't save",
    };
  }
}

export async function probeFiscalConnectionAction(): Promise<ActionResult<{
  message: string;
}>> {
  const cfg = await prisma.fiscalConfig.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (!cfg || cfg.mode === "disabled") {
    return { ok: false, error: "No fiscal mode configured" };
  }

  if (cfg.mode === "local") {
    const result = await probeLocalDevice(cfg.localBaseUrl);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: { message: result.message || "Service is responding" } };
  }

  // Cloud mode: no documented health endpoint, so the best probe is
  // to simply check the bearer is configured. A real ping would
  // require sending a real invoice; we don't fake that here.
  if (!cfg.bearerToken) {
    return { ok: false, error: "Cloud mode needs a bearer token" };
  }
  const endpoint = resolveEndpoint({
    mode: "cloud",
    environment: cfg.environment as FiscalEnvironment,
    bearerToken: cfg.bearerToken,
  });
  return {
    ok: true,
    data: {
      message: `Cloud endpoint configured: ${endpoint}`,
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Submission (auto + manual)
// ──────────────────────────────────────────────────────────────

/**
 * Send a single order to BRA. Safe to call from the POS checkout (will
 * no-op gracefully when fiscalization is disabled) or from a manual
 * retry button on the order detail drawer.
 */
export async function submitInvoiceToBraAction(
  orderId: string,
): Promise<
  ActionResult<{ fiscalInvoiceNumber: string; alreadySubmitted?: boolean }>
> {
  if (!orderId) return { ok: false, error: "Missing order id" };

  const cfg = await prisma.fiscalConfig.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (!cfg || !cfg.enabled || cfg.mode === "disabled") {
    return { ok: false, error: "Fiscalization is disabled" };
  }
  if (!cfg.posId) {
    return { ok: false, error: "POS ID is not configured" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return { ok: false, error: "Order not found" };

  if (order.fiscalInvoiceNumber) {
    return {
      ok: true,
      data: {
        fiscalInvoiceNumber: order.fiscalInvoiceNumber,
        alreadySubmitted: true,
      },
    };
  }

  // Load PCT codes for the items referenced in this order.
  const menuItemIds = Array.from(new Set(order.items.map((i) => i.menuItemId)));
  const pctRows = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    select: { id: true, pctCode: true },
  });
  const pctByMenuItemId = new Map(pctRows.map((m) => [m.id, m.pctCode]));

  const payload = buildBraInvoicePayload({
    order: toPayloadOrder(order),
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

  // Record the attempt either way.
  await prisma.fiscalSubmission.create({
    data: {
      orderId: order.id,
      mode: cfg.mode,
      environment: cfg.environment,
      endpoint,
      succeeded: submission.ok,
      fiscalInvoiceNumber: submission.ok ? submission.fiscalInvoiceNumber : null,
      responseCode: submission.ok
        ? submission.responseCode
        : submission.responseCode ?? null,
      responseMessage: submission.ok
        ? submission.responseMessage
        : submission.responseMessage ?? null,
      errorMessage: submission.ok ? null : submission.error,
      requestBody: payload as unknown as object,
      responseBody:
        "raw" in submission && submission.raw
          ? (submission.raw as unknown as object)
          : undefined,
    },
  });

  if (!submission.ok) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        fiscalAttempts: { increment: 1 },
        fiscalLastError: submission.error.slice(0, 500),
      },
    });
    revalidatePath("/orders");
    revalidatePath("/settings");
    return { ok: false, error: submission.error };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      fiscalInvoiceNumber: submission.fiscalInvoiceNumber,
      fiscalSubmittedAt: new Date(),
      fiscalAttempts: { increment: 1 },
      fiscalLastError: null,
    },
  });
  revalidatePath("/orders");
  revalidatePath("/settings");
  return {
    ok: true,
    data: { fiscalInvoiceNumber: submission.fiscalInvoiceNumber },
  };
}

/**
 * Shape an unwrapped Prisma Order row into the `Order` shape the
 * payload builder expects (a Decimal → number conversion + relations).
 */
function toPayloadOrder(o: {
  number: string;
  channel: string;
  customerName: string | null;
  customerPhone: string | null;
  buyerNtn: string | null;
  buyerCnic: string | null;
  subtotal: unknown;
  tax: unknown;
  tip: unknown;
  discount: unknown;
  total: unknown;
  payment: string;
  createdAt: Date;
  items: {
    id: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: unknown;
    modifiers: unknown;
    note: string | null;
  }[];
}): Parameters<typeof buildBraInvoicePayload>[0]["order"] {
  return {
    number: o.number,
    channel: o.channel as OrderChannel,
    customer: o.customerName
      ? { name: o.customerName, phone: o.customerPhone ?? undefined }
      : undefined,
    subtotal: toNumber(o.subtotal),
    tax: toNumber(o.tax),
    tip: o.tip != null ? toNumber(o.tip) : undefined,
    discount: o.discount != null ? toNumber(o.discount) : undefined,
    total: toNumber(o.total),
    payment: o.payment as PaymentMethod,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map<OrderItem>((i) => ({
      id: i.id,
      productId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: toNumber(i.unitPrice),
      modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
      note: i.note ?? undefined,
    })),
    buyerNtn: o.buyerNtn,
    buyerCnic: o.buyerCnic,
  };
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

