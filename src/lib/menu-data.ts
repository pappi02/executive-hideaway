import { prisma } from "@/lib/prisma";
import type {
  Chapter,
  Dish,
  DishTag,
  Section,
} from "@/app/menu/types/menu";

/** Reads the whole menu, ordered for display, from the database. */
export async function getMenuChapters(): Promise<Chapter[]> {
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          dishes: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  return chapters.map(toChapter);
}

function toChapter(chapter: {
  id: string;
  eyebrow: string;
  title: string;
  standfirst: string | null;
  image: string | null;
  imagePosition: string | null;
  note: string | null;
  footnote: string | null;
  columns: number;
  stock: string;
  sections: Array<{
    id: string;
    title: string;
    note: string | null;
    dishes: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number | null;
      priceNote: string | null;
      tags: string[];
      unavailable: boolean;
    }>;
  }>;
}): Chapter {
  return {
    id: chapter.id,
    eyebrow: chapter.eyebrow,
    title: chapter.title,
    standfirst: chapter.standfirst ?? undefined,
    image: chapter.image ?? undefined,
    imagePosition: chapter.imagePosition ?? undefined,
    note: chapter.note ?? undefined,
    footnote: chapter.footnote ?? undefined,
    columns: chapter.columns === 2 ? 2 : 1,
    stock: chapter.stock === "bone" ? "bone" : "onyx",
    sections: chapter.sections.map(toSection),
  };
}

function toSection(section: {
  id: string;
  title: string;
  note: string | null;
  dishes: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    priceNote: string | null;
    tags: string[];
    unavailable: boolean;
  }>;
}): Section {
  return {
    id: section.id,
    title: section.title,
    note: section.note ?? undefined,
    dishes: section.dishes.map(toDish),
  };
}

const VALID_TAGS: readonly DishTag[] = [
  "vegetarian",
  "vegan",
  "spicy",
  "signature",
  "gluten-free",
  "contains-nuts",
];

function toDish(dish: {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  priceNote: string | null;
  tags: string[];
  unavailable: boolean;
}): Dish {
  return {
    id: dish.id,
    name: dish.name,
    description: dish.description ?? undefined,
    price: dish.price ?? undefined,
    priceNote: dish.priceNote ?? undefined,
    tags: dish.tags.filter((tag): tag is DishTag =>
      (VALID_TAGS as readonly string[]).includes(tag),
    ),
    unavailable: dish.unavailable,
  };
}
