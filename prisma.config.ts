import { defineConfig } from "prisma/config";

import { resolveMigrationUrl } from "./src/lib/db-url";

// Prisma 7 no longer auto-loads `.env`; pull it in explicitly so CLI
// commands see DATABASE_URL the way the runtime does.
try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional in CI / hosted environments where vars come from the shell.
}

/**
 * Prisma 7 moved connection config out of `schema.prisma`. The CLI
 * (migrate / db push / studio) reads from here; the runtime client
 * uses a `PrismaPg` adapter directly — see `src/lib/prisma.ts`.
 *
 * The CLI talks to the database through the Rust schema engine, which
 * connects via the URL string (libpq-style ssl) rather than our node
 * adapter. `resolveMigrationUrl()` picks a stable, non-pooled link:
 * locally it prefers `DIRECT_URL` then `DATABASE_URL`; with
 * `DB_TARGET=supabase` it uses the session pooler (`SUPABASE_DIRECT_URL`).
 */
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: resolveMigrationUrl(),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
