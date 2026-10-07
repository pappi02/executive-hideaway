import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// `next build` prerenders the cached public pages from several workers at once,
// and Supabase's transaction pooler (DATABASE_URL, port 6543) refuses that burst.
// The build uses the session connection (DIRECT_URL, port 5432) instead; live
// requests stay on the transaction pooler, which suits serverless functions.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const datasourceUrl = (isBuild && process.env.DIRECT_URL) || process.env.DATABASE_URL;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
