import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

/**
 * Connection config for a `DATABASE_URL`, shaped to work with both the
 * Prisma adapter and a raw `pg` Client/Pool.
 *
 * Local Postgres (the docker-compose box or a native install) speaks
 * plain TCP, so the URL passes straight through as a string.
 *
 * Hosted Postgres — Supabase, Neon, RDS — requires TLS. We can't rely on
 * an `sslmode` query param to switch it on, because node-postgres lets a
 * connection-string `sslmode` *override* an explicit `ssl` option (see
 * `pg/lib/connection-parameters.js`), and in our pinned `pg` version
 * `sslmode=require` is treated as strict `verify-full`. Supabase's pooler
 * cert often doesn't match the connection hostname, which would break the
 * demo. So for any non-local host we strip ssl params from the URL and
 * enable TLS in code with relaxed verification.
 *
 * This module is intentionally free of `server-only` and Next.js imports
 * so the `tsx` seed/wipe/push scripts can share it.
 */
export function pgConnectionConfig(url: string): string | PoolConfig {
  if (isLocalHost(url)) {
    return url;
  }
  return {
    connectionString: stripSslParams(url),
    ssl: { rejectUnauthorized: false },
  };
}

/** Build a node-postgres driver adapter from a `DATABASE_URL`. */
export function createPgAdapter(url: string): PrismaPg {
  return new PrismaPg(pgConnectionConfig(url));
}

function isLocalHost(url: string): boolean {
  const host = hostnameOf(url);
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Remove ssl-related query params so our explicit `ssl` option wins. If the
 * URL can't be parsed (e.g. an un-encoded password), fall back to the raw
 * string — the explicit `ssl` still applies as long as no `sslmode` slips
 * through.
 */
function stripSslParams(url: string): string {
  try {
    const parsed = new URL(url);
    for (const param of ["sslmode", "ssl", "sslcert", "sslkey", "sslrootcert"]) {
      parsed.searchParams.delete(param);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
