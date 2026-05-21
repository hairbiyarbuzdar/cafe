"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createMenuItemAction,
  deleteMenuItemAction,
  updateMenuItemAction,
} from "@/lib/actions/menu";
import { useCategories } from "@/store/categories-store";
import { useInventory } from "@/store/inventory-store";
import { useStations } from "@/store/stations-store";
import type { MenuItem, RecipeIngredient } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the sheet edits this item; otherwise it creates a new one. */
  item: MenuItem | null;
};

type Form = {
  name: string;
  description: string;
  categoryId: string;
  stationId: string;
  price: string;
  sku: string;
  pctCode: string;
  prepTimeMinutes: string;
  available: boolean;
  posVisible: boolean;
  popular: boolean;
  recipe: RecipeIngredient[];
};

function emptyForm(): Form {
  return {
    name: "",
    description: "",
    categoryId: "",
    stationId: "",
    price: "",
    sku: "",
    pctCode: "",
    prepTimeMinutes: "",
    available: true,
    posVisible: true,
    popular: false,
    recipe: [],
  };
}

function toForm(item: MenuItem): Form {
  return {
    name: item.name,
    description: item.description ?? "",
    categoryId: item.categoryId,
    stationId: item.stationId,
    price: String(item.price),
    sku: item.sku ?? "",
    pctCode: item.pctCode ?? "",
    prepTimeMinutes: item.prepTimeMinutes ? String(item.prepTimeMinutes) : "",
    available: item.available,
    posVisible: item.posVisible,
    popular: item.popular ?? false,
    recipe: item.recipe ?? [],
  };
}

