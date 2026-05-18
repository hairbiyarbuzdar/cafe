"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Plug,
  Save,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/shared/section-card";
import {
  probeFiscalConnectionAction,
  updateFiscalConfigAction,
} from "@/lib/actions/fiscal";
import type {
  FiscalSubmissionSummary,
  PublicFiscalConfig,
} from "@/lib/queries/fiscal";
import { cn, formatRelativeTime } from "@/lib/utils";

type Mode = PublicFiscalConfig["mode"];
type Environment = PublicFiscalConfig["environment"];

type Form = {
  enabled: boolean;
  mode: Mode;
  environment: Environment;
  posId: string;
  accessCode: string;
  bearerToken: string;
  localBaseUrl: string;
  defaultPctCode: string;
  businessName: string;
  bntn: string;
  autoSubmit: boolean;
};

function initialForm(cfg: PublicFiscalConfig): Form {
  return {
    enabled: cfg.enabled,
    mode: cfg.mode,
    environment: cfg.environment,
    posId: cfg.posId,
    accessCode: "",
    bearerToken: "",
    localBaseUrl: cfg.localBaseUrl,
    defaultPctCode: cfg.defaultPctCode,
    businessName: cfg.businessName,
    bntn: cfg.bntn,
    autoSubmit: cfg.autoSubmit,
  };
}

