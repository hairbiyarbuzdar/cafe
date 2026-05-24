"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import { publish } from "@/lib/realtime/bus";
import type { TicketStatus } from "@/types";

const TICKET_STATUSES: readonly TicketStatus[] = [
  "pending", "preparing", "ready", "served", "cancelled",
];

export type SetTicketStatusResult = { ok: true } | { ok: false; error: string };

export async function setKitchenTicketStatusAction(
  ticketId: string,
  status: TicketStatus,
): Promise<SetTicketStatusResult> {
  if (!ticketId) return { ok: false, error: "Missing ticket id" };
  if (!TICKET_STATUSES.includes(status)) return { ok: false, error: "Invalid ticket status" };

  const sep = ticketId.lastIndexOf("__");
  if (sep <= 0) return { ok: false, error: "Bad ticket id" };
  const orderId = ticketId.slice(0, sep);
  const stationId = ticketId.slice(sep + 2);

  const { data: existing } = await supabase
    .from("KitchenTicket")
    .select("id, status")
    .eq("orderId", orderId)
    .eq("stationId", stationId)
    .maybeSingle();
  if (!existing) return { ok: false, error: "Ticket not found" };
  if (existing.status === status) return { ok: true };
  if (existing.status === "cancelled" && status !== "served") {
    return { ok: false, error: "Cancelled tickets can only be dismissed (→ served)." };
  }

  try {
    await supabase.from("KitchenTicket").update({ status }).eq("id", existing.id);

    if (status === "ready") {
      const { data: itemsToStamp } = await supabase
        .from("OrderItem")
        .select("id, menuItemId")
        .eq("orderId", orderId)
        .is("preparedAt", null);

      if (itemsToStamp && itemsToStamp.length > 0) {
        const menuItemIds = itemsToStamp.map((i) => i.menuItemId).filter(Boolean);
        const { data: stationItems } = await supabase
          .from("MenuItem")
          .select("id")
          .in("id", menuItemIds)
          .eq("stationId", stationId);
        const stationItemIdSet = new Set((stationItems ?? []).map((m) => m.id));
        const toStampIds = itemsToStamp
          .filter((i) => i.menuItemId && stationItemIdSet.has(i.menuItemId))
          .map((i) => i.id);
        if (toStampIds.length > 0) {
          await supabase
            .from("OrderItem")
            .update({ preparedAt: new Date().toISOString() })
            .in("id", toStampIds);
        }
      }
    }

    const { data: siblings } = await supabase
      .from("KitchenTicket")
      .select("status")
      .eq("orderId", orderId);

    const allActive = (siblings ?? []).filter(
      (t) => t.status !== "cancelled" && t.status !== "served",
    );
    const everyReady = allActive.length > 0 && allActive.every((t) => t.status === "ready");
    const everyDone = allActive.length === 0;

    if (everyReady) {
      await supabase.from("Order").update({ status: "ready" }).eq("id", orderId);
    } else if (everyDone) {
      const { data: order } = await supabase
        .from("Order")
        .select("paidAt, status")
        .eq("id", orderId)
        .maybeSingle();
      if (order && order.status !== "completed" && order.status !== "cancelled") {
        await supabase
          .from("Order")
          .update({ status: order.paidAt ? "completed" : "ready" })
          .eq("id", orderId);
      }
    } else if ((siblings ?? []).some((t) => t.status === "preparing")) {
      await supabase
        .from("Order")
        .update({ status: "preparing" })
        .eq("id", orderId)
        .eq("status", "pending");
    }

    revalidatePath("/kitchen");
    revalidatePath("/orders");

    await publish({ type: "ticket.status", orderId, stationId, status });

    return { ok: true };
  } catch (err) {
    console.error("setKitchenTicketStatusAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update ticket",
    };
  }
}
