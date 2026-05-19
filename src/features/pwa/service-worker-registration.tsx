"use client";

import * as React from "react";

/**
 * Registers the service worker on mount.
 *
 * Mounted once from the root layout. We register on `load` (not on
 * mount) so the SW install doesn't compete with the initial page's
 * hydration + first paint — the user feels the app, *then* the SW
 * boots in the background.
 *
 * In dev (`next dev`) we deliberately keep the SW registered so the
 * install + activate flow can be tested end-to-end. If you need to
 * iterate the page chunks rapidly and the SW is getting in the way,
 * unregister from DevTools → Application → Service Workers.
 */
export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

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
