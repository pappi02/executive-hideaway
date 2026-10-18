import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-config";

// Room URLs come from the database; cache the sitemap and refresh it hourly
// (room edits in the admin dashboard also revalidate it).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No catch: if the database is unreachable during revalidation, the
  // regeneration fails and the last good sitemap keeps being served, instead of
  // a sitemap without room URLs being cached for an hour.
  const rooms = await prisma.accommodation.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
    orderBy: { order: "asc" },
  });
  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/accommodation", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services", changeFrequency: "monthly", priority: 0.7 },
    { path: "/menu", changeFrequency: "monthly", priority: 0.7 },
    { path: "/games", changeFrequency: "monthly", priority: 0.6 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { path: "/booking", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.2 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.2 },
  ];

  return [
    ...routes.map(({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}${path}`,
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
