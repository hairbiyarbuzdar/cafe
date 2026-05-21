import { ExportMenu } from "@/components/shared/export-menu";
import { ReportDataTable } from "@/features/reports/report-data-table";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { fetchModuleRows } from "@/lib/data-transfer/modules.server";
import { filterRowsByDate, REPORT_DATE_FIELD } from "@/lib/queries/reports";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reports — Orders" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const VOID = new Set(["cancelled", "refunded"]);

export default async function OrdersReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = { from: parseDate(sp.from), to: parseDate(sp.to) };
  const [rows, ws] = await Promise.all([
    fetchModuleRows("orders"),
    getOrCreateWorkspace(),
  ]);
  const filtered = filterRowsByDate(rows, REPORT_DATE_FIELD.orders!, range);

  const count = filtered.length;
  const settled = filtered.filter((r) => !VOID.has(String(r.status)));
  const revenue = settled.reduce((s, r) => s + Number(r.total ?? 0), 0);
  const aov = settled.length ? revenue / settled.length : 0;

  return (
    <>
      <ReportHeading
        title="Orders Report"
        description="Sales volume, revenue, and order detail."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={["orders"]}
              scope="orders-report"
              title="Orders Report"
              pdfOrientation="landscape"
            />
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Orders" value={count.toLocaleString()} />
        <StatTile
          label="Revenue"
          value={formatCurrency(revenue, { maximumFractionDigits: 0 })}
          tone="primary"
          hint="settled orders"
        />
        <StatTile
          label="Avg. order value"
          value={formatCurrency(aov, { maximumFractionDigits: 0 })}
        />
        <StatTile
          label="Voided"
          value={(count - settled.length).toLocaleString()}
          hint="cancelled / refunded"
        />
      </section>
      <ReportDataTable
        moduleKey="orders"
        rows={filtered}
        currencyCode={ws.currency}
      />
    </>
  );
}
