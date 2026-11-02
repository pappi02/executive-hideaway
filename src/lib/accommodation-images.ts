import { del, put } from "@vercel/blob";

/**
 * Room photos used to live in Postgres as raw bytes and were streamed through a
 * serverless function on every cache miss. New uploads go to Vercel Blob and are
 * served straight from its CDN; the database only keeps the URL.
 *
 * Rows that have not been migrated yet still carry `data` and are served by
 * /api/accommodation-images/[id] until `npm run images:migrate` moves them.
 */

export function isBlobStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function storeAccommodationImage(
  accommodationId: string,
  data: Uint8Array,
  contentType: string,
) {
  const extension = EXTENSIONS[contentType] ?? "bin";
  const blob = await put(`accommodation/${accommodationId}/image.${extension}`, Buffer.from(data), {
    access: "public",
    contentType,
    addRandomSuffix: true,
    // Each upload gets a unique URL and is never edited in place, so it can be cached for a year.
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

/** Tried twice. A failed delete leaves an orphaned blob, never a broken page, so it is logged by URL for removal by hand. */
export async function deleteBlobs(urls: (string | null | undefined)[]) {
  const targets = urls.filter((url): url is string => Boolean(url));
  if (!targets.length || !isBlobStorageConfigured()) return;
  try {
    await del(targets).catch(() => del(targets));
  } catch (error) {
    console.error(`Failed to delete from Blob storage: ${targets.join(", ")}`, error);
  }
}

export const deleteAccommodationBlobs = deleteBlobs;
