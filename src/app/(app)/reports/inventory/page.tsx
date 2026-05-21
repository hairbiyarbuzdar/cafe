import { ExportMenu } from "@/components/shared/export-menu";
import { ReportDataTable } from "@/features/reports/report-data-table";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { fetchModuleRows } from "@/lib/data-transfer/modules.server";
import { filterRowsByDate, REPORT_DATE_FIELD } from "@/lib/queries/reports";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reports — Inventory" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function InventoryReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = { from: parseDate(sp.from), to: parseDate(sp.to) };
  const [rows, ws] = await Promise.all([
    fetchModuleRows("inventory"),
    getOrCreateWorkspace(),
  ]);
  const filtered = filterRowsByDate(rows, REPORT_DATE_FIELD.inventory!, range);

  const skuCount = filtered.length;
  const stockValue = filtered.reduce(
    (s, r) => s + Number(r.stock ?? 0) * Number(r.costPerUnit ?? 0),
    0,
  );
  const lowStock = filtered.filter(
    (r) => Number(r.stock ?? 0) <= Number(r.reorderLevel ?? 0),
  ).length;

  return (
    <>
      <ReportHeading
        title="Inventory Report"
        description="Stock on hand, valuation, and reorder exposure."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={["inventory"]}
              scope="inventory-report"
              title="Inventory Report"
            />
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile label="SKUs" value={skuCount.toLocaleString()} />
        <StatTile
          label="Stock value"
          value={formatCurrency(stockValue, { maximumFractionDigits: 0 })}
          tone="primary"
          hint="at cost"
        />
        <StatTile
          label="Below reorder"
          value={lowStock.toLocaleString()}
          tone={lowStock > 0 ? "warning" : undefined}
          hint="need restocking"
        />
      </section>
      <ReportDataTable
        moduleKey="inventory"
        rows={filtered}
        currencyCode={ws.currency}
      />
    </>
  );
}
