import { networkInterfaces } from "node:os";

/**
 * LAN banner: prints once per Node process. We use a `globalThis`
 * sentinel because Next.js dev calls `register()` again on every
 * instrumentation hot-reload, and we don't want the banner to spam
 * the console.
 *
 * The banner is intentionally noisy because in a café deployment the
 * host machine *is* the operations dashboard — if the operator reads
 * this once on startup, they have everything they need to point
 * secondary devices (kitchen tablet, manager laptop, inventory
 * station) at the LAN URL.
 */
const g = globalThis as { __brewlineLanBannerPrinted?: boolean };
if (!g.__brewlineLanBannerPrinted) {
  g.__brewlineLanBannerPrinted = true;
  printLanBanner();
}

function printLanBanner() {
  const port = process.env.PORT ?? "3000";
  const ifaces = networkInterfaces();
  const lanIps: string[] = [];
  for (const list of Object.values(ifaces)) {
    if (!list) continue;
    for (const ip of list) {
      if (ip.family === "IPv4" && !ip.internal) {
        lanIps.push(ip.address);
      }
    }
  }

  // `next dev --experimental-https` enables a self-signed HTTPS dev
  // server. Reading process.argv keeps the npm script free of any
  // cross-platform env-var dance (no `cross-env` dependency needed).
  const protocol = process.argv.some(
    (a) => a === "--experimental-https" || a.startsWith("--experimental-https-"),
  )
    ? "https"
    : "http";
  const insecureCookies = process.env.BREWLINE_INSECURE_COOKIES === "1";

  // eslint-disable-next-line no-console
  console.log("\n┌─ Brewline LAN ────────────────────────────────────────");
  if (lanIps.length === 0) {
    console.log("│ No external network interface detected — host-only mode.");
  } else {
    console.log("│ Reachable from other LAN devices at:");
    for (const ip of lanIps) {
      console.log(`│   ${protocol}://${ip}:${port}`);
    }
  }
  console.log(`│ Local on the host machine: ${protocol}://localhost:${port}`);

  if (protocol === "http" && lanIps.length > 0) {
    console.log("│");
    console.log("│ ⚠ HTTP over LAN: secondary devices won't be able to use");
    console.log("│   service workers, Web Serial (thermal printer), or PWA");
    console.log("│   install. The realtime SSE bus + IndexedDB offline queue");
    console.log("│   still work. For full features, run with HTTPS:");
    console.log("│     npm run dev:lan:https");
  }
  if (process.env.NODE_ENV === "production" && !insecureCookies && protocol === "http") {
    console.log("│");
    console.log("│ ⚠ Production over HTTP: logins will fail because the");
    console.log("│   session cookie is set `secure`. Set");
    console.log("│   BREWLINE_INSECURE_COOKIES=1 in your environment, or");
    console.log("│   front the app with HTTPS via a reverse proxy.");
  }
  console.log("└───────────────────────────────────────────────────────\n");
}
