/**
 * Next.js loads `instrumentation.ts` into **both** the Node and Edge
 * server runtimes, so anything statically imported here has to be
 * portable between them. The Node-only work (reading network
 * interfaces, parsing `process.argv`) lives in a sibling module and
 * is reached via a dynamic import that Turbopack tree-shakes out of
 * the Edge bundle. Without this split, the warning analyser flags
 * `node:os` + `process.argv` on every dev request — even though the
 * runtime guard would have prevented them from actually executing.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
