"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createInventoryItemAction } from "@/lib/actions/inventory";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";
import type { InventoryItem, Supplier } from "@/types";

type Unit = InventoryItem["unit"];

const UNITS: { value: Unit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "L", label: "L" },
  { value: "ml", label: "ml" },
  { value: "pcs", label: "pcs" },
  { value: "box", label: "box" },
];

type Form = {
  name: string;
  sku: string;
  category: string;
  unit: Unit;
  stock: string;
  reorderLevel: string;
  costPerUnit: string;
  supplierId: string;
  expiresAt: string;
  /** Channel to debit when the operator records initial stock with a
   * non-zero cost. Empty string = "don't move money", used when this
   * is just an opening-balance entry (e.g. migrating existing stock
   * into the system after the fact). */
  paymentChannelId: string;
  /** Amount paid up-front. Empty string = "auto" — submit pays
   * `min(cost, channel.currentBalance)` so the operator can leave
   * it blank in the common case. */
  paidAmount: string;
};

function emptyForm(): Form {
  return {
    name: "",
    sku: "",
    category: "",
    unit: "pcs",
    stock: "0",
    reorderLevel: "0",
    costPerUnit: "0",
    supplierId: "",
    expiresAt: "",
    paymentChannelId: "",
    paidAmount: "",
  };
}

/**
 * Self-contained "+ New item" button + sheet.
 *
 * Rendered from the server-side inventory page; the page passes in
 * the supplier list and the union of categories already in use, so
 * the form can offer real suggestions without doing its own fetch.
 */
