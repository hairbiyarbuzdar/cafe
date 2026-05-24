import "server-only";

import { supabase } from "@/lib/supabase";

export type FiscalMode = "disabled" | "local" | "cloud";
export type FiscalEnvironment = "sandbox" | "production";

export type PublicFiscalConfig = {
  enabled: boolean; mode: FiscalMode; environment: FiscalEnvironment;
  posId: string; hasAccessCode: boolean; hasBearerToken: boolean;
  localBaseUrl: string; defaultPctCode: string;
  businessName: string; bntn: string; autoSubmit: boolean; updatedAt: string | null;
};

const FALLBACK: PublicFiscalConfig = {
  enabled: false, mode: "disabled", environment: "sandbox", posId: "",
  hasAccessCode: false, hasBearerToken: false, localBaseUrl: "http://localhost:8524",
  defaultPctCode: "00000000", businessName: "", bntn: "", autoSubmit: true, updatedAt: null,
};

export async function getFiscalConfig(): Promise<PublicFiscalConfig> {
  const { data } = await supabase.from("FiscalConfig").select("*").eq("id", "default").single();
  if (!data) return FALLBACK;
  return {
    enabled: data.enabled, mode: data.mode as FiscalMode, environment: data.environment as FiscalEnvironment,
    posId: data.posId ?? "", hasAccessCode: Boolean(data.accessCode), hasBearerToken: Boolean(data.bearerToken),
    localBaseUrl: data.localBaseUrl, defaultPctCode: data.defaultPctCode,
    businessName: data.businessName ?? "", bntn: data.bntn ?? "",
    autoSubmit: data.autoSubmit, updatedAt: data.updatedAt,
  };
}

export type FiscalSubmissionSummary = {
  id: string; orderId: string; orderNumber: string; succeeded: boolean;
  mode: FiscalMode; environment: FiscalEnvironment; endpoint: string;
  responseCode: string | null; responseMessage: string | null; errorMessage: string | null;
  fiscalInvoiceNumber: string | null; attemptedAt: string;
};

export async function listRecentFiscalSubmissions(limit = 20): Promise<FiscalSubmissionSummary[]> {
  const { data, error } = await supabase
    .from("FiscalSubmission")
    .select("*, Order(number)")
    .order("attemptedAt", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const order = (Array.isArray(r.Order) ? r.Order[0] : r.Order) as { number: string } | null;
    return {
      id: r.id, orderId: r.orderId, orderNumber: order?.number ?? "",
      succeeded: r.succeeded, mode: r.mode as FiscalMode, environment: r.environment as FiscalEnvironment,
      endpoint: r.endpoint, responseCode: r.responseCode, responseMessage: r.responseMessage,
      errorMessage: r.errorMessage, fiscalInvoiceNumber: r.fiscalInvoiceNumber, attemptedAt: r.attemptedAt,
    };
  });
}
