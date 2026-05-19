import type { NextRequest } from "next/server";

import { getServerSession } from "@/lib/auth";
import { subscribe } from "@/lib/realtime/bus";
import type { RealtimeEvent } from "@/lib/realtime/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 25_000;

/**
 * Server-Sent Events stream. Each connected client (POS, Kitchen,
 * Orders, …) holds one long-lived `text/event-stream` response and
 * receives events the moment `publish()` is called server-side.
 *
 * Notes:
 *  - The route is gated by `proxy.ts` for unauthenticated visitors;
 *    we double-check here so a direct hit (e.g. from a stale tab
 *    whose cookie was cleared) returns 401 rather than streaming.
 *  - A comment-line heartbeat every 25s keeps idle proxies from
 *    timing the connection out (most kill idle streams at 30-60s).
 *  - `X-Accel-Buffering: no` tells nginx / similar reverse proxies
 *    to flush each chunk instead of buffering the whole stream.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const session = await getServerSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try {
          controller.enqueue(chunk);
        } catch {
          closed = true;
        }
      };

      const send = (event: RealtimeEvent) => {
        // Name the event so the browser dispatches it on
        // `EventSource.addEventListener(event.type, …)` and not just
        // the generic `message` channel.
        safeEnqueue(
          encoder.encode(
            `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
          ),
        );
      };

      // Preamble comment line — tells the client the stream is live
      // before any business event arrives.
      safeEnqueue(encoder.encode(`: connected\n\n`));

      const unsubscribe = subscribe(send);
      const heartbeat = setInterval(() => {
        safeEnqueue(encoder.encode(`: ping\n\n`));
      }, HEARTBEAT_MS);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed by the runtime
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
