"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import { useCategories } from "@/store/categories-store";
import { useMenu } from "@/store/menu-store";
import { cn } from "@/lib/utils";

const COLORS = [
  "#6F4E37",
  "#8B5E3C",
  "#3B82F6",
  "#4F7942",
  "#D4A24C",
  "#C2410C",
  "#9333EA",
  "#0F766E",
  "#BE185D",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoriesManager({ open, onOpenChange }: Props) {
  const router = useRouter();
  const categories = useCategories((s) => s.categories);
  const menuItems = useMenu((s) => s.items);

  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(COLORS[0]!);
  const [submitting, setSubmitting] = React.useState(false);

  async function add() {
    const trimmed = name.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      const result = await createCategoryAction({ name: trimmed, color });
      if (!result.ok) {
        toast.error("Couldn't add category", { description: result.error });
        return;
      }
      toast.success(`${trimmed} added`);
      setName("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function tryRemove(id: string, label: string) {
    const result = await deleteCategoryAction(id);
    if (!result.ok) {
      toast.error(`Couldn't delete ${label}`, { description: result.error });
      return;
    }
    toast.success(`${label} removed`);
    router.refresh();
  }

  async function renameCategory(
    id: string,
    current: { color: string },
    nextName: string,
  ) {
    const result = await updateCategoryAction(id, {
      name: nextName,
      color: current.color,
    });
    if (!result.ok) {
      toast.error("Couldn't rename category", { description: result.error });
      return;
    }
    router.refresh();
  }

  async function recolor(id: string, currentName: string, nextColor: string) {
    const result = await updateCategoryAction(id, {
      name: currentName,
      color: nextColor,
    });
    if (!result.ok) {
      toast.error("Couldn't update color", { description: result.error });
      return;
    }
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[min(640px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[640px]">
        <DialogHeader className="border-b px-5 pb-4 pt-5">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold tracking-tight">
            <Tag className="size-4 text-primary" />
            Menu categories
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Categories group items on the POS grid and menu. Each menu item
            belongs to exactly one.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 border-b bg-surface-1 px-5 py-3.5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label
              htmlFor="cat-name"
              className="text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pastries, Smoothies"
              className="h-10 text-[13.5px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              className="h-10 w-full rounded-md text-[13px] sm:w-auto"
              onClick={add}
              disabled={submitting}
            >
              <Plus className="size-4" />
              Add category
            </Button>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground">
              Color
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Pick color ${c}`}
                  className={cn(
                    "size-7 rounded-md border-2 transition-transform",
                    color === c
                      ? "scale-110 border-foreground/60"
                      : "border-transparent",
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {categories.length === 0 ? (
            <p className="px-5 py-10 text-center text-[12.5px] text-muted-foreground">
              No categories yet. Add the first one above.
            </p>
          ) : (
            <ul className="divide-y">
              {categories.map((c) => {
                const linked = menuItems.filter(
                  (m) => m.categoryId === c.id,
                ).length;
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <ColorPickerSwatch
                      color={c.color}
                      onChange={(next) => recolor(c.id, c.name, next)}
                    />
                    <div className="min-w-0 flex-1">
                      <CategoryNameInput
                        defaultName={c.name}
                        onCommit={(next) =>
                          renameCategory(c.id, { color: c.color }, next)
                        }
                      />
                      <p className="px-1 text-[11.5px] text-muted-foreground">
                        {linked} item{linked === 1 ? "" : "s"} ·{" "}
                        <span className="font-mono text-foreground/80">
                          {c.slug}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-md text-muted-foreground hover:text-destructive"
                      onClick={() => tryRemove(c.id, c.name)}
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function CategoryNameInput({
  defaultName,
  onCommit,
}: {
  defaultName: string;
  onCommit: (next: string) => void;
}) {
  const [value, setValue] = React.useState(defaultName);
  React.useEffect(() => setValue(defaultName), [defaultName]);
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const next = value.trim();
        if (next && next !== defaultName) onCommit(next);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className="h-8 border-transparent bg-transparent px-1 text-[13.5px] font-medium hover:border-border focus:border-border"
    />
  );
}

function ColorPickerSwatch({
  color,
  onChange,
}: {
  color: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex size-8 items-center justify-center rounded-md ring-1 ring-border/60 transition-transform hover:scale-105"
        style={{ background: color }}
        aria-label="Change color"
      />
      {open ? (
        <div className="absolute left-0 top-9 z-10 flex flex-wrap gap-1.5 rounded-md border bg-popover p-2 shadow-elevated">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              aria-label={`Pick color ${c}`}
              className={cn(
                "size-6 rounded-md border-2 transition-transform",
                color === c
                  ? "scale-110 border-foreground/60"
                  : "border-transparent",
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