export function NewInventoryItemButton({
  suppliers,
  knownCategories,
  paymentChannels = [],
}: {
  suppliers: Supplier[];
  knownCategories: string[];
  paymentChannels?: PaymentChannel[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<Form>(emptyForm);
  const activeChannels = React.useMemo(
    () => paymentChannels.filter((c) => !c.archived),
    [paymentChannels],
  );

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm(),
      category: knownCategories[0] ?? "",
      supplierId: suppliers[0]?.id ?? "",
    });
  }, [open, knownCategories, suppliers]);

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const stockNum = Number(form.stock);
  const costNum = Number(form.costPerUnit);
  const initialOutflow =
    Number.isFinite(stockNum) && Number.isFinite(costNum)
      ? round2(Math.max(0, stockNum * costNum))
      : 0;

  const selectedChannel = activeChannels.find(
    (c) => c.id === form.paymentChannelId,
  );
  const channelBalance = selectedChannel
    ? Number(selectedChannel.currentBalance)
    : 0;
  const maxPay = selectedChannel
    ? round2(Math.min(initialOutflow, channelBalance))
    : 0;
  const paidAmount = form.paidAmount.trim() === ""
    ? maxPay
    : round2(Math.max(0, Number(form.paidAmount) || 0));
  const initialOutstanding = round2(Math.max(0, initialOutflow - paidAmount));

  const paidOverCost = paidAmount > initialOutflow + 0.001;
  const paidOverBalance = paidAmount > 0 && paidAmount > channelBalance + 0.001;
  const needsChannel = paidAmount > 0 && !selectedChannel;

  const canSave =
    form.name.trim().length > 1 &&
    form.sku.trim().length > 1 &&
    form.category.trim().length > 0 &&
    Number(form.stock) >= 0 &&
    Number(form.reorderLevel) >= 0 &&
    Number(form.costPerUnit) >= 0 &&
    !paidOverCost &&
    !paidOverBalance &&
    !needsChannel;

  async function handleSave() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = await createInventoryItemAction({
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category.trim(),
        unit: form.unit,
        stock: Number(form.stock),
        reorderLevel: Number(form.reorderLevel),
        costPerUnit: Number(form.costPerUnit),
        supplierId: form.supplierId || null,
        expiresAt: form.expiresAt || null,
        paymentChannelId: form.paymentChannelId || null,
        paidAmount,
      });

      if (!result.ok) {
        toast.error("Couldn't save item", { description: result.error });
        return;
      }
      toast.success(`${form.name.trim()} added to inventory`);
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 rounded-md text-[12.5px]">
          <Plus className="size-3.5" />
          New item
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col overflow-hidden gap-0 p-0 sm:max-w-[520px]"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-[16px] font-semibold tracking-tight">
            New inventory item
          </SheetTitle>
          <SheetDescription className="text-[12.5px]">
            Track a new ingredient, supply, or packaging line. Recipes on
            menu items can reference it as soon as it&apos;s saved.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-5">
            <Section title="Identity">
              <Field label="Name" htmlFor="inv-name">
                <Input
                  id="inv-name"
                  value={form.name}
                  onChange={(e) => patch("name", e.target.value)}
                  placeholder="e.g. Oat milk"
                  className="h-10"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU" htmlFor="inv-sku">
                  <Input
                    id="inv-sku"
                    value={form.sku}
                    onChange={(e) => patch("sku", e.target.value.toUpperCase())}
                    placeholder="DRY-OMK"
                    className="h-10 font-mono text-[12.5px]"
                  />
                </Field>
                <Field label="Category" htmlFor="inv-cat">
                  <Input
                    id="inv-cat"
                    list="inv-category-options"
                    value={form.category}
                    onChange={(e) => patch("category", e.target.value)}
                    placeholder="Coffee, Dairy, …"
                    className="h-10"
                  />
                  <datalist id="inv-category-options">
                    {knownCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
              </div>
            </Section>

            <Section title="Stock">
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <Field label="On hand" htmlFor="inv-stock">
                  <NumericInput
                    id="inv-stock"
                    value={form.stock}
                    onValueChange={(v) => patch("stock", v)}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
                <Field label="Unit">
                  <Select
                    value={form.unit}
                    onValueChange={(v) => patch("unit", v as Unit)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Reorder level" htmlFor="inv-reorder">
                  <NumericInput
                    id="inv-reorder"
                    value={form.reorderLevel}
                    onValueChange={(v) => patch("reorderLevel", v)}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
                <Field label="Cost per unit (Rs.)" htmlFor="inv-cost">
                  <NumericInput
                    id="inv-cost"
                    value={form.costPerUnit}
                    onValueChange={(v) => patch("costPerUnit", v)}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Sourcing">
              <Field label="Supplier">
                <Select
                  value={form.supplierId || "none"}
                  onValueChange={(v) =>
                    patch("supplierId", v === "none" ? "" : v)
                  }
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
                <p className="text-[11px] text-muted-foreground">
                  Add new suppliers from the Suppliers list below the
                  inventory table.
                </p>
              </Field>
              <Field label="Expires (optional)" htmlFor="inv-expires">
                <Input
                  id="inv-expires"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => patch("expiresAt", e.target.value)}
                  className="h-10"
                />
              </Field>
            </Section>

            <Section title="Payment">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Paid from">
                  <Select
                    value={form.paymentChannelId || "none"}
                    onValueChange={(v) => {
                      patch("paymentChannelId", v === "none" ? "" : v);
                      patch("paidAmount", "");
                    }}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Opening stock (no money)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Opening stock (no money)
                      </SelectItem>
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
                <Field
                  label={`Amount to pay (max ${formatCurrency(maxPay)})`}
                  htmlFor="inv-paid"
                >
                  <NumericInput
                    id="inv-paid"
                    value={form.paidAmount}
                    onValueChange={(v) => patch("paidAmount", v)}
                    placeholder={String(maxPay)}
                    disabled={!selectedChannel || initialOutflow <= 0}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                {initialOutflow <= 0 ? (
                  "No cost yet — leave on opening stock until you record a real purchase."
                ) : !selectedChannel ? (
                  "Pick a channel to enable payment. Leaving it on opening stock records the cost as outstanding."
                ) : paidOverCost ? (
                  <span className="text-destructive">
                    Paid can&apos;t exceed the cost ({formatCurrency(initialOutflow)}).
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
                    {initialOutstanding > 0 ? (
                      <>
                        {" "}
                        ·{" "}
                        <span className="font-medium text-warning-foreground/90 tabular-nums">
                          {formatCurrency(initialOutstanding)}
                        </span>{" "}
                        recorded as outstanding to the supplier
                      </>
                    ) : (
                      ". Cost fully cleared."
                    )}
                  </>
                )}
              </p>
            </Section>
          </div>
        </ScrollArea>

        <SheetFooter className="flex flex-row items-center justify-end gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-10 rounded-md text-[12.5px]"
            disabled={!canSave || submitting}
            onClick={handleSave}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Add item
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h3>
      <Separator />
      {children}
    </section>
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
