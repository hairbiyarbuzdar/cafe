import { Clock, Coffee, Flame, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { ChannelBadge, OrderStatusBadge } from "@/features/orders/status-badge";
import { ORDERS } from "@/mock/orders";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

export const metadata = { title: "Kitchen" };

const KITCHEN_STATUSES: OrderStatus[] = ["pending", "preparing", "ready"];

export default function KitchenPage() {
  const queue = ORDERS.filter((o) => KITCHEN_STATUSES.includes(o.status));
  const byStatus: Record<OrderStatus, Order[]> = {
    pending: queue.filter((o) => o.status === "pending"),
    preparing: queue.filter((o) => o.status === "preparing"),
    ready: queue.filter((o) => o.status === "ready"),
    completed: [],
    cancelled: [],
    refunded: [],
  };

  return (
    <>
      <PageHeader
        title="Kitchen display"
        description="Live ticket queue. Drag a ticket to update its status, or tap the action button below each card."
        meta={
          <>
            <Badge variant="secondary" className="rounded-md font-normal">
              <span className="me-1 inline-block size-1.5 rounded-full bg-success" />
              Service active
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              {queue.length} tickets in flight
            </Badge>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Column
          title="New"
          tone="warning"
          icon={Clock}
          orders={byStatus.pending}
          actionLabel="Start preparing"
        />
        <Column
          title="Preparing"
          tone="info"
          icon={Flame}
          orders={byStatus.preparing}
          actionLabel="Mark ready"
        />
        <Column
          title="Ready"
          tone="success"
          icon={Coffee}
          orders={byStatus.ready}
          actionLabel="Hand off"
        />
      </section>
    </>
  );
}

function Column({
  title,
  tone,
  icon: Icon,
  orders,
  actionLabel,
}: {
  title: string;
  tone: "warning" | "info" | "success";
  icon: typeof Clock;
  orders: Order[];
  actionLabel: string;
}) {
  const dotTone =
    tone === "warning" ? "bg-warning" : tone === "info" ? "bg-info" : "bg-success";
  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", dotTone)} />
          <Icon className="size-3.5 text-muted-foreground" />
          {title}
          <span className="ms-1 rounded-md bg-secondary/70 px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground tabular-nums">
            {orders.length}
          </span>
        </span>
      }
      contentClassName="space-y-2.5 p-3 md:p-3.5"
    >
      {orders.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-[12.5px] text-muted-foreground">
          No tickets
        </div>
      ) : (
        orders.map((o) => (
          <article
            key={o.id}
            className="ring-highlight rounded-lg border border-border/70 bg-card p-3.5"
          >
            <header className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold tabular-nums">{o.number}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <ChannelBadge channel={o.channel} />
                  {o.table ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Utensils className="size-3" />
                      {o.table}
                    </span>
                  ) : null}
                </div>
              </div>
              <OrderStatusBadge status={o.status} />
            </header>
            <ul className="mt-3 space-y-1 text-[13px]">
              {o.items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-start gap-2 text-foreground"
                >
                  <span className="font-medium tabular-nums text-muted-foreground">
                    ×{i.quantity}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate">{i.name}</p>
                    {i.modifiers && i.modifiers.length > 0 ? (
                      <p className="text-[11.5px] text-muted-foreground">
                        {i.modifiers.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            {o.notes ? (
              <p className="mt-2 rounded-md border border-warning/20 bg-warning/10 px-2 py-1.5 text-[11.5px] text-foreground/85">
                {o.notes}
              </p>
            ) : null}
            <footer className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {formatRelativeTime(o.createdAt)}
              </span>
              <Button
                size="sm"
                variant={tone === "success" ? "outline" : "default"}
                className="h-8 rounded-md text-[12px]"
              >
                {actionLabel}
              </Button>
            </footer>
          </article>
        ))
      )}
    </SectionCard>
  );
}
