import "server-only";

import type {
  BraInvoicePayload,
  BraResponse,
  BraSubmissionResult,
} from "@/lib/bra/types";

export type SubmitOptions = {
  mode: "local" | "cloud";
  environment: "sandbox" | "production";
  /** Required for "local" mode (defaults to the spec's localhost:8524). */
  localBaseUrl?: string;
  /** Required for "cloud" mode. */
  bearerToken?: string;
  /** Hard cap so a hung BRA endpoint can't stall the checkout flow. */
  timeoutMs?: number;
};

const CLOUD_SANDBOX_URL = "http://ims.pral.com.pk/ims/sandbox/api/Live/PostData";
const CLOUD_PRODUCTION_URL =
  "http://ims.pral.com.pk/ims/production/api/Live/PostData";
const LOCAL_POST_PATH = "/api/IMSFiscal/GetInvoiceNumberByModel";
const LOCAL_GET_PATH = "/api/IMSFiscal/Get";
const DEFAULT_TIMEOUT_MS = 12_000;
const SUCCESS_CODE = "100";

/**
 * Resolve the absolute POST endpoint for a given configuration.
 * Exposed so the audit log can record exactly where a payload went.
 */
export function resolveEndpoint(opts: SubmitOptions): string {
  if (opts.mode === "cloud") {
    return opts.environment === "production"
      ? CLOUD_PRODUCTION_URL
      : CLOUD_SANDBOX_URL;
  }
  const base = (opts.localBaseUrl ?? "http://localhost:8524").replace(/\/$/, "");
  return `${base}${LOCAL_POST_PATH}`;
}

/**
 * POST an invoice to BRA. Returns a discriminated result rather than
 * throwing — the caller (a server action) can persist either branch
 * to FiscalSubmission without try/catch noise.
 */
export async function submitInvoiceToBra(
  payload: BraInvoicePayload,
  opts: SubmitOptions,
): Promise<BraSubmissionResult> {
  const endpoint = resolveEndpoint(opts);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (opts.mode === "cloud") {
    if (!opts.bearerToken) {
      return { ok: false, error: "Cloud mode requires a bearer token" };
    }
    headers.Authorization = `Bearer ${opts.bearerToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  let rawText = "";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      // BRA's local device is HTTP only and self-hosted — no proxy.
      // The cloud endpoint is HTTP too per the spec's URLs.
      cache: "no-store",
    });
    rawText = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        error: `BRA returned HTTP ${response.status}`,
        raw: rawText,
      };
    }

    const parsed = safeJson(rawText);
    if (!parsed) {
      return {
        ok: false,
        error: "BRA response was not valid JSON",
        raw: rawText,
      };
    }

    const code = parsed.Code != null ? String(parsed.Code) : undefined;
    const message = parsed.Response ?? "";
    const fiscalInvoiceNumber = parsed.InvoiceNumber
      ? String(parsed.InvoiceNumber)
      : "";

    if (code !== SUCCESS_CODE || !fiscalInvoiceNumber) {
      return {
        ok: false,
        error:
          message ||
          (fiscalInvoiceNumber
            ? `Unexpected response code ${code}`
            : "BRA did not return a fiscal invoice number"),
        responseCode: code,
        responseMessage: message,
        raw: parsed,
      };
    }

    return {
      ok: true,
      fiscalInvoiceNumber,
      responseCode: code,
      responseMessage: message || "Accepted",
      raw: parsed,
    };
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { ok: false, error: "BRA request timed out" };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown BRA error",
      raw: rawText || undefined,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Health probe for the local fiscal device. Per the spec, hitting
 * `GET /api/IMSFiscal/Get` returns `["Service is responding"]`.
 */
export async function probeLocalDevice(
  localBaseUrl?: string,
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const base = (localBaseUrl ?? "http://localhost:8524").replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch(`${base}${LOCAL_GET_PATH}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `Local device returned HTTP ${res.status}` };
    }
    const text = await res.text();
    return { ok: true, message: text.slice(0, 200) };
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { ok: false, error: "Local device probe timed out" };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Local device unreachable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function safeJson(raw: string): BraResponse | null {
  try {
    return JSON.parse(raw) as BraResponse;
  } catch {
    return null;
  }
}
