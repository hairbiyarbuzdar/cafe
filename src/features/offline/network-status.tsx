"use client";

import * as React from "react";
import { CloudOff, RefreshCcw, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useOfflineOrders } from "@/store/offline-orders-store";
import { useOnlineStatus } from "@/lib/offline/use-online-status";

/**
 * Topbar status pill.
 *
 * Stays hidden when everything is nominal (online, queue empty) so the
 * topbar doesn't gain a permanent chip. Surfaces in two states:
 *
 *  • offline (any queue size) — amber/destructive, "Offline · N queued"
 *  • online + queue not yet drained — neutral, "Syncing N…"
 *
 * The amber palette is intentional: red looks like a hard error, but
 * offline mode is a degraded-but-working state — the cashier can keep
 * taking orders.
 */
export function NetworkStatus() {
  const online = useOnlineStatus();
  const queued = useOfflineOrders((s) => s.shadows.length);

  if (online && queued === 0) return null;

  const offline = !online;
  const Icon = offline ? WifiOff : queued > 0 ? RefreshCcw : CloudOff;
  const label = offline
    ? queued > 0
      ? `Offline · ${queued} queued`
      : "Offline"
    : `Syncing ${queued}…`;

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-[11.5px] font-medium",
        offline
          ? "border-warning/40 bg-warning/10 text-warning-foreground/90"
          : "border-info/40 bg-info/10 text-info-foreground/90",
      )}
      title={
        offline
          ? "No network. Orders you place will sync automatically when the connection returns."
          : "Connection restored. Replaying queued orders."
      }
    >
      <Icon
        className={cn("size-3.5", !offline && queued > 0 && "animate-spin")}
        aria-hidden
      />
      {label}
    </span>
  );
}
