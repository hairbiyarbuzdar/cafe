"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { TicketStatus } from "@/types";

const TICKET_STATUSES: readonly TicketStatus[] = [
  "pending",
  "preparing",
  "ready",
  "served",
  "cancelled",
];

export type SetTicketStatusResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Update the persisted status of a single kitchen ticket. The KDS
 * surface composes a synthetic ticket id of `${orderId}__${stationId}`
 * to address each ticket — that's what gets passed here.
 *
 * Two side effects worth calling out:
 *
 * 1. We sync `Order.status` when all of an order's tickets reach
 *    `ready` (→ order.status = "ready") or `served` (→ "preparing"
 *    if not paid yet, otherwise we leave it as "completed" set by
 *    payOrderAction). Keeps the order timeline coherent without the
 *    cashier having to touch the order again.
 *
 * 2. Cancelled tickets stay terminal — you can dismiss them (→ served)
 *    but you can't un-cancel.
 */
export async function setKitchenTicketStatusAction(
  ticketId: string,
  status: TicketStatus,
): Promise<SetTicketStatusResult> {
  if (!ticketId) return { ok: false, error: "Missing ticket id" };
  if (!TICKET_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid ticket status" };
  }

  // Synthetic ids look like `${orderId}__${stationId}` — match how
  // `listActiveKitchenTickets()` shapes them.
  const sep = ticketId.lastIndexOf("__");
  if (sep <= 0) return { ok: false, error: "Bad ticket id" };
  const orderId = ticketId.slice(0, sep);
  const stationId = ticketId.slice(sep + 2);

  const existing = await prisma.kitchenTicket.findUnique({
    where: { orderId_stationId: { orderId, stationId } },
    select: { id: true, status: true },
  });
  if (!existing) return { ok: false, error: "Ticket not found" };
  if (existing.status === status) return { ok: true };
  if (existing.status === "cancelled" && status !== "served") {
    return {
      ok: false,
      error: "Cancelled tickets can only be dismissed (→ served).",
    };
  }

  try {
    await prisma.kitchenTicket.update({
      where: { id: existing.id },
      data: { status },
    });

    // Mirror to the parent order's status if all of its tickets agree.
    const siblings = await prisma.kitchenTicket.findMany({
      where: { orderId },
      select: { status: true },
    });
    const allActive = siblings.filter(
      (t) => t.status !== "cancelled" && t.status !== "served",
    );
    const everyReady =
      allActive.length > 0 && allActive.every((t) => t.status === "ready");
    const everyDone = allActive.length === 0;

    if (everyReady) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "ready" },
      });
    } else if (everyDone) {
      // Don't downgrade an order that's already paid+completed.
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { paidAt: true, status: true },
      });
      if (order && order.status !== "completed" && order.status !== "cancelled") {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: order.paidAt ? "completed" : "ready" },
        });
      }
    } else if (siblings.some((t) => t.status === "preparing")) {
      // At least one station has started — bump the order out of "pending".
      await prisma.order.updateMany({
        where: { id: orderId, status: "pending" },
        data: { status: "preparing" },
      });
    }

    revalidatePath("/kitchen");
    revalidatePath("/orders");
    return { ok: true };
  } catch (err) {
    console.error("setKitchenTicketStatusAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update ticket",
    };
  }
}
