"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  AdminInputError,
  adminAction,
  optionalInteger,
  requiredImagePath,
  requiredInteger,
  requiredText,
  slugify,
  type ActionResult,
} from "@/lib/admin-action";

async function readServiceFields(formData: FormData) {
  const categoryId = requiredText(formData, "categoryId", { label: "Category" });
  const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) throw new AdminInputError("Choose a valid category.");

  return {
    name: requiredText(formData, "name", { label: "Service name", max: 120 }),
    categoryId,
    description: requiredText(formData, "description", { label: "Description", max: 2000 }),
    price: optionalInteger(formData, "price", { label: "Price" }),
    duration: requiredInteger(formData, "duration", { label: "Duration (minutes)", min: 1, max: 24 * 60 }),
    image: requiredImagePath(formData, "image", "Image path"),
    imageAlt: requiredText(formData, "imageAlt", { label: "Image description", max: 200 }),
  };
}

function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidatePath("/admin/services");
}

export async function createService(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = await readServiceFields(formData);
    const id = slugify(fields.name);
    if (!id) throw new AdminInputError("The service name needs at least one letter or number.");
    // Ids double as URL segments; /admin/services/new is the create form.
    if (id === "new") throw new AdminInputError(`"New" can't be used as a service name.`);

    const last = await prisma.service.findFirst({
      where: { categoryId: fields.categoryId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await prisma.service.create({
      data: { id, ...fields, order: (last?.order ?? -1) + 1 },
    });
    revalidateServices();
  });
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = await readServiceFields(formData);
    await prisma.service.update({ where: { id }, data: fields });
    revalidateServices();
  });
}

export async function deleteService(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Service ID" });
    await prisma.service.delete({ where: { id } });
    revalidateServices();
  });
}
