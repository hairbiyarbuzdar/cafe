import { ExportMenu } from "@/components/shared/export-menu";
import { ReportDataTable } from "@/features/reports/report-data-table";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { fetchModuleRows } from "@/lib/data-transfer/modules.server";
import { filterRowsByDate, REPORT_DATE_FIELD } from "@/lib/queries/reports";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reports — Expenses" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function ExpensesReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = { from: parseDate(sp.from), to: parseDate(sp.to) };
  const [rows, ws] = await Promise.all([
    fetchModuleRows("expenses"),
    getOrCreateWorkspace(),
  ]);
  const filtered = filterRowsByDate(rows, REPORT_DATE_FIELD.expenses!, range);

  const count = filtered.length;
  const total = filtered.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const heads = new Set(filtered.map((r) => String(r.head ?? ""))).size;
  const avg = count ? total / count : 0;

  return (
    <>
      <ReportHeading
        title="Expenses Report"
        description="Outgoing spend by head and payment method."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={["expenses"]}
              scope="expenses-report"
              title="Expenses Report"
            />
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Records" value={count.toLocaleString()} />
        <StatTile
          label="Total spend"
          value={formatCurrency(total, { maximumFractionDigits: 0 })}
          tone="danger"
        />
        <StatTile
          label="Avg. expense"
          value={formatCurrency(avg, { maximumFractionDigits: 0 })}
        />
        <StatTile label="Expense heads" value={heads.toLocaleString()} />
      </section>
      <ReportDataTable
        moduleKey="expenses"
        rows={filtered}
        currencyCode={ws.currency}
      />
    </>
  );
}
