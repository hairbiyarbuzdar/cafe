"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaymentChannelAction } from "@/lib/actions/payment-channels";
import type { PaymentMethod } from "@/types";

const KIND_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "wallet", label: "Wallet (EasyPaisa, JazzCash…)" },
  { value: "online", label: "Online / Bank transfer" },
];

export function AddPaymentMethodDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [kind, setKind] = React.useState<PaymentMethod>("cash");
  const [opening, setOpening] = React.useState("0");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setKind("cash");
      setOpening("0");
    }
  }, [open]);

  const openingNum = Number(opening);
  const canSave =
    name.trim().length > 1 && Number.isFinite(openingNum) && openingNum >= 0;

  async function save() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = await createPaymentChannelAction({
        name: name.trim(),
        kind,
        openingBalance: openingNum,
      });
      if (!result.ok) {
        toast.error("Couldn't add method", { description: result.error });
        return;
      }
      toast.success(`${name.trim()} added`);
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[460px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Add payment method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <FieldLabel htmlFor="pm-name" required>
            Name
          </FieldLabel>
          <Input
            id="pm-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cash, EasyPaisa, HBL Bank — XX1234"
            className="h-10"
            autoFocus
          />

          <div className="space-y-1.5 pt-1">
            <FieldLabel htmlFor="pm-kind" required>
              Kind
            </FieldLabel>
            <Select
              value={kind}
              onValueChange={(v) => setKind(v as PaymentMethod)}
            >
              <SelectTrigger id="pm-kind" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KIND_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11.5px] text-muted-foreground">
              Drives the icon on the POS payment screen and the kind
              reported to BRA. Cash drawers, mobile wallets, and bank
              transfers can all coexist.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <FieldLabel htmlFor="pm-open">Opening balance (Rs)</FieldLabel>
            <Input
              id="pm-open"
              type="number"
              min={0}
              step="0.01"
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              className="h-10 tabular-nums"
            />
            <p className="text-[11.5px] text-muted-foreground">
              The starting balance you have in this method right now
              (e.g. cash in hand). All cashbook entries against this
              method will adjust this number from here on.
            </p>
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
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
    >
      {children}
      {required ? <span className="ms-0.5 text-destructive">*</span> : null}
    </Label>
  );
}
