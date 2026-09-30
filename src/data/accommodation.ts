import { prisma } from "@/lib/prisma";

export async function getActiveAccommodation() {
  return prisma.accommodation.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { name: "asc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function getActiveAccommodationBySlug(slug: string) {
  return prisma.accommodation.findFirst({
    where: { slug, active: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function getActiveResortFacilities() {
  return prisma.resortFacility.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function getAccommodationSettings() {
  return prisma.accommodationSettings.findUnique({ where: { id: "default" } });
}

export async function getFeaturedAccommodation() {
  return prisma.accommodation.findFirst({
    where: { active: true, featured: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
}