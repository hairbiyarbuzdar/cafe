import { CalendarRange, Download, FileText, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layouts/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { CategoryMix } from "@/features/reports/category-mix";
import { SalesOverview } from "@/features/reports/sales-overview";
import { TopProductsTable } from "@/features/reports/top-products-table";
import { TODAY_KPIS } from "@/mock/analytics";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Deep dive into performance, products, and customer trends."
        actions={
          <>
            <Tabs defaultValue="week" className="hidden md:block">
              <TabsList className="h-8 rounded-md bg-secondary/50 p-0.5">
                <TabsTrigger value="day" className="h-7 px-2.5 text-[12px]">Day</TabsTrigger>
                <TabsTrigger value="week" className="h-7 px-2.5 text-[12px]">Week</TabsTrigger>
                <TabsTrigger value="month" className="h-7 px-2.5 text-[12px]">Month</TabsTrigger>
                <TabsTrigger value="quarter" className="h-7 px-2.5 text-[12px]">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <CalendarRange className="size-3.5" />
              Apr 8 — Apr 21
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Share2 className="size-3.5" />
              Share
            </Button>
            <Button size="sm" className="h-8 rounded-md text-[12.5px]">
              <Download className="size-3.5" />
              Export
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TODAY_KPIS.map((k, i) => (
          <KpiCard key={k.id} kpi={k} accentColor={`var(--chart-${(i % 5) + 1})`} />
        ))}
      </section>

      <SalesOverview />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CategoryMix />
        </div>
        <div className="lg:col-span-2">
          <ExportPanel />
        </div>
      </section>

      <TopProductsTable />
    </>
  );
}

function ExportPanel() {
  const reports = [
    { name: "Daily sales summary", description: "Settled revenue and breakdowns", format: "PDF" },
    { name: "Product performance", description: "Units, revenue, and contribution", format: "CSV" },
    { name: "Inventory consumption", description: "Stock movement vs sales", format: "XLSX" },
    { name: "Staff productivity", description: "Hours, orders, and tips", format: "PDF" },
    { name: "Customer retention", description: "Cohort retention by week", format: "CSV" },
  ];
  return (
    <div className="flex h-full flex-col rounded-lg border bg-card shadow-elevated">
      <header className="border-b px-4 py-3 md:px-5 md:py-3.5">
        <h2 className="text-[14px] font-semibold leading-none text-foreground">
          Saved exports
        </h2>
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          Schedule or download common reports
        </p>
      </header>
      <ul className="flex-1 divide-y">
        {reports.map((r) => (
          <li
            key={r.name}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <FileText className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-foreground">
                {r.name}
              </p>
              <p className="truncate text-[11.5px] text-muted-foreground">
                {r.description}
              </p>
            </div>
            <span className="rounded border bg-card px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
              {r.format}
            </span>
            <Button variant="ghost" size="icon-sm" className="rounded-md">
              <Download className="size-3.5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