export function MenuFormSheet({ open, onOpenChange, item }: Props) {
  const router = useRouter();
  const stations = useStations((s) => s.stations);
  const categories = useCategories((s) => s.categories);
  const inventory = useInventory((s) => s.items);

  const [form, setForm] = React.useState<Form>(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (item) setForm(toForm(item));
    else
      setForm({
        ...emptyForm(),
        categoryId: categories[0]?.id ?? "",
        stationId: stations[0]?.id ?? "",
      });
  }, [open, item, stations, categories]);

  const isEditing = Boolean(item);

  const canSave =
    form.name.trim().length > 1 &&
    form.categoryId &&
    form.stationId &&
    Number(form.price) > 0;

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      categoryId: form.categoryId,
      stationId: form.stationId,
      price: Number(form.price),
      sku: form.sku.trim() || null,
      pctCode: form.pctCode.trim() || null,
      prepTimeMinutes: form.prepTimeMinutes
        ? Math.max(1, Math.floor(Number(form.prepTimeMinutes)))
        : null,
      available: form.available,
      posVisible: form.posVisible,
      popular: form.popular,
      recipe: form.recipe,
    };
    try {
      const result = item
        ? await updateMenuItemAction(item.id, payload)
        : await createMenuItemAction(payload);
      if (!result.ok) {
        toast.error(item ? "Couldn't save" : "Couldn't add", {
          description: result.error,
        });
        return;
      }
      toast.success(
        item ? `${payload.name} updated` : `${payload.name} added to menu`,
      );
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!item || submitting) return;
    setSubmitting(true);
    try {
      const result = await deleteMenuItemAction(item.id);
      if (!result.ok) {
        toast.error("Couldn't delete", { description: result.error });
        return;
      }
      toast.success(`${item.name} removed from menu`);
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  function addIngredient() {
    const firstUnused = inventory.find(
      (inv) => !form.recipe.some((r) => r.inventoryItemId === inv.id),
    );
    if (!firstUnused) return;
    patch("recipe", [
      ...form.recipe,
      { inventoryItemId: firstUnused.id, quantity: 1, unit: firstUnused.unit },
    ]);
  }

  function patchIngredient(index: number, patchObj: Partial<RecipeIngredient>) {
    patch(
      "recipe",
      form.recipe.map((r, i) => (i === index ? { ...r, ...patchObj } : r)),
    );
  }

  function removeIngredient(index: number) {
    patch(
      "recipe",
      form.recipe.filter((_, i) => i !== index),
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col overflow-hidden gap-0 p-0 sm:max-w-[520px]"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-[16px] font-semibold tracking-tight">
            {isEditing ? "Edit menu item" : "New menu item"}
          </SheetTitle>
          <SheetDescription className="text-[12.5px]">
            Configure how this item appears on the POS and which kitchen station prepares it.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-5">
            <Section title="Basics">
              <Field label="Name" htmlFor="m-name">
                <Input
                  id="m-name"
                  value={form.name}
                  onChange={(e) => patch("name", e.target.value)}
                  placeholder="e.g. Caramel Macchiato"
                  className="h-10"
                />
              </Field>
              <Field label="Description" htmlFor="m-desc">
                <Textarea
                  id="m-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => patch("description", e.target.value)}
                  placeholder="One-line description shown on the POS card"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) => patch("categoryId", v)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Kitchen station">
                  <Select
                    value={form.stationId}
                    onValueChange={(v) => patch("stationId", v)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            <Section title="Pricing & operations">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (Rs.)" htmlFor="m-price">
                  <NumericInput
                    id="m-price"
                    value={form.price}
                    onValueChange={(v) => patch("price", v)}
                    className="h-10"
                  />
                </Field>
                <Field label="Prep time (min)" htmlFor="m-prep">
                  <NumericInput
                    id="m-prep"
                    decimal={false}
                    value={form.prepTimeMinutes}
                    onValueChange={(v) => patch("prepTimeMinutes", v)}
                    className="h-10"
                  />
                </Field>
                <Field label="SKU" htmlFor="m-sku">
                  <Input
                    id="m-sku"
                    value={form.sku}
                    onChange={(e) => patch("sku", e.target.value)}
                    placeholder="ESP-001"
                    className="h-10 font-mono text-[12.5px]"
                  />
                </Field>
                <Field label="PCT code (BRA)" htmlFor="m-pct">
                  <Input
                    id="m-pct"
                    value={form.pctCode}
                    onChange={(e) =>
                      patch("pctCode", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="00000000"
                    className="h-10 font-mono text-[12.5px] tabular-nums"
                    maxLength={8}
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <ToggleRow
                  label="Available"
                  description="Off means the item is 86'd — POS still shows it but greyed out"
                  checked={form.available}
                  onChange={(v) => patch("available", v)}
                />
                <ToggleRow
                  label="Show on POS"
                  description="When off, hide from the POS screen entirely"
                  checked={form.posVisible}
                  onChange={(v) => patch("posVisible", v)}
                />
                <ToggleRow
                  label="Mark as popular"
                  description="Highlights this item on the POS and the Popular tab"
                  checked={form.popular}
                  onChange={(v) => patch("popular", v)}
                />
              </div>
            </Section>

            <Section
              title="Recipe"
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="h-8 rounded-md text-[12px]"
                >
                  <Plus className="size-3.5" />
                  Add ingredient
                </Button>
              }
            >
              <p className="-mt-1 text-[11.5px] text-muted-foreground">
                Linked inventory items get auto-deducted from stock when this item sells.
              </p>
              {form.recipe.length === 0 ? (
                <div className="rounded-md border border-dashed bg-muted/40 p-3 text-center text-[12.5px] text-muted-foreground">
                  No ingredients linked
                </div>
              ) : (
                <ul className="space-y-2">
                  {form.recipe.map((r, idx) => (
                    <li
                      key={`${r.inventoryItemId}-${idx}`}
                      className="grid grid-cols-[1fr_90px_70px_36px] items-center gap-2 rounded-md border bg-card px-2 py-1.5"
                    >
                      <Select
                        value={r.inventoryItemId}
                        onValueChange={(v) => {
                          const inv = inventory.find((i) => i.id === v);
                          patchIngredient(idx, {
                            inventoryItemId: v,
                            unit: inv?.unit ?? r.unit,
                          });
                        }}
                      >
                        <SelectTrigger size="sm" className="h-8 text-[12.5px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((inv) => (
                            <SelectItem key={inv.id} value={inv.id}>
                              {inv.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <NumericInput
                        value={r.quantity}
                        onValueChange={(v) =>
                          patchIngredient(idx, {
                            quantity: Math.max(0, Number(v) || 0),
                          })
                        }
                        className="h-8 text-end text-[12.5px] tabular-nums"
                      />
                      <span className="rounded-md border bg-muted/40 px-2 py-1 text-center text-[11.5px] font-mono text-muted-foreground">
                        {r.unit}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-8 rounded-md text-muted-foreground hover:text-destructive"
                        onClick={() => removeIngredient(idx)}
                        aria-label="Remove ingredient"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </ScrollArea>

        <SheetFooter className="flex flex-row items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3">
          <div>
            {isEditing ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={submitting}
                className="h-10 rounded-md text-[12.5px] text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-md text-[12.5px]"
              onClick={() => onOpenChange(false)}
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
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isEditing ? "Save changes" : "Add item"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
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
