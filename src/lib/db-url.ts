/**
 * Database URL resolution, shared by the runtime client (`src/lib/prisma.ts`),
 * the Prisma CLI (`prisma.config.ts`) and the `tsx` seed/wipe scripts so they
 * all agree on which database to talk to.
 *
 * The default target is local Postgres (`DATABASE_URL`). Set
 * `DB_TARGET=supabase` to point at the hosted Supabase database instead —
 * handy for exercising the online demo from a local machine without editing
 * connection strings. The Supabase URLs live under their own names so both
 * can sit in `.env` at once:
 *
 *   SUPABASE_DATABASE_URL  transaction pooler (port 6543) — app runtime
 *   SUPABASE_DIRECT_URL    session pooler (port 5432)     — migrations
 *
 * On a host like Vercel you can ignore the toggle entirely and just set
 * `DATABASE_URL` / `DIRECT_URL` directly to the Supabase values.
 */

export function isSupabaseTarget(): boolean {
  return process.env.DB_TARGET?.toLowerCase() === "supabase";
}

/** Connection URL the running app uses for queries. */
export function resolveDatabaseUrl(): string | undefined {
  if (isSupabaseTarget()) {
    return process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  }
  return process.env.DATABASE_URL;
}

/**
 * Connection URL the Prisma CLI uses for schema changes (db push / migrate).
 * Prefers a direct/session connection over a transaction pooler so migrations
 * run on a stable, non-pooled link.
 */
export function resolveMigrationUrl(): string | undefined {
  if (isSupabaseTarget()) {
    return (
      process.env.SUPABASE_DIRECT_URL ??
      process.env.SUPABASE_DATABASE_URL ??
      process.env.DATABASE_URL
    );
  }
  return process.env.DIRECT_URL ?? process.env.DATABASE_URL;
}
