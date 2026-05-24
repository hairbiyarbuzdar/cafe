import "server-only";

import { supabase } from "@/lib/supabase";
import type { KitchenTicket, KitchenTicketItem, OrderChannel, TicketStatus } from "@/types";

export async function listActiveKitchenTickets(): Promise<KitchenTicket[]> {
  const { data, error } = await supabase
    .from("KitchenTicket")
    .select(`
      id, orderId, stationId, status, createdAt,
      Order(
        number, channel, customerName, notes,
        Table(name),
        OrderItem(id, menuItemId, name, quantity, modifiers, note, preparedAt, MenuItem(stationId))
      )
    `)
    .in("status", ["pending", "preparing", "ready", "cancelled"])
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((t) => {
    const order = (Array.isArray(t.Order) ? t.Order[0] : t.Order) as Record<string, unknown> | null;
    if (!order) return null;

    const allItems = (order.OrderItem as Record<string, unknown>[] | null) ?? [];
    const table = (Array.isArray(order.Table) ? order.Table[0] : order.Table) as { name: string } | null;

    const stationItems: KitchenTicketItem[] = allItems
      .filter((i) => {
        const menuItem = (Array.isArray(i.MenuItem) ? i.MenuItem[0] : i.MenuItem) as { stationId: string } | null;
        return menuItem?.stationId === t.stationId;
      })
      .map((i) => ({
        id: i.id as string,
        menuItemId: (i.menuItemId as string | null) ?? "",
        name: i.name as string,
        quantity: i.quantity as number,
        modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : undefined,
        note: (i.note as string | null) ?? undefined,
        preparedAt: (i.preparedAt as string | null) ?? undefined,
      }));

    return {
      id: `${t.orderId}__${t.stationId}`,
      orderId: t.orderId,
      orderNumber: order.number as string,
      stationId: t.stationId,
      customerName: (order.customerName as string | null) ?? undefined,
      table: table?.name,
      channel: order.channel as OrderChannel,
      status: t.status as TicketStatus,
      items: stationItems,
      notes: (order.notes as string | null) ?? undefined,
      createdAt: t.createdAt,
    };
  }).filter(Boolean) as KitchenTicket[];
}
