import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration (generate, migrate, seed).
 *
 * Environment variables are not loaded automatically: the db:* npm scripts
 * preload .env.local with `node --env-file`, and Vercel provides them at build.
 *
 * Migrations run over the direct / session connection (DIRECT_URL, port 5432) —
 * the transaction pooler the app uses can't run migrations. The URL is optional
 * here so `prisma generate` (postinstall, CI) works with no database configured.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
