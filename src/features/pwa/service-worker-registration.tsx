"use client";

import * as React from "react";

/**
 * Registers the service worker on mount — in production only.
 *
 * In `next dev` Turbopack mints fresh chunk URLs as files change, but
 * the SW's cache-first strategy on `/_next/static/*` would happily
 * serve last session's module against this session's bundle —
 * resulting in `module factory is not available` errors and silent
 * HMR breakage. So:
 *
 *   • prod: register `sw.js` on `window.load` (after first paint).
 *   • dev:  proactively unregister any SW that a previous prod-style
 *           run (or an earlier dev build before this guard existed)
 *           may have left behind, and skip registration entirely.
 *
 * The unregister sweep is idempotent + cheap so it's safe to run
 * every dev mount.
 */
export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          for (const reg of regs) reg.unregister().catch(() => {});
        })
        .catch(() => {});
      // Also blow away any caches the SW left behind so a stale
      // chunk doesn't survive the unregister-and-reload cycle.
      if (typeof caches !== "undefined") {
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          .catch(() => {});
      }
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Registration failures are non-fatal — the app still
          // works fully online. Surface to the console so it's
          // findable during PWA QA.
          console.error("[pwa] service worker registration failed", err);
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
