import { Calendar, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layouts/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChannelMix } from "@/features/dashboard/channel-mix";
import { HourlyOrders } from "@/features/dashboard/hourly-orders";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { TopProducts } from "@/features/dashboard/top-products";
import { TODAY_KPIS } from "@/mock/analytics";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Good morning, Elena"
        description="Here's what's happening at Mission St. today."
        meta={
          <>
            <Badge variant="secondary" className="rounded-md font-normal">
              <span className="me-1 inline-block size-1.5 rounded-full bg-success" />
              Store open · 06:30–20:30
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              4 staff on shift
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              12 active orders
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Calendar className="size-3.5" />
              Today
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Filter className="size-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Download className="size-3.5" />
              Export
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TODAY_KPIS.map((kpi, i) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            accentColor={`var(--chart-${(i % 5) + 1})`}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <ChannelMix />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HourlyOrders />
        </div>
        <QuickActions />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
      </section>
    </>
  );
}
