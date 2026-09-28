"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateMenu() {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

/* ---------------------------------- Chapters ---------------------------------- */

export async function createChapter(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const id = slugify(title);
  const count = await prisma.chapter.count();

  await prisma.chapter.create({
    data: {
      id,
      title,
      eyebrow: String(formData.get("eyebrow") ?? "").trim(),
      standfirst: String(formData.get("standfirst") ?? "").trim() || null,
      image: String(formData.get("image") ?? "").trim() || null,
      note: String(formData.get("note") ?? "").trim() || null,
      footnote: String(formData.get("footnote") ?? "").trim() || null,
      columns: Number(formData.get("columns") ?? 1),
      stock: String(formData.get("stock") ?? "onyx"),
      order: count,
    },
  });

  revalidateMenu();
}

export async function updateChapter(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.chapter.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      eyebrow: String(formData.get("eyebrow") ?? "").trim(),
      standfirst: String(formData.get("standfirst") ?? "").trim() || null,
      image: String(formData.get("image") ?? "").trim() || null,
      note: String(formData.get("note") ?? "").trim() || null,
      footnote: String(formData.get("footnote") ?? "").trim() || null,
      columns: Number(formData.get("columns") ?? 1),
      stock: String(formData.get("stock") ?? "onyx"),
    },
  });

  revalidateMenu();
}

export async function deleteChapter(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.chapter.delete({ where: { id } });

  revalidateMenu();
}

/* ---------------------------------- Sections ---------------------------------- */

export async function createSection(formData: FormData) {
  await requireAdmin();

  const chapterId = String(formData.get("chapterId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const id = `${chapterId}-${slugify(title)}`;
  const count = await prisma.section.count({ where: { chapterId } });

  await prisma.section.create({
    data: { id, chapterId, title, order: count },
  });

  revalidateMenu();
}

export async function deleteSection(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");
  if (!id) return;

  await prisma.section.delete({ where: { id } });

  revalidateMenu();
}

/* ------------------------------------ Dishes ----------------------------------- */

function readDishFields(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    price: priceRaw === "" ? null : Number(priceRaw),
    priceNote: String(formData.get("priceNote") ?? "").trim() || null,
    tags: tagsRaw === "" ? [] : tagsRaw.split(",").map((tag) => tag.trim()),
    unavailable: formData.get("unavailable") === "on",
  };
}

export async function createDish(formData: FormData) {
  await requireAdmin();

  const chapterId = String(formData.get("chapterId") ?? "");
  const sectionId = String(formData.get("sectionId") ?? "");
  const fields = readDishFields(formData);
  const id = `${sectionId}-${slugify(fields.name)}`;
  const count = await prisma.dish.count({ where: { sectionId } });

  await prisma.dish.create({
    data: { id, sectionId, ...fields, order: count },
  });

  revalidateMenu();
}

export async function updateDish(id: string, chapterId: string, formData: FormData) {
  await requireAdmin();

  const fields = readDishFields(formData);

  await prisma.dish.update({
    where: { id },
    data: fields,
  });

  revalidateMenu();
}

export async function deleteDish(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");
  if (!id) return;

  await prisma.dish.delete({ where: { id } });

  revalidateMenu();
}
