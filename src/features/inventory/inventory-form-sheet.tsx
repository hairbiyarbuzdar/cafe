"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}: {
  suppliers: Supplier[];
  knownCategories: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<Form>(emptyForm);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm(),
      category: knownCategories[0] ?? "",
      supplierId: suppliers[0]?.id ?? "",
    });
  }, [open, knownCategories, suppliers]);

  const canSave =
    form.name.trim().length > 1 &&
    form.sku.trim().length > 1 &&
    form.category.trim().length > 0 &&
    Number(form.stock) >= 0 &&
    Number(form.reorderLevel) >= 0 &&
    Number(form.costPerUnit) >= 0;

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

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
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[520px]"
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

        <ScrollArea className="flex-1">
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
                  <Input
                    id="inv-stock"
                    type="number"
                    min={0}
                    step="0.001"
                    value={form.stock}
                    onChange={(e) => patch("stock", e.target.value)}
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
                  <Input
                    id="inv-reorder"
                    type="number"
                    min={0}
                    step="0.001"
                    value={form.reorderLevel}
                    onChange={(e) => patch("reorderLevel", e.target.value)}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
                <Field label="Cost per unit (Rs.)" htmlFor="inv-cost">
                  <Input
                    id="inv-cost"
                    type="number"
                    min={0}
                    step="0.0001"
                    value={form.costPerUnit}
                    onChange={(e) => patch("costPerUnit", e.target.value)}
                    className="h-10 text-end tabular-nums"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Sourcing">
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
