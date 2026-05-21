"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/shared/section-card";
import { TimeInput12h } from "@/features/settings/workspace/time-input-12h";
import {
  updateWorkspaceAction,
  type DayKey,
} from "@/lib/actions/workspace";
import type { Workspace } from "@/lib/queries/workspace";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { value: "PKR", label: "Pakistani Rupee (PKR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "AED", label: "UAE Dirham (AED)" },
  { value: "SAR", label: "Saudi Riyal (SAR)" },
];

const TIMEZONES = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/Berlin",
  "Asia/Riyadh",
];

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

type FormState = {
  name: string;
  legalEntity: string;
  taxId: string;
  phone: string;
  currency: string;
  timezone: string;
  city: string;
  addressLine: string;
  receiptFooter: string;
  receiptWidth: "80" | "58";
  hours: Record<DayKey, { open: string | null; close: string | null }>;
};

function workspaceToForm(w: Workspace): FormState {
  return {
    name: w.name,
    legalEntity: w.legalEntity ?? "",
    taxId: w.taxId ?? "",
    phone: w.phone ?? "",
    currency: w.currency,
    timezone: w.timezone,
    city: w.city ?? "",
    addressLine: w.addressLine ?? "",
    receiptFooter: w.receiptFooter ?? "",
    receiptWidth: w.receiptWidth,
    hours: {
      mon: w.hours.mon,
      tue: w.hours.tue,
      wed: w.hours.wed,
      thu: w.hours.thu,
      fri: w.hours.fri,
      sat: w.hours.sat,
      sun: w.hours.sun,
    },
  };
}

