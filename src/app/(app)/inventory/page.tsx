import { AlertTriangle, BoxIcon } from "lucide-react";

import { PageHeader } from "@/components/layouts/page-header";
import { ExportMenu } from "@/components/shared/export-menu";
import { InventoryTable } from "@/features/inventory/inventory-table";
import { InventoryTrend } from "@/features/inventory/inventory-trend";
import { LowStockAlerts } from "@/features/inventory/low-stock-alerts";
import { NewInventoryItemButton } from "@/features/inventory/inventory-form-sheet";
import { SuppliersGrid } from "@/features/inventory/suppliers-grid";
import { stockTrend7d } from "@/lib/queries/analytics";
import {
  inventorySummary,
  listInventory,
  listLowStock,
  listSuppliers,
} from "@/lib/queries/inventory";
import { listPaymentChannels } from "@/lib/queries/payment-channels";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Inventory" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [summary, items, suppliers, lowStock, trend, paymentChannels] =
    await Promise.all([
      inventorySummary(),
      listInventory(),
      listSuppliers(),
      listLowStock(6),
      stockTrend7d(),
      listPaymentChannels(),
    ]);

  const knownCategories = Array.from(
    new Set(items.map((i) => i.category)),
  ).sort();

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track ingredients, packaging, and supplier orders in one place."
        actions={
          <>
            <ExportMenu
              modules={["inventory", "suppliers"]}
              scope="inventory"
              title="Inventory"
            />
            <NewInventoryItemButton
              suppliers={suppliers}
              knownCategories={knownCategories}
              paymentChannels={paymentChannels}
            />
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
          <InventoryTrend data={trend} />
        </div>
        <LowStockAlerts items={lowStock} suppliers={suppliers} />
      </section>

      <InventoryTable
        items={items}
        suppliers={suppliers}
        paymentChannels={paymentChannels}
      />

      <SuppliersGrid suppliers={suppliers} paymentChannels={paymentChannels} />
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
