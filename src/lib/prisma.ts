import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 talks to Postgres through node-postgres (pg). The connection URLs
 * still carry Prisma 6's own query parameters (?pgbouncer=true&connection_limit=1
 * &pool_timeout=…), which pg doesn't understand, so they are translated into pg
 * pool options here instead.
 *
 * TLS: the Supabase URLs carry no sslmode, and pg — unlike Prisma 6's engine —
 * would then connect unencrypted. The connection is always encrypted; the
 * server certificate is verified when DATABASE_CA_CERT holds Supabase's CA
 * certificate (PEM, from the Supabase dashboard), as Prisma 6 never did.
 */
export function createPrismaClient(connectionUrl: string | undefined) {
  if (!connectionUrl) throw new Error("No database URL configured (DATABASE_URL / DIRECT_URL).");

  const url = new URL(connectionUrl);
  const param = (name: string) => {
    const value = url.searchParams.get(name);
    url.searchParams.delete(name);
    return value === null ? undefined : Number(value);
  };
  // Prisma 6's per-instance limit. Ignored: see `max` below.
  param("connection_limit");
  const connectTimeout = param("connect_timeout");
  const poolTimeout = param("pool_timeout");
  url.searchParams.delete("pgbouncer");

  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

  const adapter = new PrismaPg({
    connectionString: url.toString(),
    // A few connections per function instance. One instance can serve several
    // requests at once (Vercel Fluid compute), and with a single connection they
    // queue behind each other and time out under bursts. Supabase's transaction
    // pooler multiplexes these onto its own small set of database connections.
    max: Number(process.env.DATABASE_POOL_MAX) || 3,
    connectionTimeoutMillis: (connectTimeout ?? poolTimeout ?? 10) * 1000,
    idleTimeoutMillis: 10_000,
    ssl: ca ? { ca } : { rejectUnauthorized: false },
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// `next build` prerenders the cached public pages from several workers at once,
// and Supabase's transaction pooler (DATABASE_URL, port 6543) refuses that burst.
// The build uses the session connection (DIRECT_URL, port 5432) instead; live
// requests stay on the transaction pooler, which suits serverless functions.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const connectionUrl = (isBuild && process.env.DIRECT_URL) || process.env.DATABASE_URL;

// Created on first use, so importing this module (tests, `prisma generate`
// environments) never requires a database URL.
function getPrisma() {
  globalForPrisma.prisma ??= createPrismaClient(connectionUrl);
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrisma();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
