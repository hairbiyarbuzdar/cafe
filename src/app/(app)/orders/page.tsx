import { Download, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { OrdersTable } from "@/features/orders/orders-table";
import { ORDERS } from "@/mock/orders";

export const metadata = { title: "Orders" };

function summary() {
  const completed = ORDERS.filter((o) => o.status === "completed").length;
  const pending = ORDERS.filter((o) => o.status === "pending" || o.status === "preparing").length;
  const revenue = ORDERS.filter((o) => o.status === "completed").reduce(
    (s, o) => s + o.total,
    0,
  );
  return { completed, pending, revenue };
}

export default function OrdersPage() {
  const s = summary();
  return (
    <>
      <PageHeader
        title="Orders"
        description="All orders across in-store, takeaway, delivery, and online channels."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Filter className="size-3.5" />
              Advanced
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <Button size="sm" className="h-8 rounded-md text-[12.5px]">
              <Plus className="size-3.5" />
              New order
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Open orders" value={`${s.pending}`} hint="in pending or preparing" tone="info" />
        <Stat label="Completed today" value={`${s.completed}`} hint="successfully fulfilled" tone="success" />
        <Stat
          label="Revenue captured"
          value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(s.revenue)}
          hint="from completed orders"
          tone="primary"
        />
      </section>

      <OrdersTable />
    </>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "info" | "success" | "primary";
}) {
  const accent =
    tone === "info"
      ? "bg-info"
      : tone === "success"
        ? "bg-success"
        : "bg-primary";
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-4 shadow-elevated">
      <span className={`absolute inset-y-0 start-0 w-1 ${accent}`} />
      <p className="text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-[20px] font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
    </div>
  );
}
