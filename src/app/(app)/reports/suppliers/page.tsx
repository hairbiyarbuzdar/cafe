import { ExportMenu } from "@/components/shared/export-menu";
import { ReportDataTable } from "@/features/reports/report-data-table";
import { ReportFilter } from "@/features/reports/report-filter";
import { ReportHeading, StatTile } from "@/features/reports/report-ui";
import { fetchModuleRows } from "@/lib/data-transfer/modules.server";
import { filterRowsByDate, REPORT_DATE_FIELD } from "@/lib/queries/reports";
import { getOrCreateWorkspace } from "@/lib/queries/workspace";

export const metadata = { title: "Reports — Suppliers" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function SuppliersReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = { from: parseDate(sp.from), to: parseDate(sp.to) };
  const [rows, ws] = await Promise.all([
    fetchModuleRows("suppliers"),
    getOrCreateWorkspace(),
  ]);
  const filtered = filterRowsByDate(rows, REPORT_DATE_FIELD.suppliers!, range);

  const count = filtered.length;
  const withContact = filtered.filter((r) => r.email || r.phone).length;
  const avgRating =
    count > 0
      ? filtered.reduce((s, r) => s + Number(r.rating ?? 0), 0) / count
      : 0;

  return (
    <>
      <ReportHeading
        title="Suppliers Report"
        description="Your supplier directory and contactability."
        actions={
          <>
            <ReportFilter />
            <ExportMenu
              modules={["suppliers"]}
              scope="suppliers-report"
              title="Suppliers Report"
            />
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile label="Suppliers" value={count.toLocaleString()} />
        <StatTile
          label="With contact info"
          value={withContact.toLocaleString()}
          hint="email or phone on file"
        />
        <StatTile
          label="Average rating"
          value={avgRating.toFixed(1)}
          tone="primary"
          hint="out of 5"
        />
      </section>
      <ReportDataTable
        moduleKey="suppliers"
        rows={filtered}
        currencyCode={ws.currency}
      />
    </>
  );
}
