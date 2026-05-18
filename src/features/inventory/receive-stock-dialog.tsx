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
import { Input } from "@/components/ui/input";
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
import { useInventory } from "@/store/inventory-store";
import { formatCurrency } from "@/lib/utils";
import type { InventoryItem, Supplier } from "@/types";

type Props = {
  /** Pre-select this item; the operator can still change it. */
  defaultItemId?: string;
  /** Suppliers to offer in the override dropdown. */
  suppliers: Supplier[];
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
  note: string;
};

export function ReceiveStockDialog({
  defaultItemId,
  suppliers,
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

  // Reset every time we reopen so a previous cancel doesn't leak state.
  React.useEffect(() => {
    if (!open) return;
    const preferred = items.find((i) => i.id === defaultItemId) ?? items[0];
    setForm({
      itemId: preferred?.id ?? "",
      quantity: "1",
      supplierId: preferred?.supplierId ?? "",
      costPerUnit: preferred ? String(preferred.costPerUnit) : "",
      note: "",
    });
  }, [open, defaultItemId, items]);

  const currentItem: InventoryItem | undefined = React.useMemo(
    () => items.find((i) => i.id === form.itemId),
    [items, form.itemId],
  );

  const qtyNum = Number(form.quantity);
  const costNum = Number(form.costPerUnit);
  const canSave =
    Boolean(form.itemId) &&
    Number.isFinite(qtyNum) &&
    qtyNum > 0 &&
    Number.isFinite(costNum) &&
    costNum >= 0;

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
              <Input
                id="rs-qty"
                type="number"
                min={0}
                step="0.001"
                value={form.quantity}
                onChange={(e) => patch("quantity", e.target.value)}
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
              <Input
                id="rs-cost"
                type="number"
                min={0}
                step="0.0001"
                value={form.costPerUnit}
                onChange={(e) => patch("costPerUnit", e.target.value)}
                className="h-10 text-end tabular-nums"
              />
            </Field>
          </div>

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
    note: "",
  };
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
