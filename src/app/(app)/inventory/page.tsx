import { AlertTriangle, BoxIcon, Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { InventoryTable } from "@/features/inventory/inventory-table";
import { InventoryTrend } from "@/features/inventory/inventory-trend";
import { LowStockAlerts } from "@/features/inventory/low-stock-alerts";
import { SuppliersGrid } from "@/features/inventory/suppliers-grid";
import {
  inventorySummary,
  listInventory,
  listLowStock,
  listSuppliers,
} from "@/lib/queries/inventory";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Inventory" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [summary, items, suppliers, lowStock] = await Promise.all([
    inventorySummary(),
    listInventory(),
    listSuppliers(),
    listLowStock(6),
  ]);

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track ingredients, packaging, and supplier orders in one place."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Download className="size-3.5" />
              Export
            </Button>
            <Button size="sm" className="h-8 rounded-md text-[12.5px]">
              <Plus className="size-3.5" />
              New item
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="SKUs tracked" value={`${summary.skuCount}`} icon={BoxIcon} hint="across all categories" />
        <Stat
          label="Inventory value"
          value={formatCurrency(summary.totalValue, { maximumFractionDigits: 0 })}
          icon={BoxIcon}
          hint="at cost"
        />
        <Stat
          label="Low stock"
          value={`${summary.lowCount}`}
          icon={AlertTriangle}
          hint="below reorder level"
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryTrend />
        </div>
        <LowStockAlerts items={lowStock} suppliers={suppliers} />
      </section>

      <InventoryTable items={items} suppliers={suppliers} />

      <SuppliersGrid suppliers={suppliers} />
    </>
  );
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof BoxIcon;
  tone?: "warning";
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-elevated">
      <div>
        <p className="text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 text-[20px] font-semibold tabular-nums text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
      </div>
      <span
        className={`flex size-9 items-center justify-center rounded-md ${
          tone === "warning"
            ? "bg-warning/15 text-warning-foreground/85"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="size-4" />
      </span>
    </div>
  );
}
