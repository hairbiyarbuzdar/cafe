import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const VARIANTS: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning-foreground/85 border-warning/20",
    dot: "bg-warning",
  },
  preparing: {
    label: "Preparing",
    className: "bg-info/12 text-info border-info/20",
    dot: "bg-info",
  },
  ready: {
    label: "Ready",
    className: "bg-primary/12 text-primary border-primary/20",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    className: "bg-success/12 text-success border-success/20",
    dot: "bg-success",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/12 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const v = VARIANTS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        v.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", v.dot)} />
      {v.label}
    </span>
  );
}

const CHANNEL_LABEL: Record<string, string> = {
  "dine-in": "Dine-in",
  takeaway: "Takeaway",
  delivery: "Delivery",
  online: "Online",
};

export function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span className="inline-flex items-center rounded-md border bg-card px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
      {CHANNEL_LABEL[channel] ?? channel}
    </span>
  );
}
