import { POSTER_KINDS, type PosterKind } from "@/lib/poster-kinds";
import { prisma } from "@/lib/prisma";

/**
 * Promotional posters (prisma model Poster). The live ones pop up on the
 * public site via /api/posters/active and PosterPopup; clicking one opens its
 * own section at the top of /services (PosterOffers), which carries the full
 * details. Admins manage them at /admin/posters.
 */

export { POSTER_KIND_LABELS, POSTER_KINDS, type PosterKind } from "@/lib/poster-kinds";

/** What the pop-up needs. */
export interface PublicPoster {
  id: string;
  title: string;
  imageUrl: string;
  /** Always the poster's own section on the services page. */
  detailsUrl: string;
  delaySeconds: number;
  autoCloseSeconds: number;
  endsAt: string;
}

/** The full story, shown on the services page. */
export interface PosterDetails extends PublicPoster {
  kind: PosterKind;
  summary: string | null;
  details: string | null;
  highlights: string[];
  priceText: string | null;
  location: string | null;
  /** The booking button: where it goes and what it says. */
  ctaUrl: string | null;
  ctaLabel: string | null;
  terms: string | null;
}

export type PosterStatus = "live" | "scheduled" | "ended" | "paused";

export const POSTER_SECONDS_MAX = 300;

export function posterAnchor(id: string) {
  return `offer-${id}`;
}

export function posterDetailsUrl(id: string) {
  return `/services#${posterAnchor(id)}`;
}

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

function liveWhere() {
  const now = new Date();
  return { active: true, startsAt: { lte: now }, endsAt: { gt: now } };
}

const LIVE_ORDER = [{ priority: "desc" as const }, { startsAt: "desc" as const }];

/** Posters running right now, highest priority first (for the pop-up). */
export async function listLivePosters(): Promise<PublicPoster[]> {
  const rows = await prisma.poster.findMany({
    where: liveWhere(),
    orderBy: LIVE_ORDER,
    take: 5,
    // Never load the image bytes for a listing.
    select: { id: true, title: true, imageUrl: true, delaySeconds: true, autoCloseSeconds: true, endsAt: true, updatedAt: true },
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: posterImageSrc(row),
    detailsUrl: posterDetailsUrl(row.id),
    delaySeconds: row.delaySeconds,
    autoCloseSeconds: row.autoCloseSeconds,
    endsAt: row.endsAt.toISOString(),
  }));
}

/** Posters running right now with their full details (for the services page). */
export async function listLivePosterDetails(): Promise<PosterDetails[]> {
  const rows = await prisma.poster.findMany({
    where: liveWhere(),
    orderBy: LIVE_ORDER,
    take: 10,
    omit: { imageData: true },
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: posterImageSrc(row),
    detailsUrl: posterDetailsUrl(row.id),
    delaySeconds: row.delaySeconds,
    autoCloseSeconds: row.autoCloseSeconds,
    endsAt: row.endsAt.toISOString(),
    kind: (POSTER_KINDS as readonly string[]).includes(row.kind) ? (row.kind as PosterKind) : "offer",
    summary: row.summary,
    details: row.details,
    highlights: row.highlights,
    priceText: row.priceText,
    location: row.location,
    ctaUrl: row.linkUrl,
    ctaLabel: row.linkUrl ? row.ctaLabel || "Book now" : null,
    terms: row.terms,
  }));
}
