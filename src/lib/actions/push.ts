"use server";

import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Web Push spec object as it comes out of `PushSubscription.toJSON()`
 * in the browser. Keys nested under `keys`; endpoint at the top.
 */
type ClientSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type PushSubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Persist a Web Push subscription for the current user. Idempotent:
 * we upsert on the `endpoint` so re-subscribing on the same device
 * (e.g. after the SW updates) just refreshes keys instead of growing
 * the row count.
 */
export async function subscribePushAction(
  subscription: ClientSubscription,
  userAgent?: string,
): Promise<PushSubscribeResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: "Not signed in" };
  if (
    !subscription?.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return { ok: false, error: "Invalid subscription" };
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent?.slice(0, 255) ?? null,
      },
      update: {
        // A stale subscription with the same endpoint but different
        // owner can happen if two staff members share a device. We
        // reassign to whoever just opted in.
        userId: session.user.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent?.slice(0, 255) ?? null,
      },
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to subscribe",
    };
  }
}

export async function unsubscribePushAction(
  endpoint: string,
): Promise<PushSubscribeResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, error: "Not signed in" };
  if (!endpoint) return { ok: false, error: "Missing endpoint" };
  try {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: session.user.id },
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to unsubscribe",
    };
  }
}
