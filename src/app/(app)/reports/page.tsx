import { ExportMenu } from "@/components/shared/export-menu";
import { CategoryMix } from "@/features/reports/category-mix";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { SalesOverview } from "@/features/reports/sales-overview";
import { TopProductsTable } from "@/features/reports/top-products-table";
import { EXPORTABLE_MODULES } from "@/lib/data-transfer/registry";
import {
  categoryRevenue,
  revenue14d,
  topProducts,
} from "@/lib/queries/analytics";
import { reportsSummary } from "@/lib/queries/reports";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reports — Summary" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const ALL_KEYS = EXPORTABLE_MODULES.map((m) => m.key);

export default async function ReportsSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const filter = { from: parseDate(sp.from), to: parseDate(sp.to) };

  const [summary, revenue, categories, top] = await Promise.all([
    reportsSummary(filter),
    revenue14d(filter),
    categoryRevenue(),
    topProducts(10, filter),
  ]);

  const profitTone = summary.netProfit >= 0 ? "success" : "danger";

  return (
    <div className="space-y-4">
      <ReportHeading
        title="Executive Summary"
        description="A consolidated, business-wide view of performance."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={ALL_KEYS}
              scope="full-system"
              title="Complete System Export"
            />
          </>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Orders"
          value={summary.ordersCount.toLocaleString()}
          hint="excl. cancelled & refunded"
        />
        <StatTile
          label="Revenue"
          value={formatCurrency(summary.revenue, { maximumFractionDigits: 0 })}
          tone="primary"
          hint="gross sales"
        />
        <StatTile
          label="Expenses"
          value={formatCurrency(summary.expensesTotal, { maximumFractionDigits: 0 })}
          hint="recorded spend"
        />
        <StatTile
          label="Salaries paid"
          value={formatCurrency(summary.salariesPaid, { maximumFractionDigits: 0 })}
          hint="net disbursed"
        />
        <StatTile
          label="Inventory value"
          value={formatCurrency(summary.inventoryValue, { maximumFractionDigits: 0 })}
          hint="stock at cost"
        />
        <StatTile
          label="Supplier purchases"
          value={formatCurrency(summary.supplierPurchases, { maximumFractionDigits: 0 })}
          hint={`${summary.supplierCount} suppliers`}
        />
        <StatTile
          label="Net profit"
          value={formatCurrency(summary.netProfit, { maximumFractionDigits: 0 })}
          tone={profitTone}
          hint="revenue − expenses − salaries"
        />
        <StatTile
          label="Profit margin"
          value={
            summary.revenue > 0
              ? `${((summary.netProfit / summary.revenue) * 100).toFixed(1)}%`
              : "—"
          }
          tone={profitTone}
          hint="net / revenue"
        />
      </section>

      <SalesOverview data={revenue} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CategoryMix data={categories} />
        </div>
        <div className="lg:col-span-2">
          <TopProductsTable data={top} />
        </div>
      </section>
    </div>
  );
}
