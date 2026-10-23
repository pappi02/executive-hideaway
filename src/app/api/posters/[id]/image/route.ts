import { prisma } from "@/lib/prisma";
import { posterStatus } from "@/lib/posters";

export const runtime = "nodejs";

/**
 * Serves a poster image stored in the database (the fallback when no Vercel
 * Blob store is connected). Cached hard only while the poster is live, so
 * the admin preview of a scheduled or paused one is always current.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poster = await prisma.poster.findUnique({
    where: { id },
    select: { imageData: true, imageType: true, active: true, startsAt: true, endsAt: true },
  });
  if (!poster?.imageData || !poster.imageType) return new Response("Image not found", { status: 404 });

  const live = posterStatus(poster) === "live";
  return new Response(Buffer.from(poster.imageData), {
    headers: {
      "Content-Type": poster.imageType,
      // The URL changes whenever the poster is edited, so a live one can be cached hard.
      "Cache-Control": live ? "public, max-age=86400, s-maxage=86400" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