export function FiscalPanel({
  config,
  submissions,
}: {
  config: PublicFiscalConfig;
  submissions: FiscalSubmissionSummary[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<Form>(() => initialForm(config));
  const [showBearer, setShowBearer] = React.useState(false);
  const [showAccess, setShowAccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [probing, setProbing] = React.useState(false);

  React.useEffect(() => {
    setForm(initialForm(config));
  }, [config]);

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const result = await updateFiscalConfigAction({
        enabled: form.enabled,
        mode: form.mode,
        environment: form.environment,
        posId: form.posId,
        // Only send credentials when the operator typed something —
        // an empty string here means "leave the stored value alone".
        accessCode: form.accessCode || undefined,
        bearerToken: form.bearerToken || undefined,
        localBaseUrl: form.localBaseUrl,
        defaultPctCode: form.defaultPctCode,
        businessName: form.businessName,
        bntn: form.bntn,
        autoSubmit: form.autoSubmit,
      });
      if (!result.ok) {
        toast.error("Couldn't save", { description: result.error });
        return;
      }
      toast.success("Fiscal settings saved");
      setForm((f) => ({ ...f, accessCode: "", bearerToken: "" }));
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function probe() {
    if (probing) return;
    setProbing(true);
    try {
      const result = await probeFiscalConnectionAction();
      if (!result.ok) {
        toast.error("Connection failed", { description: result.error });
        return;
      }
      toast.success("Connection looks good", {
        description: result.data.message,
      });
    } finally {
      setProbing(false);
    }
  }

  const showLocalFields = form.mode === "local";
  const showCloudFields = form.mode === "cloud";

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
          BRA fiscal device
        </h2>
        <p className="mt-1 max-w-3xl text-[12.5px] text-muted-foreground">
          Push each POS invoice to the Balochistan Revenue Authority and
          stamp the returned fiscal invoice number onto the receipt. Both
          submission paths from the PRAL technical spec are supported —
          the on-prem fiscal device (
          <span className="font-mono text-foreground/85">localhost:8524</span>)
          and the BRA cloud endpoint with a Bearer token.
        </p>
      </header>

      <SectionCard
        title="Status"
        description={
          config.enabled
            ? `${labelMode(config.mode)} · ${labelEnv(config.environment)}`
            : "Submission is currently disabled"
        }
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={probe}
            disabled={probing || form.mode === "disabled"}
          >
            {probing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Wifi className="size-3.5" />
            )}
            Test connection
          </Button>
        }
      >
        <ul className="space-y-2 text-[12.5px]">
          <StatusRow
            label="Submissions enabled"
            value={
              config.enabled ? (
                <Badge className="rounded-md border-success/20 bg-success/12 text-success">
                  <CheckCircle2 className="size-3" />
                  On
                </Badge>
              ) : (
                <Badge variant="outline" className="rounded-md text-muted-foreground">
                  Off
                </Badge>
              )
            }
          />
          <StatusRow label="Mode" value={labelMode(config.mode)} />
          <StatusRow label="Environment" value={labelEnv(config.environment)} />
          <StatusRow
            label="POS ID"
            value={config.posId ? <code>{config.posId}</code> : <Muted>not set</Muted>}
          />
          <StatusRow
            label="Bearer token"
            value={config.hasBearerToken ? <Muted>stored</Muted> : <Muted>not set</Muted>}
          />
          <StatusRow
            label="Access code"
            value={config.hasAccessCode ? <Muted>stored</Muted> : <Muted>not set</Muted>}
          />
        </ul>
      </SectionCard>

      <SectionCard
        title="Configuration"
        description="Changes apply to every subsequent invoice."
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <ToggleRow
            label="Enable BRA submission"
            description="Master kill-switch. When off, POS orders are still recorded locally but never pushed to BRA."
            checked={form.enabled}
            onChange={(v) => patch("enabled", v)}
          />
          <ToggleRow
            label="Auto-submit on checkout"
            description="When on, every successful POS sale is pushed to BRA in the same request. Off lets operators submit manually from the order detail drawer."
            checked={form.autoSubmit}
            onChange={(v) => patch("autoSubmit", v)}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Submission path">
              <Select value={form.mode} onValueChange={(v) => patch("mode", v as Mode)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="cloud">Cloud endpoint (ims.pral.com.pk)</SelectItem>
                  <SelectItem value="local">Local fiscal device (localhost:8524)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Environment">
              <Select
                value={form.environment}
                onValueChange={(v) => patch("environment", v as Environment)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="POS ID" htmlFor="f-pos">
              <Input
                id="f-pos"
                value={form.posId}
                onChange={(e) => patch("posId", e.target.value)}
                placeholder="e.g. 900005"
                className="h-10 font-mono tabular-nums"
              />
            </Field>
            <Field label="Default PCT code" htmlFor="f-pct">
              <Input
                id="f-pct"
                value={form.defaultPctCode}
                onChange={(e) => patch("defaultPctCode", e.target.value)}
                placeholder="00000000"
                className="h-10 font-mono tabular-nums"
                maxLength={8}
              />
            </Field>
          </div>

          {showCloudFields ? (
            <Field label="Bearer token" htmlFor="f-tok">
              <div className="relative">
                <Input
                  id="f-tok"
                  type={showBearer ? "text" : "password"}
                  value={form.bearerToken}
                  onChange={(e) => patch("bearerToken", e.target.value)}
                  placeholder={
                    config.hasBearerToken
                      ? "•••••••• (leave blank to keep stored)"
                      : "Paste the token issued by BRA"
                  }
                  className="h-10 pe-10 font-mono"
                  autoComplete="off"
                />
                <RevealButton on={showBearer} onClick={() => setShowBearer((s) => !s)} />
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                Sandbox sample from the spec:{" "}
                <code className="font-mono">1298b5eb-b252-3d97-8622-a4a69d5bf818</code>
              </p>
            </Field>
          ) : null}

          {showLocalFields ? (
            <>
              <Field label="Access code" htmlFor="f-acc">
                <div className="relative">
                  <Input
                    id="f-acc"
                    type={showAccess ? "text" : "password"}
                    value={form.accessCode}
                    onChange={(e) => patch("accessCode", e.target.value)}
                    placeholder={
                      config.hasAccessCode
                        ? "•••••••• (leave blank to keep stored)"
                        : "Issued at POS registration"
                    }
                    className="h-10 pe-10 font-mono"
                    autoComplete="off"
                  />
                  <RevealButton on={showAccess} onClick={() => setShowAccess((s) => !s)} />
                </div>
              </Field>
              <Field label="Local device URL" htmlFor="f-url">
                <Input
                  id="f-url"
                  value={form.localBaseUrl}
                  onChange={(e) => patch("localBaseUrl", e.target.value)}
                  placeholder="http://localhost:8524"
                  className="h-10 font-mono"
                />
                <p className="text-[11.5px] text-muted-foreground">
                  The IMSSetup.exe installer hosts the fiscal device at
                  localhost:8524 by default.
                </p>
              </Field>
            </>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Business name (display)" htmlFor="f-biz">
              <Input
                id="f-biz"
                value={form.businessName}
                onChange={(e) => patch("businessName", e.target.value)}
                placeholder="Registered legal name"
                className="h-10"
              />
            </Field>
            <Field label="BNTN" htmlFor="f-bntn">
              <Input
                id="f-bntn"
                value={form.bntn}
                onChange={(e) => patch("bntn", e.target.value)}
                placeholder="8000012-6"
                className="h-10 font-mono"
              />
            </Field>
          </div>

          {form.enabled && form.mode === "disabled" ? (
            <p className="inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-[12px] text-warning-foreground/85">
              <AlertTriangle className="size-3.5" />
              Pick a submission path before enabling.
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save settings
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Recent submissions"
        description={
          submissions.length === 0
            ? "Nothing submitted yet."
            : `Last ${submissions.length} attempt${submissions.length === 1 ? "" : "s"} — most recent first.`
        }
        contentClassName="p-0"
      >
        {submissions.length === 0 ? (
          <div className="px-5 py-10 text-center text-[12.5px] text-muted-foreground">
            <Plug className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-2">
              Once auto-submit is on, every POS sale shows up here with the
              fiscal number or the failure reason.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {submissions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3 md:px-5">
                <StatusDot ok={s.succeeded} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[13px] font-medium">
                    <span className="tabular-nums">{s.orderNumber}</span>
                    <ChevronRight className="size-3 text-muted-foreground" />
                    <span
                      className={cn(
                        "truncate font-mono",
                        s.succeeded ? "text-foreground" : "text-destructive/85",
                      )}
                    >
                      {s.fiscalInvoiceNumber ?? s.errorMessage ?? s.responseMessage ?? "—"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {labelMode(s.mode)} · {labelEnv(s.environment)} ·{" "}
                    {formatRelativeTime(s.attemptedAt)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md text-[10.5px] font-normal",
                    s.succeeded
                      ? "border-success/30 text-success"
                      : "border-destructive/30 text-destructive",
                  )}
                >
                  {s.succeeded ? `Code ${s.responseCode}` : "Failed"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

function labelMode(m: Mode): string {
  if (m === "cloud") return "Cloud endpoint";
  if (m === "local") return "Local device";
  return "Disabled";
}
function labelEnv(e: Environment): string {
  return e === "production" ? "Production" : "Sandbox";
}

function StatusRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </li>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-muted-foreground">{children}</span>;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium">{label}</p>
        <p className="text-[11.5px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[12px] font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

function RevealButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={on ? "Hide" : "Reveal"}
      className="absolute end-0 top-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      {on ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-1 size-2 shrink-0 rounded-full",
        ok ? "bg-success" : "bg-destructive",
      )}
    />
  );
}