export function WorkspacePanel({ workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormState>(() =>
    workspaceToForm(workspace),
  );
  const [submitting, setSubmitting] = React.useState(false);

  // Pull fresh values from the server when the layout re-renders.
  React.useEffect(() => {
    setForm(workspaceToForm(workspace));
  }, [workspace]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setDayHours(
    day: DayKey,
    next: { open: string | null; close: string | null },
  ) {
    setForm((f) => ({
      ...f,
      hours: { ...f.hours, [day]: next },
    }));
  }

  async function save() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await updateWorkspaceAction({
        name: form.name.trim(),
        legalEntity: form.legalEntity.trim() || null,
        taxId: form.taxId.trim() || null,
        phone: form.phone.trim() || null,
        currency: form.currency,
        timezone: form.timezone,
        city: form.city.trim() || null,
        addressLine: form.addressLine.trim() || null,
        receiptFooter: form.receiptFooter.trim() || null,
        receiptWidth: form.receiptWidth,
        hours: form.hours,
      });
      if (!result.ok) {
        toast.error("Couldn't save workspace", { description: result.error });
        return;
      }
      toast.success("Workspace saved");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Workspace details"
        description="The café identity used across receipts, reports, sidebar, and the dashboard greeting."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Café name" htmlFor="ws-name" required>
            <Input
              id="ws-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              className="h-10"
              maxLength={60}
            />
          </Field>
          <Field label="Legal entity" htmlFor="ws-legal">
            <Input
              id="ws-legal"
              value={form.legalEntity}
              onChange={(e) => patch("legalEntity", e.target.value)}
              placeholder="e.g. Brewline Coffee Co. (Pvt) Ltd"
              className="h-10"
            />
          </Field>
          <Field label="Tax ID / NTN" htmlFor="ws-tax">
            <Input
              id="ws-tax"
              value={form.taxId}
              onChange={(e) => patch("taxId", e.target.value)}
              placeholder="e.g. 38-7724918"
              className="h-10 font-mono text-[13px]"
            />
          </Field>
          <Field label="Phone number" htmlFor="ws-phone">
            <Input
              id="ws-phone"
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
              placeholder="e.g. +92 21 1234 5678"
              className="h-10"
              inputMode="tel"
            />
            <p className="text-[11.5px] text-muted-foreground">
              Shown in exported PDF footers and the XLSX branding header.
            </p>
          </Field>
          <Field label="Currency" htmlFor="ws-currency">
            <Select
              value={form.currency}
              onValueChange={(v) => patch("currency", v)}
            >
              <SelectTrigger id="ws-currency" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="City" htmlFor="ws-city">
            <Input
              id="ws-city"
              value={form.city}
              onChange={(e) => patch("city", e.target.value)}
              placeholder="e.g. Karachi"
              className="h-10"
            />
          </Field>
          <Field label="Address line" htmlFor="ws-address">
            <Input
              id="ws-address"
              value={form.addressLine}
              onChange={(e) => patch("addressLine", e.target.value)}
              placeholder="e.g. Shop 14, Clifton Block 2"
              className="h-10"
            />
          </Field>
          <Field label="Time zone" htmlFor="ws-tz" className="md:col-span-2">
            <Select
              value={form.timezone}
              onValueChange={(v) => patch("timezone", v)}
            >
              <SelectTrigger id="ws-tz" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label="Receipt footer"
            htmlFor="ws-footer"
            className="md:col-span-2"
          >
            <Textarea
              id="ws-footer"
              rows={2}
              value={form.receiptFooter}
              onChange={(e) => patch("receiptFooter", e.target.value)}
              placeholder="Thanks for visiting! Follow @ourcafe for daily specials."
              className="text-[13px]"
            />
            <p className="text-[11.5px] text-muted-foreground">
              Printed at the bottom of every receipt. Leave blank to omit.
            </p>
          </Field>
          <Field
            label="Thermal roll width"
            htmlFor="ws-width"
            className="md:col-span-2"
          >
            <Select
              value={form.receiptWidth}
              onValueChange={(v) => patch("receiptWidth", v === "58" ? "58" : "80")}
            >
              <SelectTrigger id="ws-width" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80">80 mm (standard café roll)</SelectItem>
                <SelectItem value="58">58 mm (compact / handheld roll)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11.5px] text-muted-foreground">
              Drives layout of every receipt, kitchen ticket, and inventory slip.
            </p>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Operating hours"
        description="Toggle a day off to mark it closed. Times are stored in 24-hour internally; this panel shows AM/PM."
      >
        <ul className="divide-y rounded-md border bg-card">
          {DAYS.map((d) => (
            <DayRow
              key={d.key}
              label={d.label}
              hours={form.hours[d.key]}
              onChange={(next) => setDayHours(d.key, next)}
            />
          ))}
        </ul>
      </SectionCard>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
          onClick={() => setForm(workspaceToForm(workspace))}
          disabled={submitting}
        >
          Reset
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
          onClick={save}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}

function DayRow({
  label,
  hours,
  onChange,
}: {
  label: string;
  hours: { open: string | null; close: string | null };
  onChange: (next: { open: string | null; close: string | null }) => void;
}) {
  const isOpen = !!hours.open && !!hours.close;
  return (
    <li className="flex flex-wrap items-center gap-3 px-4 py-2.5">
      <div className="flex w-24 shrink-0 items-center gap-2">
        <Switch
          checked={isOpen}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange({ open: hours.open ?? "09:00", close: hours.close ?? "17:00" });
            } else {
              onChange({ open: null, close: null });
            }
          }}
        />
        <span className="text-[12.5px] font-medium text-foreground">{label}</span>
      </div>
      {isOpen ? (
        <>
          <TimeInput12h
            value={hours.open}
            onChange={(next) => onChange({ open: next, close: hours.close })}
          />
          <span className="text-muted-foreground">to</span>
          <TimeInput12h
            value={hours.close}
            onChange={(next) => onChange({ open: hours.open, close: next })}
          />
        </>
      ) : (
        <span className="text-[12px] italic text-muted-foreground">Closed</span>
      )}
    </li>
  );
}

function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
      >
        {label}
        {required ? <span className="ms-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
