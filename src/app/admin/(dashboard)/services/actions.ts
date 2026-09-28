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

function readServiceFields(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: priceRaw === "" ? null : Number(priceRaw),
    duration: Number(formData.get("duration") ?? 0),
    image: String(formData.get("image") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
  };
}

export async function createService(formData: FormData) {
  await requireAdmin();

  const fields = readServiceFields(formData);
  const id = slugify(fields.name);

  const count = await prisma.service.count({
    where: { categoryId: fields.categoryId },
  });

  await prisma.service.create({
    data: { id, ...fields, order: count },
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();

  const fields = readServiceFields(formData);

  await prisma.service.update({
    where: { id },
    data: fields,
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.service.delete({ where: { id } });

  revalidatePath("/services");
  revalidatePath("/admin/services");
}
