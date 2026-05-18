import "server-only";

import { prisma } from "@/lib/prisma";

export type FiscalMode = "disabled" | "local" | "cloud";
export type FiscalEnvironment = "sandbox" | "production";

/**
 * Client-safe shape of the fiscal config. NEVER includes `bearerToken`
 * or `accessCode` — those stay strictly server-side. Booleans below
 * tell the UI whether a credential is present without leaking the value.
 */
export type PublicFiscalConfig = {
  enabled: boolean;
  mode: FiscalMode;
  environment: FiscalEnvironment;
  posId: string;
  hasAccessCode: boolean;
  hasBearerToken: boolean;
  localBaseUrl: string;
  defaultPctCode: string;
  businessName: string;
  bntn: string;
  autoSubmit: boolean;
  updatedAt: string | null;
};

const FALLBACK: PublicFiscalConfig = {
  enabled: false,
  mode: "disabled",
  environment: "sandbox",
  posId: "",
  hasAccessCode: false,
  hasBearerToken: false,
  localBaseUrl: "http://localhost:8524",
  defaultPctCode: "00000000",
  businessName: "",
  bntn: "",
  autoSubmit: true,
  updatedAt: null,
};

export async function getFiscalConfig(): Promise<PublicFiscalConfig> {
  const row = await prisma.fiscalConfig.findUnique({
    where: { id: "default" },
  });
  if (!row) return FALLBACK;
  return {
    enabled: row.enabled,
    mode: row.mode as FiscalMode,
    environment: row.environment as FiscalEnvironment,
    posId: row.posId ?? "",
    hasAccessCode: Boolean(row.accessCode),
    hasBearerToken: Boolean(row.bearerToken),
    localBaseUrl: row.localBaseUrl,
    defaultPctCode: row.defaultPctCode,
    businessName: row.businessName ?? "",
    bntn: row.bntn ?? "",
    autoSubmit: row.autoSubmit,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type FiscalSubmissionSummary = {
  id: string;
  orderId: string;
  orderNumber: string;
  succeeded: boolean;
  mode: FiscalMode;
  environment: FiscalEnvironment;
  endpoint: string;
  responseCode: string | null;
  responseMessage: string | null;
  errorMessage: string | null;
  fiscalInvoiceNumber: string | null;
  attemptedAt: string;
};

export async function listRecentFiscalSubmissions(
  limit = 20,
): Promise<FiscalSubmissionSummary[]> {
  const rows = await prisma.fiscalSubmission.findMany({
    orderBy: { attemptedAt: "desc" },
    take: limit,
    include: { order: { select: { number: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    orderNumber: r.order.number,
    succeeded: r.succeeded,
    mode: r.mode as FiscalMode,
    environment: r.environment as FiscalEnvironment,
    endpoint: r.endpoint,
    responseCode: r.responseCode,
    responseMessage: r.responseMessage,
    errorMessage: r.errorMessage,
    fiscalInvoiceNumber: r.fiscalInvoiceNumber,
    attemptedAt: r.attemptedAt.toISOString(),
  }));
}
