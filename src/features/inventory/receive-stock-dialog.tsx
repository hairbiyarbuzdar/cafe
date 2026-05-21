"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Boxes, Loader2 } from "lucide-react";
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
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { receiveStockAction } from "@/lib/actions/inventory";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { useInventory } from "@/store/inventory-store";
import { formatCurrency } from "@/lib/utils";
import type { InventoryItem, Supplier } from "@/types";

type Props = {
  /** Pre-select this item; the operator can still change it. */
  defaultItemId?: string;
  /** Suppliers to offer in the override dropdown. */
  suppliers: Supplier[];
  /** Active payment channels — the dialog requires picking one when
   * the restock has a non-zero cost so the cash outflow is recorded
   * against a specific channel. */
  paymentChannels?: PaymentChannel[];
  /** Optional custom trigger. Defaults to the standard "Receive stock" button. */
  trigger?: React.ReactNode;
  /** Visible only when controlled externally (no trigger). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type Form = {
  itemId: string;
  quantity: string;
  supplierId: string;
  costPerUnit: string;
  paymentChannelId: string;
  /** Amount paid up-front. Empty string = "auto" — submit treats it
   * as `min(cost, channel.currentBalance)` so the operator can leave
   * it alone in the common case. */
  paidAmount: string;
  note: string;
};

