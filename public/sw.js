/**
 * Brewline service worker — app-shell cache.
 *
 * Strategy:
 *   • Navigation requests (HTML) → network-first, fall back to a
 *     cached app shell so an offline reload still paints UI.
 *   • Static assets (Next.js /_next/static, fonts, images, the icon
 *     and manifest) → cache-first (immutable hashed paths).
 *   • Everything else (server actions, API routes, /api/realtime SSE,
 *     auth) → bypass entirely. Mutations and the live event stream
 *     MUST hit the network; we'll layer offline-queue support in a
 *     later phase when we wire IndexedDB-backed offline POS.
 *
 * Versioning: bumping CACHE_VERSION on every meaningful change forces
 * the old cache to be evicted on activation so stale chunks don't
 * leak across releases. Next.js's content-hashed asset URLs cover
 * the in-flight case (each new build references new file names).
 */

const CACHE_VERSION = "brewline-v4";
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
// `/pos` is the offline-critical route — cashiers must be able to
// keep taking orders when the network drops. Pre-warming it on
// install means a hard-reload while offline still paints the POS.
const APP_SHELL = ["/", "/pos", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // First-paint failures are non-fatal — runtime requests will
        // populate the cache on demand.
      }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GET; mutations must always reach the server.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cross-origin → don't intercept. Fonts.gstatic etc. handle their
  // own caching headers.
  if (url.origin !== self.location.origin) return;

  // Bypass: route handlers, server-action POSTs, and the SSE stream.
  // `/api/*` should never be cached — especially `/api/realtime`,
  // which is a long-lived stream that the cache would buffer to
  // death.
  if (url.pathname.startsWith("/api/")) return;

  // Bypass auth / onboarding so a logged-out user always sees the
  // freshest gate, not a stale cached redirect.
  if (
    url.pathname === "/login" ||
    url.pathname.startsWith("/login/") ||
    url.pathname === "/onboarding" ||
    url.pathname.startsWith("/onboarding/")
  ) {
    return;
  }

  // Static assets — cache-first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname === "/apple-icon" ||
    url.pathname === "/manifest.webmanifest" ||
    /\.(?:js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|gif|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigations — network-first, fall through to cached shell.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }
});

// ──────────────────────────────────────────────────────────────
// Web Push
// ──────────────────────────────────────────────────────────────
// `push` fires when the OS push service wakes the SW. The server
// (src/lib/push/server.ts) sends a JSON `PushPayload` body. We
// keep the SW resilient to malformed/missing payloads so a third-
// party push routing accident doesn't blow up the worker.
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Brewline", body: event.data?.text() ?? "" };
  }
  const title = payload.title || "Brewline";
  const options = {
    body: payload.body || "",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: payload.tag || undefined,
    data: { url: payload.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// On notification click: focus the matching tab if one is open
// (so we don't pile up duplicate Brewline windows), else open a
// new one to the URL the server attached.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of all) {
        try {
          const url = new URL(client.url);
          if (url.pathname === targetUrl && "focus" in client) {
            return client.focus();
          }
        } catch {
          // ignore unparseable
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })(),
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // No cache, no network. Let the browser show its default error.
    throw err;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const shellFallback = await cache.match("/");
    if (shellFallback) return shellFallback;
    throw err;
  }
}
