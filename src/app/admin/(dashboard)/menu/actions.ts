"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  AdminInputError,
  adminAction,
  oneOf,
  optionalImagePath,
  optionalInteger,
  optionalText,
  requiredText,
  slugify,
  type ActionResult,
} from "@/lib/admin-action";
import type { DishTag } from "@/app/menu/types/menu";

const DISH_TAGS: readonly DishTag[] = ["vegetarian", "vegan", "spicy", "signature", "gluten-free", "contains-nuts"];

function revalidateMenu() {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

/** Ids double as URL segments; "new" is the create-form route. */
function idFrom(value: string, label: string) {
  const id = slugify(value);
  if (!id) throw new AdminInputError(`The ${label} needs at least one letter or number.`);
  if (id === "new") throw new AdminInputError(`"New" can't be used as a ${label}.`);
  return id;
}

/** Next order value at the end of a list (count() repeats values after deletions). */
function nextOrder(last: { order: number } | null) {
  return (last?.order ?? -1) + 1;
}

/* ---------------------------------- Chapters ---------------------------------- */

function readChapterFields(formData: FormData) {
  return {
    title: requiredText(formData, "title", { label: "Title", max: 120 }),
    eyebrow: requiredText(formData, "eyebrow", { label: "Eyebrow", max: 120 }),
    standfirst: optionalText(formData, "standfirst", { label: "Standfirst", max: 300 }),
    image: optionalImagePath(formData, "image", "Image path"),
    note: optionalText(formData, "note", { label: "Note", max: 500 }),
    footnote: optionalText(formData, "footnote", { label: "Footnote", max: 500 }),
    columns: Number(oneOf(formData, "columns", ["1", "2"] as const, "column count")),
    stock: oneOf(formData, "stock", ["onyx", "bone"] as const, "page style"),
  };
}

export async function createChapter(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readChapterFields(formData);
    const last = await prisma.chapter.findFirst({ orderBy: { order: "desc" }, select: { order: true } });

    await prisma.chapter.create({
      data: { id: idFrom(fields.title, "chapter title"), ...fields, order: nextOrder(last) },
    });
    revalidateMenu();
  });
}

export async function updateChapter(id: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    await prisma.chapter.update({ where: { id }, data: readChapterFields(formData) });
    revalidateMenu();
  });
}

export async function deleteChapter(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Chapter ID" });

    // Sections and dishes reference their parent with ON DELETE RESTRICT, so
    // remove the children first — all or nothing.
    await prisma.$transaction([
      prisma.dish.deleteMany({ where: { section: { chapterId: id } } }),
      prisma.section.deleteMany({ where: { chapterId: id } }),
      prisma.chapter.delete({ where: { id } }),
    ]);
    revalidateMenu();
  });
}

/* ---------------------------------- Sections ---------------------------------- */

export async function createSection(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const chapterId = requiredText(formData, "chapterId", { label: "Chapter" });
    const title = requiredText(formData, "title", { label: "Section title", max: 120 });
    const last = await prisma.section.findFirst({
      where: { chapterId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await prisma.section.create({
      data: { id: `${chapterId}-${idFrom(title, "section title")}`, chapterId, title, order: nextOrder(last) },
    });
    revalidateMenu();
  });
}

export async function deleteSection(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Section ID" });

    await prisma.$transaction([
      prisma.dish.deleteMany({ where: { sectionId: id } }),
      prisma.section.delete({ where: { id } }),
    ]);
    revalidateMenu();
  });
}

/* ------------------------------------ Dishes ----------------------------------- */

function readDishFields(formData: FormData) {
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, all) => all.indexOf(tag) === index);
  const unknown = tags.filter((tag) => !(DISH_TAGS as readonly string[]).includes(tag));
  if (unknown.length) {
    throw new AdminInputError(`Unknown tag "${unknown[0]}". Use: ${DISH_TAGS.join(", ")}.`);
  }

  return {
    name: requiredText(formData, "name", { label: "Dish name", max: 120 }),
    description: optionalText(formData, "description", { label: "Description", max: 500 }),
    price: optionalInteger(formData, "price", { label: "Price" }),
    priceNote: optionalText(formData, "priceNote", { label: "Price note", max: 120 }),
    tags,
    unavailable: formData.get("unavailable") === "on",
  };
}

export async function createDish(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const sectionId = requiredText(formData, "sectionId", { label: "Section" });
    const fields = readDishFields(formData);
    const last = await prisma.dish.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await prisma.dish.create({
      data: { id: `${sectionId}-${idFrom(fields.name, "dish name")}`, sectionId, ...fields, order: nextOrder(last) },
    });
    revalidateMenu();
  });
}

export async function updateDish(id: string, chapterId: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    await prisma.dish.update({ where: { id }, data: readDishFields(formData) });
    revalidateMenu();
  });
}

export async function deleteDish(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Dish ID" });
    await prisma.dish.delete({ where: { id } });
    revalidateMenu();
  });
}
