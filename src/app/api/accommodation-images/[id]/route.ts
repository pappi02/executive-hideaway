import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Legacy image endpoint. New uploads live in Vercel Blob and pages link to them
 * directly; this route only serves rows still holding bytes in Postgres, and
 * redirects old links for images that have since moved to Blob.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Image rows are never edited in place (a new photo gets a new id), so the id is a valid ETag.
  // Answer revalidation requests without touching the database.
  const etag = `"${id}"`;
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch.split(",").some((tag) => tag.trim().replace(/^W\//, "") === etag)) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": CACHE_CONTROL },
    });
  }

  // Read the small columns first so migrated images never load their (now empty) bytes.
  const meta = await prisma.accommodationImage.findUnique({
    where: { id },
    select: { url: true, contentType: true },
  });
  if (!meta) return new Response("Image not found", { status: 404 });

  if (meta.url) {
    return new Response(null, {
      status: 308,
      headers: { Location: meta.url, "Cache-Control": CACHE_CONTROL },
    });
  }

  const image = await prisma.accommodationImage.findUnique({
    where: { id },
    select: { data: true },
  });
  if (!image?.data) return new Response("Image not found", { status: 404 });

  return new Response(Buffer.from(image.data), {
    headers: {
      "Content-Type": meta.contentType,
      "Cache-Control": CACHE_CONTROL,
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
