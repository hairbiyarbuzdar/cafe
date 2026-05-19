import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  KitchenTicket,
  KitchenTicketItem,
  OrderChannel,
  TicketStatus,
} from "@/types";

/**
 * Active kitchen tickets across all stations.
 *
 * Returns one ticket per (order, station) pair that hasn't reached
 * "served". Each ticket includes only the order items routed to that
 * station — the join through MenuItem.stationId enforces routing.
 */
export async function listActiveKitchenTickets(): Promise<KitchenTicket[]> {
  // Include `cancelled` so cooks see a struck-out ticket they can
  // explicitly dismiss; without that, a cancelled order would silently
  // disappear mid-prep.
  const tickets = await prisma.kitchenTicket.findMany({
    where: { status: { in: ["pending", "preparing", "ready", "cancelled"] } },
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          items: {
            include: {
              menuItem: { select: { stationId: true } },
            },
          },
          table: { select: { name: true } },
        },
      },
    },
  });

  return tickets.map((t) => {
    const stationItems: KitchenTicketItem[] = t.order.items
      .filter((i) => i.menuItem.stationId === t.stationId)
      .map((i) => ({
        id: i.id,
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        modifiers: Array.isArray(i.modifiers)
          ? (i.modifiers as string[])
          : undefined,
        note: i.note ?? undefined,
        preparedAt: i.preparedAt ? i.preparedAt.toISOString() : undefined,
      }));

    return {
      id: `${t.orderId}__${t.stationId}`,
      orderId: t.orderId,
      orderNumber: t.order.number,
      stationId: t.stationId,
      customerName: t.order.customerName ?? undefined,
      table: t.order.table?.name,
      channel: t.order.channel as OrderChannel,
      status: t.status as TicketStatus,
      items: stationItems,
      notes: t.order.notes ?? undefined,
      createdAt: t.createdAt.toISOString(),
    };
  });
}