export function ReceiveStockDialog({
  defaultItemId,
  suppliers,
  paymentChannels = [],
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const router = useRouter();
  const items = useInventory((s) => s.items);

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;

  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<Form>(() => emptyForm(defaultItemId));

  const activeChannels = React.useMemo(
    () => paymentChannels.filter((c) => !c.archived),
    [paymentChannels],
  );

  // Reset every time we reopen so a previous cancel doesn't leak state.
  React.useEffect(() => {
    if (!open) return;
    const preferred = items.find((i) => i.id === defaultItemId) ?? items[0];
    setForm({
      itemId: preferred?.id ?? "",
      quantity: "1",
      supplierId: preferred?.supplierId ?? "",
      costPerUnit: preferred ? String(preferred.costPerUnit) : "",
      paymentChannelId: activeChannels[0]?.id ?? "",
      paidAmount: "",
      note: "",
    });
  }, [open, defaultItemId, items, activeChannels]);

  const currentItem: InventoryItem | undefined = React.useMemo(
    () => items.find((i) => i.id === form.itemId),
    [items, form.itemId],
  );

  const qtyNum = Number(form.quantity);
  const costNum = Number(form.costPerUnit);
  const outflow =
    Number.isFinite(qtyNum) && Number.isFinite(costNum)
      ? round2(Math.max(0, qtyNum * costNum))
      : 0;

  const selectedChannel = activeChannels.find(
    (c) => c.id === form.paymentChannelId,
  );
  const channelBalance = selectedChannel
    ? Number(selectedChannel.currentBalance)
    : 0;
  // Max paid is bounded by both the cost (no overpaying) and the
  // channel's actual headroom (no negative balances). When no
  // channel is picked yet, paying anything would be nonsensical, so
  // cap at 0.
  const maxPay = selectedChannel
    ? round2(Math.min(outflow, channelBalance))
    : 0;
  // The "auto" sentinel (empty input) means "pay as much as you can
  // up to the cost" — typically what an operator wants on a normal
  // restock. They can override with an explicit number for partial.
  const paidAmount = form.paidAmount.trim() === ""
    ? maxPay
    : round2(Math.max(0, Number(form.paidAmount) || 0));
  const outstanding = round2(Math.max(0, outflow - paidAmount));

  const paidOverCost = paidAmount > outflow + 0.001;
  const paidOverBalance = paidAmount > 0 && paidAmount > channelBalance + 0.001;
  const needsChannel = paidAmount > 0 && !selectedChannel;

  const canSave =
    Boolean(form.itemId) &&
    Number.isFinite(qtyNum) &&
    qtyNum > 0 &&
    Number.isFinite(costNum) &&
    costNum >= 0 &&
    !paidOverCost &&
    !paidOverBalance &&
    !needsChannel;

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function pickItem(id: string) {
    const next = items.find((i) => i.id === id);
    setForm((f) => ({
      ...f,
      itemId: id,
      supplierId: next?.supplierId ?? f.supplierId,
      costPerUnit: next ? String(next.costPerUnit) : f.costPerUnit,
    }));
  }

  async function handleSave() {
    if (!canSave || !currentItem || submitting) return;
    setSubmitting(true);
    try {
      const result = await receiveStockAction({
        inventoryItemId: form.itemId,
        quantity: qtyNum,
        supplierId: form.supplierId || null,
        costPerUnit: costNum,
        paymentChannelId: form.paymentChannelId || null,
        paidAmount,
        note: form.note.trim() || undefined,
      });
      if (!result.ok) {
        toast.error("Couldn't update stock", { description: result.error });
        return;
      }
      toast.success(
        `Received ${qtyNum} ${currentItem.unit} of ${currentItem.name}`,
        {
          description: `New on-hand: ${result.newStock.toLocaleString()} ${currentItem.unit}`,
        },
      );
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const trigEl = trigger ?? (
    <Button size="sm" className="h-9 flex-1 rounded-md text-[13px] md:flex-none">
      <Boxes className="size-4" />
      Receive stock
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger === null ? null : <DialogTrigger asChild>{trigEl}</DialogTrigger>}
      <DialogContent className="max-w-[460px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Receive stock
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Record stock arriving from a supplier. Adds to on-hand quantity
            and writes an inventory movement for the audit log.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <Field label="Item" htmlFor="rs-item">
            <Select value={form.itemId} onValueChange={pickItem}>
              <SelectTrigger id="rs-item" className="h-10">
                <SelectValue placeholder="Pick an item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}{" "}
                    <span className="text-muted-foreground">
                      · {i.stock} {i.unit} on hand
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-[1fr_90px] gap-3">
            <Field label="Quantity" htmlFor="rs-qty">
              <NumericInput
                id="rs-qty"
                value={form.quantity}
                onValueChange={(v) => patch("quantity", v)}
                className="h-10 text-end tabular-nums"
              />
            </Field>
            <Field label="Unit">
              <div className="flex h-10 items-center justify-center rounded-md border bg-muted/40 px-3 text-[13px] font-mono text-muted-foreground">
                {currentItem?.unit ?? "—"}
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Supplier">
              <Select
                value={form.supplierId || "none"}
                onValueChange={(v) => patch("supplierId", v === "none" ? "" : v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="No supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No supplier</SelectItem>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cost per unit (Rs.)" htmlFor="rs-cost">
              <NumericInput
                id="rs-cost"
                value={form.costPerUnit}
                onValueChange={(v) => patch("costPerUnit", v)}
                className="h-10 text-end tabular-nums"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Paid from">
              <Select
                value={form.paymentChannelId || "none"}
                onValueChange={(v) => {
                  patch("paymentChannelId", v === "none" ? "" : v);
                  // Clear the explicit override when the channel
                  // changes — the new auto-cap is almost always what
                  // the operator wants.
                  patch("paidAmount", "");
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="No payment movement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No payment movement</SelectItem>
                  {activeChannels.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ·{" "}
                      <span className="text-muted-foreground tabular-nums">
                        {formatCurrency(Number(c.currentBalance))}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={`Amount to pay (max ${formatCurrency(maxPay)})`} htmlFor="rs-paid">
              <NumericInput
                id="rs-paid"
                value={form.paidAmount}
                onValueChange={(v) => patch("paidAmount", v)}
                placeholder={String(maxPay)}
                disabled={!selectedChannel || outflow <= 0}
                className="h-10 text-end tabular-nums"
              />
            </Field>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {outflow <= 0 ? (
              "No cost — leave the payment fields alone for an opening-balance entry."
            ) : !selectedChannel ? (
              "Pick a channel to enable partial / full payment. Leave it blank to record the whole cost as outstanding."
            ) : paidOverCost ? (
              <span className="text-destructive">
                Paid can&apos;t exceed the cost ({formatCurrency(outflow)}).
              </span>
            ) : paidOverBalance ? (
              <span className="text-destructive">
                {selectedChannel.name} only has{" "}
                {formatCurrency(channelBalance)} available.
              </span>
            ) : (
              <>
                Will debit{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(paidAmount)}
                </span>{" "}
                from {selectedChannel.name}
                {outstanding > 0 ? (
                  <>
                    {" "}
                    · {" "}
                    <span className="font-medium text-warning-foreground/90 tabular-nums">
                      {formatCurrency(outstanding)}
                    </span>{" "}
                    becomes outstanding for the supplier
                  </>
                ) : (
                  ". Cost fully cleared."
                )}
              </>
            )}
          </p>

          <Field label="Note (optional)" htmlFor="rs-note">
            <Textarea
              id="rs-note"
              rows={2}
              value={form.note}
              onChange={(e) => patch("note", e.target.value)}
              placeholder="PO #, delivery slip, batch…"
              className="text-[13px]"
            />
          </Field>

          {currentItem && qtyNum > 0 ? (
            <p className="rounded-md border bg-muted/30 px-3 py-2 text-[11.5px] text-muted-foreground">
              <span className="text-foreground">
                {currentItem.stock} → {currentItem.stock + qtyNum}
              </span>{" "}
              {currentItem.unit} on hand. Adds{" "}
              <span className="text-foreground">
                {formatCurrency(qtyNum * (Number.isFinite(costNum) ? costNum : 0))}
              </span>{" "}
              in cost value.
            </p>
          ) : null}
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
            onClick={handleSave}
            disabled={!canSave || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Receiving…
              </>
            ) : (
              <>
                <Boxes className="size-3.5" />
                Receive
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function emptyForm(defaultItemId?: string): Form {
  return {
    itemId: defaultItemId ?? "",
    quantity: "1",
    supplierId: "",
    costPerUnit: "",
    paymentChannelId: "",
    paidAmount: "",
    note: "",
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
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
