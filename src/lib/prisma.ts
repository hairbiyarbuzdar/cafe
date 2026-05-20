import "server-only";

import { PrismaClient } from "@/generated/prisma";

import { createPgAdapter } from "./db-adapter";
import { resolveDatabaseUrl } from "./db-url";

/**
 * Prisma client singleton.
 *
 * Prisma 7 requires a driver adapter — `createPgAdapter` wraps
 * node-postgres and is fed from the resolved connection URL (local by
 * default, Supabase when `DB_TARGET=supabase`), enabling TLS for hosted
 * Postgres (Supabase/Neon/RDS) while leaving local Postgres on plain TCP.
 *
 * Next.js dev mode hot-reloads modules constantly; without the global
 * cache we'd churn a fresh client (and connection pool) on every change.
 * In production a fresh module load = a fresh process, so the cache is
 * harmless there.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — copy .env.example to .env or start Postgres via `npm run db:up`.",
    );
  }
  return new PrismaClient({
    adapter: createPgAdapter(url),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
