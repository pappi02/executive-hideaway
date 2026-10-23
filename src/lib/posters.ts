import { prisma } from "@/lib/prisma";

/**
 * Promotional posters (prisma model Poster). The live ones pop up on the
 * public site via /api/posters/active and PosterPopup; admins manage them at
 * /admin/posters.
 */

/** What the pop-up needs. */
export interface PublicPoster {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  delaySeconds: number;
  autoCloseSeconds: number;
  endsAt: string;
}

export type PosterStatus = "live" | "scheduled" | "ended" | "paused";

export const POSTER_SECONDS_MAX = 300;

/** The image's address: the stored URL, or the database-backed route (versioned so edits show). */
export function posterImageSrc(poster: { id: string; imageUrl: string | null; updatedAt: Date }): string {
  return poster.imageUrl ?? `/api/posters/${poster.id}/image?v=${poster.updatedAt.getTime()}`;
}

export function posterStatus(
  poster: { active: boolean; startsAt: Date; endsAt: Date },
  now = Date.now(),
): PosterStatus {
  if (now >= poster.endsAt.getTime()) return "ended";
  if (!poster.active) return "paused";
  return now < poster.startsAt.getTime() ? "scheduled" : "live";
}

/** Posters running right now, highest priority first. */
export async function listLivePosters(): Promise<PublicPoster[]> {
  const now = new Date();
  const rows = await prisma.poster.findMany({
    where: { active: true, startsAt: { lte: now }, endsAt: { gt: now } },
    orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
    take: 5,
    // Never load the image bytes for a listing.
    select: {
      id: true,
      title: true,
      imageUrl: true,
      linkUrl: true,
      delaySeconds: true,
      autoCloseSeconds: true,
      endsAt: true,
      updatedAt: true,
    },
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: posterImageSrc(row),
    linkUrl: row.linkUrl,
    delaySeconds: row.delaySeconds,
    autoCloseSeconds: row.autoCloseSeconds,
    endsAt: row.endsAt.toISOString(),
  }));
}
