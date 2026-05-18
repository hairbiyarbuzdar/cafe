import type {
  KitchenStation,
  KitchenTicket,
  KitchenTicketItem,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  TicketStatus,
} from "@/types";

/**
 * Translate an order's status into a default ticket lifecycle
 * status. Orders that are completed/cancelled flow to "served"
 * so the kitchen page can archive them without ambiguity.
 */
function defaultTicketStatus(orderStatus: OrderStatus): TicketStatus {
  switch (orderStatus) {
    case "pending":
      return "pending";
    case "preparing":
      return "preparing";
    case "ready":
      return "ready";
    case "completed":
      return "served";
    case "cancelled":
    case "refunded":
      return "served";
  }
}

/**
 * Given an order plus the active menu and station lists, returns
 * one ticket per station that has at least one item in the order.
 *
 * - Same orderNumber/table/customer/timestamp across all tickets.
 * - Each ticket's `items[]` contains only the lines routed to that station.
 * - Items whose menu lookup fails are routed to a synthetic
 *   "unrouted" bucket so they don't silently disappear from the KDS.
 */
export function splitOrderIntoTickets(
  order: Order,
  menu: MenuItem[],
  stations: KitchenStation[],
  statusOverrides: Record<string, TicketStatus> = {},
): KitchenTicket[] {
  const menuById = new Map(menu.map((m) => [m.id, m]));
  const stationById = new Map(stations.map((s) => [s.id, s]));
  const byStation = new Map<string, OrderItem[]>();

  for (const line of order.items) {
    const menuItem = menuById.get(line.productId);
    const stationId =
      menuItem && stationById.has(menuItem.stationId)
        ? menuItem.stationId
        : "stn_unrouted";
    if (!byStation.has(stationId)) byStation.set(stationId, []);
    byStation.get(stationId)!.push(line);
  }

  const base = defaultTicketStatus(order.status);
  const tickets: KitchenTicket[] = [];

  for (const [stationId, items] of byStation) {
    const id = `${order.id}__${stationId}`;
    tickets.push({
      id,
      orderId: order.id,
      orderNumber: order.number,
      stationId,
      customerName: order.customer?.name,
      table: order.table,
      channel: order.channel,
      status: statusOverrides[id] ?? base,
      items: items.map<KitchenTicketItem>((i) => ({
        id: i.id,
        menuItemId: i.productId,
        name: i.name,
        quantity: i.quantity,
        modifiers: i.modifiers,
        note: i.note,
      })),
      notes: order.notes,
      createdAt: order.createdAt,
    });
  }

  return tickets;
}

/** Advance / regress a ticket through the lifecycle. */
export const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "served",
  served: null,
};

export const PREV_STATUS: Record<TicketStatus, TicketStatus | null> = {
  pending: null,
  preparing: "pending",
  ready: "preparing",
  served: "ready",
};
