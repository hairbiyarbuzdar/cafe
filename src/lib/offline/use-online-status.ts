"use client";

import * as React from "react";

/**
 * Track `navigator.onLine` reactively. Note: the browser flips this
 * based on the OS network interface, not on actual reachability of
 * our server. Flaky-wifi or captive-portal cases can still show
 * "online" while a fetch fails — the offline submit path catches
 * those by inspecting fetch errors.
 *
 * The initial state is **always** `true`, deliberately: reading
 * `navigator.onLine` inside the `useState` initialiser would make the
 * server's render (`true`) disagree with an offline client's first
 * render (`false`), causing a hydration mismatch in any component
 * whose tree branches on this hook (e.g. the NetworkStatus pill).
 * The real value is read inside the effect, after hydration is done.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = React.useState(true);

  React.useEffect(() => {
    if (typeof navigator !== "undefined") {
      setOnline(navigator.onLine);
    }
    if (typeof window === "undefined") return;
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return online;
}
