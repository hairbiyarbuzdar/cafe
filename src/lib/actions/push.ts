"use server";

import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type ClientSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type PushSubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

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
    const { error } = await supabase.from("PushSubscription").upsert(
      {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent?.slice(0, 255) ?? null,
      },
      { onConflict: "endpoint" },
    );
    if (error) throw error;
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
    const { error } = await supabase
      .from("PushSubscription")
      .delete()
      .eq("endpoint", endpoint)
      .eq("userId", session.user.id);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to unsubscribe",
    };
  }
}
