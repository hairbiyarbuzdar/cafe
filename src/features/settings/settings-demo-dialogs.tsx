"use client";

/**
 * Small confirmation / form dialogs for settings panels that don't
 * yet have a backing data model. They validate input, fire a toast,
 * and close — useful for demoing the surface without lying about
 * what's persisted. Each component owns its open state.
 */

import * as React from "react";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ──────────────────────────────────────────────────────────────
// Update payment method
// ──────────────────────────────────────────────────────────────

type CardForm = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
};

export function UpdatePaymentMethodDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<CardForm>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm({ number: "", name: "", expiry: "", cvc: "" });
  }, [open]);

  const digits = form.number.replace(/\s+/g, "");
  const canSave =
    digits.length >= 13 &&
    digits.length <= 19 &&
    form.name.trim().length > 1 &&
    /^\d{2}\/\d{2}$/.test(form.expiry) &&
    /^\d{3,4}$/.test(form.cvc);

  function patch<K extends keyof CardForm>(key: K, v: CardForm[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function save() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    toast.success("Payment method updated", {
      description: `Card ending in ${digits.slice(-4)} · auto-renew on the 1st`,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Update payment method
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Card details are tokenised by the processor; we never store
            the raw number.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 pb-1">
          <Field label="Card number" htmlFor="cc-num">
            <Input
              id="cc-num"
              inputMode="numeric"
              autoComplete="cc-number"
              value={form.number}
              onChange={(e) => patch("number", e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="h-10 font-mono tabular-nums"
            />
          </Field>
          <Field label="Cardholder name" htmlFor="cc-name">
            <Input
              id="cc-name"
              autoComplete="cc-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder="As shown on card"
              className="h-10"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry" htmlFor="cc-exp">
              <Input
                id="cc-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={form.expiry}
                onChange={(e) => patch("expiry", e.target.value)}
                placeholder="MM/YY"
                className="h-10 font-mono tabular-nums"
                maxLength={5}
              />
            </Field>
            <Field label="CVC" htmlFor="cc-cvc">
              <Input
                id="cc-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={form.cvc}
                onChange={(e) => patch("cvc", e.target.value)}
                placeholder="123"
                className="h-10 font-mono tabular-nums"
                maxLength={4}
              />
            </Field>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={save}
            disabled={!canSave || submitting}
          >
            {submitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Save card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────
// Connect integration
// ──────────────────────────────────────────────────────────────

export function ConnectIntegrationDialog({
  name,
  description,
  trigger,
}: {
  name: string;
  description: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setApiKey("");
  }, [open]);

  async function connect() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    toast.success(`${name} connected`, { description });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Connect {name}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Paste the API key or token you generated in {name}. We
            verify it before storing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 pb-1">
          <Field label="API key" htmlFor="int-key">
            <Input
              id="int-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_live_…"
              className="h-10 font-mono text-[12px]"
              autoComplete="off"
            />
          </Field>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={connect}
            disabled={apiKey.trim().length < 8 || submitting}
          >
            {submitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────
// Manage 2FA
// ──────────────────────────────────────────────────────────────

export function Manage2FADialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  function regenerateCodes() {
    toast.success("Backup codes regenerated", {
      description: "Print or store the new set securely — the old codes now invalid.",
    });
    setOpen(false);
  }

  function disable2FA() {
    toast.warning("Two-factor disabled", {
      description: "Sign-ins now require only a password until you re-enable.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Two-factor authentication
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Authenticator app connected. Regenerate backup codes or
            disable 2FA from here.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 px-5 pb-1">
          <li className="rounded-md border bg-card px-3 py-2.5 text-[12.5px]">
            <p className="font-medium">Authenticator app</p>
            <p className="text-[11.5px] text-muted-foreground">
              Connected · 10 unused backup codes remaining
            </p>
          </li>
        </ul>

        <DialogFooter className="flex flex-row flex-wrap items-center justify-end gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={regenerateCodes}
          >
            Regenerate codes
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={disable2FA}
          >
            Disable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────
// Sign out remote session
// ──────────────────────────────────────────────────────────────

export function SignOutSessionDialog({
  device,
  location,
  trigger,
}: {
  device: string;
  location: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  function signOut() {
    toast.success(`${device} signed out`, {
      description: "That device will need to log in again.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[400px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Sign out this device?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            <span className="font-medium text-foreground">{device}</span>{" "}
            from {location} will be signed out immediately.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={signOut}
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────
// Rotate API key
// ──────────────────────────────────────────────────────────────

function fakeKey(): string {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `brl_live_${rand}`;
}

export function RotateApiKeyDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [newKey, setNewKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) setNewKey(null);
  }, [open]);

  function rotate() {
    const k = fakeKey();
    setNewKey(k);
    toast.success("API key rotated", {
      description: "Update integrations before the old key stops working.",
    });
  }

  function copyKey() {
    if (!newKey) return;
    navigator.clipboard?.writeText(newKey).catch(() => {});
    toast.success("Copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {newKey ? "New API key" : "Rotate API key?"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            {newKey
              ? "Copy and store the new key. We won't show it again — rotate any integrations to keep them online."
              : "The current key will stop working immediately. Any integrations using it will fail until you swap in the new key."}
          </DialogDescription>
        </DialogHeader>

        {newKey ? (
          <div className="mx-5 mb-1 flex items-center gap-2 rounded-md border bg-card px-3 py-2 font-mono text-[12px]">
            <span className="flex-1 truncate">{newKey}</span>
            <Button
              variant="ghost"
              size="xs"
              className="text-[11.5px]"
              onClick={copyKey}
            >
              <Copy className="size-3" />
              Copy
            </Button>
          </div>
        ) : null}

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          {newKey ? (
            <>
              <span />
              <Button
                size="sm"
                className="h-9 rounded-md text-[12.5px]"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md text-[12.5px]"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-9 rounded-md text-[12.5px]"
                onClick={rotate}
              >
                <RefreshCw className="size-3.5" />
                Rotate
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
