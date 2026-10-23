/** Poster types - kept apart from lib/posters.ts so the admin form (a client component) can use them without the database client. */
export const POSTER_KINDS = ["offer", "event", "announcement"] as const;
export type PosterKind = (typeof POSTER_KINDS)[number];

export const POSTER_KIND_LABELS: Record<PosterKind, string> = {
  offer: "Special offer",
  event: "Event",
  announcement: "Announcement",
};
