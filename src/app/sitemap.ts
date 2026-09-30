import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-config";

// Room URLs come from the database, so render per request rather than at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await prisma.accommodation
    .findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    })
    .catch(() => []);
  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/booking", changeFrequency: "monthly", priority: 0.7 },
    { path: "/accommodation", changeFrequency: "monthly", priority: 0.7 },
  ];

  return [
    ...routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    })),
    ...rooms.map((room) => ({
      url: `${siteUrl}/accommodation/${room.slug}`,
      lastModified: room.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
