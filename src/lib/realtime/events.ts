import type { TicketStatus } from "@/types";

/**
 * Discriminated union of every server-pushed realtime event.
 *
 * Keep payloads small (ids, not full records): consumers call
 * `router.refresh()` and let the server components re-query for the
 * fresh data. That keeps the bus cheap and avoids sending stale data
 * to clients that have permission to see less than the publisher.
 */
export type RealtimeEvent =
  | { type: "order.placed"; orderId: string; orderNumber: string }
  | { type: "order.updated"; orderId: string }
  | { type: "order.cancelled"; orderId: string }
  | { type: "order.paid"; orderId: string }
  | {
      type: "ticket.status";
      orderId: string;
      stationId: string;
      status: TicketStatus;
    };

export type RealtimeEventType = RealtimeEvent["type"];

export const REALTIME_EVENT_TYPES: ReadonlyArray<RealtimeEventType> = [
  "order.placed",
  "order.updated",
  "order.cancelled",
  "order.paid",
  "ticket.status",
];
