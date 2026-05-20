/**
 * Push the Prisma schema to Supabase WITHOUT Prisma's schema engine.
 *
 * Why this exists: on some networks (e.g. corporate firewalls) the Rust
 * schema engine can't reach Supabase — `prisma db push` fails with P1001
 * and the transaction pooler (6543) is blocked — even though node-postgres
 * connects fine over the session pooler (5432). This script sidesteps the
 * engine: it renders the schema DDL offline via `prisma migrate diff`
 * (no database connection) and applies it through node-postgres.
 *
 * Like `prisma db push`, this SYNCS the schema and is destructive: it drops
 * the app's tables/enums (CASCADE) and recreates them. It only touches
 * objects declared in schema.prisma — Supabase's own schemas (auth,
 * storage, …) are left alone. As a safety net it refuses to drop a
 * database that already has app tables unless you pass `--force`:
 *
 *   npm run db:push:supabase            # first-time / empty DB
 *   npm run db:push:supabase -- --force # re-sync, accepting data loss
 */
import { execSync } from "node:child_process";

import { Client } from "pg";

import { pgConnectionConfig } from "../src/lib/db-adapter";
import { resolveMigrationUrl } from "../src/lib/db-url";

try {
  process.loadEnvFile(".env");
} catch {
  // .env optional in CI / hosted runs
}

process.env.DB_TARGET = "supabase";

const force = process.argv.includes("--force");

if (!process.env.SUPABASE_DIRECT_URL && !process.env.SUPABASE_DATABASE_URL) {
  throw new Error(
    "No Supabase URL found — set SUPABASE_DIRECT_URL (session pooler, port 5432) in .env.",
  );
}

const url = resolveMigrationUrl();
if (!url) {
  throw new Error("Could not resolve a Supabase connection URL.");
}

function log(msg: string) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

/** Render the full schema as SQL, offline (no DB connection). */
function renderSchemaSql(): string {
  log("→ Rendering schema DDL (offline)…");
  return execSync(
    "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
}

/** Pull table + enum names out of the generated DDL. */
function parseObjects(ddl: string): { tables: string[]; enums: string[] } {
  const tables = [...ddl.matchAll(/CREATE TABLE (?:"public"\.)?"([^"]+)"/g)].map(
    (m) => m[1],
  );
  const enums = [...ddl.matchAll(/CREATE TYPE (?:"public"\.)?"([^"]+)"/g)].map(
    (m) => m[1],
  );
  return { tables, enums };
}

function buildDropSql(tables: string[], enums: string[]): string {
  const stmts: string[] = [];
  if (tables.length) {
    stmts.push(
      `DROP TABLE IF EXISTS ${tables.map((t) => `"${t}"`).join(", ")} CASCADE;`,
    );
  }
  if (enums.length) {
    stmts.push(
      `DROP TYPE IF EXISTS ${enums.map((e) => `"${e}"`).join(", ")} CASCADE;`,
    );
  }
  return stmts.join("\n");
}

async function main() {
  const ddl = renderSchemaSql();
  const { tables, enums } = parseObjects(ddl);
  if (!tables.length) {
    throw new Error("No CREATE TABLE statements found in generated DDL.");
  }

  const conn = pgConnectionConfig(url);
  const client = new Client(
    typeof conn === "string"
      ? { connectionString: conn, connectionTimeoutMillis: 15000 }
      : { ...conn, connectionTimeoutMillis: 15000 },
  );

  await client.connect();
  try {
    // Guard: don't silently wipe a DB that already has app data.
    const existing = await client.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' and table_name = ANY($1::text[])",
      [tables],
    );
    if (existing.rowCount && !force) {
      throw new Error(
        `Supabase already has ${existing.rowCount} app table(s). Re-running drops and recreates them (DATA LOSS). ` +
          "Pass --force to proceed:  npm run db:push:supabase -- --force",
      );
    }

    log(
      `→ Applying schema to Supabase (${tables.length} tables, ${enums.length} enums${
        existing.rowCount ? ", dropping existing first" : ""
      })…`,
    );
    // A multi-statement simple query runs atomically — any failure rolls back.
    await client.query(`${buildDropSql(tables, enums)}\n${ddl}`);

    const count = await client.query<{ n: string }>(
      "select count(*)::text as n from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
    );
    log(`✓ Schema in sync — ${count.rows[0].n} base tables in public.`);
  } finally {
    await client.end();
  }

  log("→ Regenerating Prisma client…");
  execSync("npx prisma generate", { stdio: "inherit" });
  log("✓ Done.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`\n✗ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
