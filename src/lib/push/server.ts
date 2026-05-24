import "server-only";

import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

import { supabase } from "@/lib/supabase";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

let vapidConfigured = false;
let vapidWarned = false;

function configureVapid(): boolean {
  if (vapidConfigured) return true;
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !publicKey || !privateKey) {
    if (!vapidWarned) {
      console.warn(
        "[push] VAPID_SUBJECT / VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set — push notifications are disabled.",
      );
      vapidWarned = true;
    }
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
): Promise<void> {
  if (userIds.length === 0) return;
  if (!configureVapid()) return;

  const { data: subs } = await supabase
    .from("PushSubscription")
    .select("id, endpoint, p256dh, auth")
    .in("userId", userIds);
  if (!subs?.length) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      const subscription: WebPushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };
      try {
        await webpush.sendNotification(subscription, body);
      } catch (err: unknown) {
        const status =
          typeof err === "object" && err !== null && "statusCode" in err
            ? Number((err as { statusCode: unknown }).statusCode)
            : 0;
        if (status === 404 || status === 410) {
          await supabase.from("PushSubscription").delete().eq("id", sub.id);
        } else {
          console.error(
            `[push] delivery failed (${status || "unknown"}) for ${sub.endpoint}`,
            err,
          );
        }
      }
    }),
  );
}

export async function userIdsWithPermission(
  permission: string,
): Promise<string[]> {
  const { data: roles } = await supabase.from("Role").select("id, permissions");
  const matchingRoleIds = (roles ?? [])
    .filter(
      (r) =>
        Array.isArray(r.permissions) &&
        (r.permissions as string[]).includes(permission),
    )
    .map((r) => r.id);
  if (matchingRoleIds.length === 0) return [];
  const { data: users } = await supabase
    .from("User")
    .select("id")
    .in("role", matchingRoleIds)
    .eq("active", true);
  return (users ?? []).map((u) => u.id);
}

export function sendPushInBackground(
  userIds: string[],
  payload: PushPayload,
): void {
  void sendPushToUsers(userIds, payload).catch((err) => {
    console.error("[push] sendPushInBackground threw", err);
  });
}
