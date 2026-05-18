import { defineConfig, env } from "prisma/config";

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
 */
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
