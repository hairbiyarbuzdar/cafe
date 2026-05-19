import "server-only";

import type { RealtimeEvent } from "@/lib/realtime/events";

type Listener = (event: RealtimeEvent) => void;

/**
 * In-process pub/sub backing the SSE endpoint. Suitable for a single
 * Node process (which is what `next start` is). For horizontal scale,
 * swap the Set for Postgres LISTEN/NOTIFY — the public API
 * (`publish` / `subscribe`) stays identical and no caller changes.
 *
 * The listener set is stashed on `globalThis` under a Symbol so it
 * survives Next.js dev-mode hot reload: without this, every code edit
 * that touches a module in this import graph would yield a fresh
 * module instance, orphaning the previous Set and detaching any
 * already-connected SSE consumers from new `publish()` calls.
 */
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

export function publish(event: RealtimeEvent): void {
  const { listeners } = getStash();
  for (const fn of listeners) {
    try {
      fn(event);
    } catch (err) {
      console.error("[realtime] listener threw", err);
    }
  }
}

export function subscribe(listener: Listener): () => void {
  const { listeners } = getStash();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
