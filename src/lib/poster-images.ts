import { del, put } from "@vercel/blob";
import { AdminInputError } from "@/lib/admin-action";
import { isBlobStorageConfigured } from "@/lib/accommodation-images";

/**
 * Poster images: stored in Vercel Blob when a store is connected (served from
 * its CDN), otherwise kept in the database and served by /api/posters/[id]/image.
 */

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
// Vercel refuses request bodies over 4.5 MB, so the whole form must stay under it.
export const POSTER_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

export interface PosterImage {
  imageUrl: string | null;
  imageData: Uint8Array<ArrayBuffer> | null;
  imageType: string | null;
}

/** The uploaded file, checked to really be a JPEG, PNG or WebP; null when none was chosen. */
export async function readPosterImage(formData: FormData): Promise<{ data: Uint8Array<ArrayBuffer>; type: string } | null> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;
  if (!TYPES[file.type]) throw new AdminInputError("Use a JPEG, PNG, or WebP image.");
  if (file.size > POSTER_IMAGE_MAX_BYTES) {
    throw new AdminInputError("The poster must be 4 MB or smaller. Save it as a JPEG or WebP to make it smaller.");
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
  const isWebp = data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46
    && data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50;
  if ((file.type === "image/jpeg" && !isJpeg) || (file.type === "image/png" && !isPng) || (file.type === "image/webp" && !isWebp)) {
    throw new AdminInputError("The selected file's contents don't match its image format.");
  }
  return { data, type: file.type };
}

export async function storePosterImage(image: { data: Uint8Array<ArrayBuffer>; type: string }): Promise<PosterImage> {
  if (!isBlobStorageConfigured()) {
    return { imageUrl: null, imageData: image.data, imageType: image.type };
  }
  try {
    const blob = await put(`posters/poster.${TYPES[image.type]}`, Buffer.from(image.data), {
      access: "public",
      contentType: image.type,
      addRandomSuffix: true,
      // Each upload gets its own URL and is never edited in place.
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return { imageUrl: blob.url, imageData: null, imageType: image.type };
  } catch (error) {
    console.error("Poster upload to Blob failed", error);
    throw new AdminInputError("The poster image could not be uploaded. Please try again.");
  }
}

/** Best-effort: removes an uploaded Blob image (files under /public are left alone). */
export async function deletePosterBlob(url: string | null | undefined) {
  if (!url || !url.startsWith("https://") || !isBlobStorageConfigured()) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete poster image from Blob storage", error);
  }
}
