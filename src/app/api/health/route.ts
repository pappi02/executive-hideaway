import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Uptime-monitor target: 200 when the app can reach the database, 503 when it
 * can't. Cached at the CDN for 30 seconds so polling (or abuse) reaches the
 * database at most twice a minute.
 */
export async function GET() {
  const started = Date.now();
  let database: "ok" | "unreachable" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "unreachable";
    console.error("health: database check failed", error);
  }

  const ok = database === "ok";
  return Response.json(
    { status: ok ? "ok" : "degraded", database, latencyMs: Date.now() - started },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": ok ? "public, s-maxage=30" : "no-store" },
    },
  );
}
