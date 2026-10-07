/**
 * Pure helpers shared by server and client components. Kept apart from
 * accommodation-images.ts so the Blob SDK never ends up in a client bundle.
 */

/** Columns the pages need. Never select `data` here — it is the image itself. */
export const accommodationImageSelect = {
  id: true,
  url: true,
  altText: true,
  order: true,
} as const;

/** Blob-hosted images load straight from the CDN; legacy rows go through the API route. */
export function accommodationImageSrc(image: { id: string; url: string | null }) {
  return image.url ?? `/api/accommodation-images/${image.id}`;
}
