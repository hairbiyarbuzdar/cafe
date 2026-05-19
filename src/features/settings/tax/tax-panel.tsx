"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/shared/section-card";
import { updateTaxConfigAction } from "@/lib/actions/tax";
import type { TaxConfig } from "@/lib/queries/tax";

export function TaxPanel({ config }: { config: TaxConfig }) {
  const router = useRouter();
  const [label, setLabel] = React.useState(config.label);
  const [percent, setPercent] = React.useState(
    (config.rate * 100).toFixed(2),
  );
  const [submitting, setSubmitting] = React.useState(false);

  // Pull fresh values from the server when the layout re-renders
  // (e.g. another tab saved a different rate).
  React.useEffect(() => {
    setLabel(config.label);
    setPercent((config.rate * 100).toFixed(2));
  }, [config.label, config.rate]);

  const parsedPercent = Number(percent);
  const validPercent =
    Number.isFinite(parsedPercent) && parsedPercent >= 0 && parsedPercent <= 100;
  const dirty =
    label !== config.label ||
    (validPercent && Math.abs(parsedPercent / 100 - config.rate) > 1e-9);

  async function save() {
    if (!dirty || submitting || !validPercent) return;
    setSubmitting(true);
    try {
      const result = await updateTaxConfigAction({
        rate: parsedPercent / 100,
        label: label.trim() || "Tax",
      });
      if (!result.ok) {
        toast.error("Couldn't save tax settings", { description: result.error });
        return;
      }
      toast.success("Tax settings saved", {
        description: `${result.data.label} · ${(result.data.rate * 100).toFixed(2)}%`,
      });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard
      title="Tax"
      description="Sales tax applied to every POS order. The cart total updates immediately after saving."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
        <div className="space-y-1.5">
          <Label htmlFor="tax-label" className="text-[12.5px] font-medium">
            Label
          </Label>
          <Input
            id="tax-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Tax"
            maxLength={24}
            className="h-10 text-[14px]"
          />
          <p className="text-[11.5px] text-muted-foreground">
            Shows on the cart total row, e.g. &quot;{label || "Tax"} (
            {validPercent ? parsedPercent.toFixed(2) : "—"}%)&quot;.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tax-rate" className="text-[12.5px] font-medium">
            Rate (%)
          </Label>
          <Input
            id="tax-rate"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            max={100}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="h-10 text-[14px] tabular-nums"
          />
          <p className="text-[11.5px] text-muted-foreground">
            Decimal allowed. e.g. <span className="font-mono">8.5</span> for
            8.5%.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
          onClick={() => {
            setLabel(config.label);
            setPercent((config.rate * 100).toFixed(2));
          }}
          disabled={!dirty || submitting}
        >
          Reset
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
          onClick={save}
          disabled={!dirty || submitting || !validPercent}
        >
          {submitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </SectionCard>
  );
}
