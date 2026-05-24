import "server-only";

import type { RealtimeEvent } from "@/lib/realtime/events";

type Listener = (event: RealtimeEvent) => void;

const BUS_KEY = Symbol.for("brewline.realtime.bus");

type Stash = { listeners: Set<Listener> };

function getStash(): Stash {
  const g = globalThis as Record<symbol, unknown>;
  let stash = g[BUS_KEY] as Stash | undefined;
  if (!stash) {
    stash = { listeners: new Set() };
    g[BUS_KEY] = stash;
  }
  return stash;
}

export async function publish(event: RealtimeEvent): Promise<void> {
  try {
    const { listeners } = getStash();
    for (const fn of listeners) {
      try {
        fn(event);
      } catch (err) {
        console.error("[realtime] listener threw", err);
      }
    }
  } catch (err) {
    console.error("[realtime] publish failed", err);
  }
}

export function subscribe(listener: Listener): () => void {
  const stash = getStash();
  stash.listeners.add(listener);
  return () => {
    stash.listeners.delete(listener);
  };
}
