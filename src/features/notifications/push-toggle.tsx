"use client";

import * as React from "react";
import { BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  subscribePushAction,
  unsubscribePushAction,
} from "@/lib/actions/push";

type State =
  | { kind: "loading" }
  | { kind: "unsupported"; reason: string }
  | { kind: "denied" }
  | { kind: "subscribed"; endpoint: string }
  | { kind: "unsubscribed" };

/**
 * Settings → Notifications toggle. Wraps the four-stage lifecycle of
 * Web Push subscription:
 *
 *   1. Detect support — `serviceWorker` + `PushManager` + a public
 *      VAPID key. Surface the specific blocker if any are missing.
 *   2. Read current state — does the active SW registration already
 *      have a subscription? Drives "Enable" vs "Disable" copy.
 *   3. Toggle — Notification.requestPermission() → pushManager.subscribe()
 *      → server-side upsert. Or unsubscribe + server-side delete.
 *   4. Handle Notification.permission === "denied" — the user has to
 *      flip the site permission back in browser settings; show that.
 *
 * We deliberately don't auto-prompt for permission on first paint —
 * cafés typically have shared devices, so an opt-in toggle is a
 * better UX than a permission banner the user has to dismiss.
 */
export function PushToggle() {
  const [state, setState] = React.useState<State>({ kind: "loading" });
  const [busy, setBusy] = React.useState(false);
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled)
          setState({
            kind: "unsupported",
            reason: "This browser doesn't support push notifications.",
          });
        return;
      }
      if (!vapidKey) {
        if (!cancelled)
          setState({
            kind: "unsupported",
            reason:
              "Push not configured — operator needs to set NEXT_PUBLIC_VAPID_PUBLIC_KEY.",
          });
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setState({ kind: "denied" });
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (cancelled) return;
        setState(
          sub ? { kind: "subscribed", endpoint: sub.endpoint } : { kind: "unsubscribed" },
        );
      } catch {
        if (!cancelled) setState({ kind: "unsubscribed" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [vapidKey]);

  async function enable() {
    if (!vapidKey) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? { kind: "denied" } : { kind: "unsubscribed" });
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const result = await subscribePushAction(
        sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } },
        navigator.userAgent,
      );
      if (!result.ok) {
        await sub.unsubscribe().catch(() => {});
        toast.error("Couldn't enable push", { description: result.error });
        setState({ kind: "unsubscribed" });
        return;
      }
      setState({ kind: "subscribed", endpoint: sub.endpoint });
      toast.success("Notifications enabled");
    } catch (err) {
      toast.error("Couldn't enable push", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribePushAction(sub.endpoint);
        await sub.unsubscribe().catch(() => {});
      }
      setState({ kind: "unsubscribed" });
      toast.success("Notifications disabled");
    } catch (err) {
      toast.error("Couldn't disable push", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  const description = describe(state);

  return (
    <div className="flex items-start justify-between gap-3 rounded-md border bg-card px-3 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[13px] font-medium">
          {state.kind === "subscribed" ? (
            <BellRing className="size-3.5 text-success" />
          ) : (
            <BellOff className="size-3.5 text-muted-foreground" />
          )}
          Push notifications on this device
        </p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">
        {state.kind === "loading" ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : state.kind === "unsupported" || state.kind === "denied" ? null : state.kind ===
          "subscribed" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-md text-[12px]"
            onClick={disable}
            disabled={busy}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Disable
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-md text-[12px]"
            onClick={enable}
            disabled={busy}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <BellRing className="size-3.5" />}
            Enable
          </Button>
        )}
      </div>
    </div>
  );
}

function describe(state: State): string {
  switch (state.kind) {
    case "loading":
      return "Checking subscription status…";
    case "unsupported":
      return state.reason;
    case "denied":
      return "Blocked in browser settings. Re-enable notifications for this site and reload.";
    case "subscribed":
      return "You'll receive alerts for new orders and ready tickets even when this tab isn't focused.";
    case "unsubscribed":
      return "Get a system notification when an order is placed or a ticket is ready.";
  }
}

/**
 * VAPID public keys are URL-safe base64. PushManager.subscribe wants
 * them as a raw Uint8Array.
 */
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalised = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalised);
  // Explicit ArrayBuffer (not SharedArrayBuffer) so PushManager
  // accepts the result as `BufferSource` under TypeScript's tightened
  // ArrayBufferLike typings.
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
