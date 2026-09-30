import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await prisma.accommodationImage.findUnique({
    where: { id },
    select: { data: true, contentType: true },
  });

  if (!image) return new Response("Image not found", { status: 404 });

  return new Response(Buffer.from(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}