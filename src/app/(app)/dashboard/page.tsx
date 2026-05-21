import { Calendar, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layouts/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChannelMix } from "@/features/dashboard/channel-mix";
import { DashboardFilter } from "@/features/dashboard/dashboard-filter";
import { HourlyOrders } from "@/features/dashboard/hourly-orders";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { TopProducts } from "@/features/dashboard/top-products";
import { LiveRefresh } from "@/features/realtime/live-refresh";
import { getCurrentUser } from "@/lib/auth";
import { listRecentActivity } from "@/lib/queries/activity";
import {
  channelMix,
  hourlyOrdersToday,
  revenue14d,
  todaysKpis,
  topProducts,
} from "@/lib/queries/analytics";
import { getOrCreateWorkspace, type WeekDay } from "@/lib/queries/workspace";

export const metadata = { title: "Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const DAY_KEYS: WeekDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function format12h(value: string | null): string | null {
  if (!value) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h24 = Number(m[1]);
  const minute = m[2];
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${minute} ${ampm}`;
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; channel?: string }>;
}) {
  const sp = await searchParams;
  const filter = {
    from: parseDate(sp.from),
    to: parseDate(sp.to),
    channel: sp.channel,
  };

  const [kpis, revenue, channels, hourly, top, activity, workspace, user] =
    await Promise.all([
      todaysKpis(filter),
      revenue14d(filter),
      channelMix(filter),
      hourlyOrdersToday(filter),
      topProducts(7, filter),
      listRecentActivity(50),
      getOrCreateWorkspace(),
      getCurrentUser(),
    ]);

  const firstName = user?.name.split(/\s+/)[0] ?? "there";
  const place = workspace.addressLine || workspace.city || workspace.name;
  const todayKey = DAY_KEYS[new Date().getDay()]!;
  const todayHours = workspace.hours[todayKey];
  const openLabel = format12h(todayHours.open);
  const closeLabel = format12h(todayHours.close);
  const isOpen = !!openLabel && !!closeLabel;

  return (
    <>
      <PageHeader
        title={`${timeOfDayGreeting()}, ${firstName}`}
        description={`Here's what's happening at ${place} today.`}
        meta={
          <>
            <Badge
              variant="secondary"
              className="rounded-md font-normal"
              title={isOpen ? "Today's hours from Settings → Workspace" : undefined}
            >
              <span
                className={`me-1 inline-block size-1.5 rounded-full ${isOpen ? "bg-success" : "bg-muted-foreground"}`}
              />
              {isOpen
                ? `Store open · ${openLabel}–${closeLabel}`
                : "Closed today"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Calendar className="size-3.5" />
              Today
            </Button>
            <DashboardFilter />
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Download className="size-3.5" />
              Export
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            accentColor={`var(--chart-${(i % 5) + 1})`}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <ChannelMix data={channels} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HourlyOrders data={hourly} />
        </div>
        <QuickActions />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity events={activity} />
        </div>
        <div className="lg:col-span-2">
          <TopProducts data={top} />
        </div>
      </section>
      <LiveRefresh on={["order.placed", "order.paid", "order.cancelled"]} />
    </>
  );
}
