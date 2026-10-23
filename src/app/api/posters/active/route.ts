import { listLivePosters } from "@/lib/posters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/posters/active - posters running right now, for the site pop-up.
 * The same for every visitor, so the CDN caches it for a minute: an edit in
 * the admin shows within about a minute.
 */
export async function GET() {
  try {
    const posters = await listLivePosters();
    return Response.json(
      { data: posters },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } },
    );
  } catch (error) {
    // No poster rather than a broken page; not cached, so it recovers with the database.
    console.error("Active posters error", error);
    return Response.json({ data: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
