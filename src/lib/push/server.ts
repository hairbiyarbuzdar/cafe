import "server-only";

import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

import { prisma } from "@/lib/prisma";

/**
 * Web Push payload sent from server to the SW. Kept small + JSON-
 * serialisable so any unknown fields round-trip cleanly.
 */
export type PushPayload = {
  title: string;
  body: string;
  /** Optional URL the SW opens when the user taps the notification. */
  url?: string;
  /** Optional `tag` so back-to-back pings replace each other in the OS
   *  notification tray rather than stacking ("Order #5811", "Order
   *  #5812" should each replace the previous "new order" ping). */
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
        "[push] VAPID_SUBJECT / VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set — push notifications are disabled. Run `npx web-push generate-vapid-keys` and populate .env to enable.",
      );
      vapidWarned = true;
    }
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

/**
 * Send a notification to every Web Push subscription belonging to
 * the listed users. Failures are *not* awaited by the caller's
 * promise chain — push delivery shouldn't ever block a server-action
 * response — but they're awaited internally so we can prune dead
 * subscriptions (HTTP 404/410 from the push service means the
 * endpoint is gone for good).
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
): Promise<void> {
  if (userIds.length === 0) return;
  if (!configureVapid()) return;

  const subs = await prisma.pushSubscription.findMany({
    where: { userId: { in: userIds } },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });
  if (subs.length === 0) return;

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
          // Endpoint gone. Drop it so we don't keep hammering.
          await prisma.pushSubscription
            .delete({ where: { id: sub.id } })
            .catch(() => {});
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

/**
 * Resolve the set of user ids whose role grants the given permission.
 * Used to fan a push out to "everyone who can see /kitchen" without
 * the caller needing to know the specific user list.
 */
export async function userIdsWithPermission(
  permission: string,
): Promise<string[]> {
  const roles = await prisma.role.findMany({
    select: { id: true, permissions: true, users: { select: { id: true } } },
  });
  const matched: string[] = [];
  for (const role of roles) {
    const perms = Array.isArray(role.permissions)
      ? (role.permissions as unknown[]).filter(
          (p): p is string => typeof p === "string",
        )
      : [];
    if (perms.includes(permission)) {
      for (const u of role.users) matched.push(u.id);
    }
  }
  return matched;
}

/**
 * Fire-and-forget wrapper: schedules the push in the background and
 * swallows the result. Use this from server actions where you don't
 * want push latency on the response path.
 */
export function sendPushInBackground(
  userIds: string[],
  payload: PushPayload,
): void {
  void sendPushToUsers(userIds, payload).catch((err) => {
    console.error("[push] sendPushInBackground threw", err);
  });
}
