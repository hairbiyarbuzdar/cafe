"use client";

import * as React from "react";

import { REALTIME_EVENT_TYPES, type RealtimeEvent } from "@/lib/realtime/events";

export type RealtimeConnectionState = "connecting" | "open" | "closed";

/**
 * Subscribe a component to the server SSE stream.
 *
 * The handler is held in a ref so the EventSource only opens once per
 * mount even if the caller passes a freshly-constructed function each
 * render. If the connection drops (server restart, laptop sleep, NAT
 * idle-timeout), the browser's built-in EventSource reconnect handles
 * the recovery — we just flip back to "connecting" until it settles.
 */
export function useRealtime(
  handler: (event: RealtimeEvent) => void,
): RealtimeConnectionState {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;
  const [state, setState] = React.useState<RealtimeConnectionState>("connecting");

  React.useEffect(() => {
    const source = new EventSource("/api/realtime");

    const onOpen = () => setState("open");
    const onError = () => setState("connecting");
    const onMessage = (msg: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(msg.data) as RealtimeEvent;
        handlerRef.current(parsed);
      } catch {
        // malformed payload — drop it
      }
    };

    source.addEventListener("open", onOpen);
    source.addEventListener("error", onError);
    // Each event is published with a named `event:` line server-side,
    // so we listen on every type the union knows about. The generic
    // `message` listener is a defensive fallback for any unlabeled
    // frame future code might emit.
    source.addEventListener("message", onMessage);
    for (const type of REALTIME_EVENT_TYPES) {
      source.addEventListener(type, onMessage as EventListener);
    }

    return () => {
      source.close();
      setState("closed");
    };
  }, []);

  return state;
}
