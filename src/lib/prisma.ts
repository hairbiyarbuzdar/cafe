import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma client singleton.
 *
 * Prisma 7 requires a driver adapter — `PrismaPg` wraps node-postgres
 * and is fed straight from `DATABASE_URL`.
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
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — copy .env.example to .env or start Postgres via `npm run db:up`.",
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg(url),
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
