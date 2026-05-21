import { ExportMenu } from "@/components/shared/export-menu";
import { ReportDataTable } from "@/features/reports/report-data-table";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { fetchModuleRows } from "@/lib/data-transfer/modules.server";
import {
  filterRowsByDate,
  REPORT_DATE_FIELD,
  reportsSummary,
} from "@/lib/queries/reports";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reports — Staff & Salary" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function StaffReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = { from: parseDate(sp.from), to: parseDate(sp.to) };
  const [rows, summary, ws] = await Promise.all([
    fetchModuleRows("staff"),
    reportsSummary(range),
    getOrCreateWorkspace(),
  ]);
  const filtered = filterRowsByDate(rows, REPORT_DATE_FIELD.staff!, range);

  const count = filtered.length;
  const active = filtered.filter((r) => r.active === true).length;
  const payroll = filtered.reduce((s, r) => s + Number(r.monthlySalary ?? 0), 0);

  return (
    <>
      <ReportHeading
        title="Staff & Salary Report"
        description="Headcount, monthly payroll commitment, and salaries paid."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={["staff"]}
              scope="staff-report"
              title="Staff & Salary Report"
            />
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Staff" value={count.toLocaleString()} />
        <StatTile
          label="Active"
          value={active.toLocaleString()}
          tone="success"
          hint={`${count - active} inactive`}
        />
        <StatTile
          label="Monthly payroll"
          value={formatCurrency(payroll, { maximumFractionDigits: 0 })}
          hint="sum of salaries"
        />
        <StatTile
          label="Salaries paid"
          value={formatCurrency(summary.salariesPaid, { maximumFractionDigits: 0 })}
          tone="primary"
          hint="in selected period"
        />
      </section>
      <ReportDataTable
        moduleKey="staff"
        rows={filtered}
        currencyCode={ws.currency}
      />
    </>
  );
}
