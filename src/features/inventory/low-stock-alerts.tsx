import { AlertTriangle, Package } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import type { InventoryItem, Supplier } from "@/types";

export function LowStockAlerts({
  items,
  suppliers,
}: {
  items: InventoryItem[];
  suppliers: Supplier[];
}) {
  const low = items;

  return (
    <SectionCard
      title="Low stock"
      description={`${low.length} items below reorder level`}
      action={
        <Button variant="ghost" size="xs" className="text-[11.5px]">
          View all
        </Button>
      }
      contentClassName="p-0"
    >
      <ul className="divide-y">
        {low.map((it) => {
          const supplier = suppliers.find((s) => s.id === it.supplierId);
          return (
            <li
              key={it.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/12 text-destructive">
                <AlertTriangle className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-foreground">
                  {it.name}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                  {it.stock}
                  <span className="ms-0.5">{it.unit}</span> on hand · reorder ≥{" "}
                  {it.reorderLevel}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button
                  size="xs"
                  variant="outline"
                  className="h-6 rounded-md text-[11px]"
                >
                  <Package className="size-3" />
                  Order
                </Button>
                <span className="text-[10.5px] text-muted-foreground">
                  {supplier?.name.split(" ")[0] ?? "—"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
