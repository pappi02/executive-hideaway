/**
 * Runs before a production build on Vercel (the vercel-build script): stops the
 * deploy if the code expects a migration the database doesn't have yet. A failed
 * build leaves the current site live, so the cost of stopping is only a delay.
 *
 * Other environments skip it. So does a project with no DIRECT_URL, since the
 * transaction pooler can't answer this check.
 */
import { spawnSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") process.exit(0);

if (!process.env.DIRECT_URL) {
  console.warn("check-migrations: DIRECT_URL is not set, so pending migrations were not checked.");
  process.exit(0);
}

const url = new URL(process.env.DIRECT_URL);
if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "30");

const result = spawnSync("npx", ["prisma", "migrate", "status"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, DIRECT_URL: url.toString() },
});

if (result.status !== 0) {
  console.error("check-migrations: migrations are pending or the database is unreachable. Run `npm run db:deploy`, then redeploy.");
  process.exit(1);
}
