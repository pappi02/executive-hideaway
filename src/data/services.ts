import { prisma } from "@/lib/prisma";

export type ServiceCategory =
  | "haircut"
  | "massage"
  | "facial"
  | "spa treatment"
  | "nail care"
  | "wellness";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number | null;
  duration: number;
  image: string;
  imageAlt: string;
}

export interface ServiceCategoryData {
  id: ServiceCategory;
  label: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
}

const VALID_CATEGORIES: readonly ServiceCategory[] = [
  "haircut",
  "massage",
  "facial",
  "spa treatment",
  "nail care",
  "wellness",
];

function toCategoryId(id: string): ServiceCategory {
  return (VALID_CATEGORIES as readonly string[]).includes(id)
    ? (id as ServiceCategory)
    : "wellness";
}

/** All service categories, ordered for display. */
export async function getServiceCategories(): Promise<ServiceCategoryData[]> {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
  });

  return categories.map((category) => ({
    id: toCategoryId(category.id),
    label: category.label,
    eyebrow: category.eyebrow,
    description: category.description,
    image: category.image,
    imageAlt: category.imageAlt,
  }));
}

/** All services within one category, ordered for display. */
export async function getServicesByCategory(
  category: ServiceCategory,
): Promise<Service[]> {
  const services = await prisma.service.findMany({
    where: { categoryId: category },
    orderBy: { order: "asc" },
  });

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    category: toCategoryId(service.categoryId),
    description: service.description,
    price: service.price,
    duration: service.duration,
    image: service.image,
    imageAlt: service.imageAlt,
  }));
}
