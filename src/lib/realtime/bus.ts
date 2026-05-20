import "server-only";

import { Client } from "pg";

import { pgConnectionConfig } from "@/lib/db-adapter";
import { resolveMigrationUrl } from "@/lib/db-url";
import { prisma } from "@/lib/prisma";
import type { RealtimeEvent } from "@/lib/realtime/events";

type Listener = (event: RealtimeEvent) => void;

const CHANNEL = "brewline_realtime";

/**
 * Cross-instance pub/sub backing the SSE endpoint, built on Postgres
 * LISTEN/NOTIFY so it works whether the app runs as a single process
 * (LAN / VPS) or many isolated serverless functions (Vercel) — the
 * database is the shared broker.
 *
 *  - `publish()` fires `pg_notify` over the normal pooled Prisma client.
 *    A NOTIFY is one statement, so it's safe over a transaction pooler.
 *    It's async and MUST be awaited: on serverless the function can
 *    suspend the moment the action returns, cutting off an un-awaited write.
 *  - `subscribe()` registers an in-process listener and ensures this
 *    instance holds ONE dedicated LISTEN connection that fans incoming
 *    notifications out to every local listener. LISTEN needs a session
 *    (non-pooled) connection, so it uses the direct/session URL
 *    (`resolveMigrationUrl`), never the transaction pooler.
 *
 * The listener set and the shared LISTEN client are stashed on
 * `globalThis` so they're shared per process and survive dev hot-reload.
 */
const BUS_KEY = Symbol.for("brewline.realtime.bus");

type Stash = {
  listeners: Set<Listener>;
  client: Client | null;
  connecting: boolean;
};

function getStash(): Stash {
  const g = globalThis as Record<symbol, unknown>;
  let stash = g[BUS_KEY] as Stash | undefined;
  if (!stash) {
    stash = { listeners: new Set(), client: null, connecting: false };
    g[BUS_KEY] = stash;
  }
  return stash;
}

export async function publish(event: RealtimeEvent): Promise<void> {
  try {
    // pg_notify is the parameterized form of NOTIFY (NOTIFY itself takes
    // only literals). $queryRaw because it's a SELECT; the row is ignored.
    await prisma.$queryRaw`SELECT pg_notify(${CHANNEL}, ${JSON.stringify(event)})`;
  } catch (err) {
    console.error("[realtime] publish failed", err);
  }
}

export function subscribe(listener: Listener): () => void {
  const stash = getStash();
  stash.listeners.add(listener);
  void ensureListening();
  return () => {
    stash.listeners.delete(listener);
    // The LISTEN connection is left warm at zero listeners: a serverless
    // instance is short-lived (torn down with its connection), and a
    // reconnecting browser re-subscribes within seconds, so churning the
    // connection buys nothing.
  };
}

function fanOut(payload: string): void {
  let event: RealtimeEvent;
  try {
    event = JSON.parse(payload) as RealtimeEvent;
  } catch {
    return;
  }
  for (const fn of getStash().listeners) {
    try {
      fn(event);
    } catch (err) {
      console.error("[realtime] listener threw", err);
    }
  }
}

/** Lazily open (and keep alive) the per-instance LISTEN connection. */
async function ensureListening(): Promise<void> {
  const stash = getStash();
  if (stash.client || stash.connecting) return;
  stash.connecting = true;

  const url = resolveMigrationUrl();
  if (!url) {
    stash.connecting = false;
    console.error("[realtime] no database URL for LISTEN connection");
    return;
  }

  const conn = pgConnectionConfig(url);
  const client = new Client(
    typeof conn === "string" ? { connectionString: conn } : conn,
  );

  client.on("notification", (msg) => {
    if (msg.channel === CHANNEL && msg.payload) fanOut(msg.payload);
  });

  const reconnectIfNeeded = () => {
    if (stash.client === client) stash.client = null;
    if (stash.listeners.size > 0 && !stash.connecting) {
      setTimeout(() => void ensureListening(), 1_000);
    }
  };
  client.on("error", reconnectIfNeeded);
  client.on("end", reconnectIfNeeded);

  try {
    await client.connect();
    await client.query(`LISTEN ${CHANNEL}`);
    stash.client = client;
  } catch (err) {
    console.error("[realtime] LISTEN connection failed", err);
    try {
      await client.end();
    } catch {
      // already down
    }
    stash.connecting = false;
    reconnectIfNeeded();
    return;
  }
  stash.connecting = false;
}
