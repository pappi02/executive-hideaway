"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  deleteAccommodationBlobs,
  isBlobStorageConfigured,
  storeAccommodationImage,
} from "@/lib/accommodation-images";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function requiredText(formData: FormData, name: string, label: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`${label} is required.`);
  return value;
}

function optionalBoolean(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "");
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function readAccommodationFields(formData: FormData) {
  const name = requiredText(formData, "name", "Room name");
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  const description = requiredText(formData, "description", "Description");
  const priceRaw = String(formData.get("pricePerNight") ?? "").trim();
  const pricePerNight = priceRaw === "" ? null : Number(priceRaw);
  const numberOfRooms = Number(formData.get("numberOfRooms"));
  const maxGuests = Number(formData.get("maxGuests"));

  if (!slug) throw new Error("Enter a valid room name or slug.");
  if (pricePerNight !== null && (!Number.isSafeInteger(pricePerNight) || pricePerNight < 0)) {
    throw new Error("Price must be a non-negative whole number.");
  }
  if (!Number.isSafeInteger(numberOfRooms) || numberOfRooms < 0) {
    throw new Error("Number of rooms must be zero or greater.");
  }
  if (!Number.isSafeInteger(maxGuests) || maxGuests < 1) {
    throw new Error("Maximum guests must be at least one.");
  }

  const amenities = String(formData.get("amenities") ?? "")
    .split(/\r?\n/)
    .map((amenity) => amenity.trim())
    .filter(Boolean)
    .filter((amenity, index, all) => all.indexOf(amenity) === index);

  return {
    name,
    slug,
    description,
    pricePerNight,
    priceIsIndicative: formData.get("priceIsIndicative") === "on",
    isTemporary: formData.get("isTemporary") === "on",
    numberOfRooms,
    maxGuests,
    bedType: String(formData.get("bedType") ?? "").trim() || null,
    roomSize: String(formData.get("roomSize") ?? "").trim() || null,
    bathroom: String(formData.get("bathroom") ?? "").trim() || null,
    amenities,
    breakfastIncluded: optionalBoolean(formData, "breakfastIncluded"),
    wifiAvailable: optionalBoolean(formData, "wifiAvailable"),
    parkingAvailable: optionalBoolean(formData, "parkingAvailable"),
    childrenAllowed: formData.get("childrenAllowed") === "on",
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };
}

function revalidateAccommodation() {
  // The home page shows the featured room and the sitemap lists room URLs.
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/accommodation");
  revalidatePath("/accommodation/[slug]", "page");
  revalidatePath("/admin/accommodation");
}

async function assertUniqueRoomSlug(slug: string, currentId?: string) {
  const existing = await prisma.accommodation.findUnique({ where: { slug }, select: { id: true } });
  if (existing && existing.id !== currentId) throw new Error("That room URL is already in use.");
}

async function assertUniqueFacilitySlug(slug: string, currentId?: string) {
  const existing = await prisma.resortFacility.findUnique({ where: { slug }, select: { id: true } });
  if (existing && existing.id !== currentId) throw new Error("That resort experience URL is already in use.");
}

export async function createAccommodation(formData: FormData) {
  await requireAdmin();
  const fields = readAccommodationFields(formData);
  await assertUniqueRoomSlug(fields.slug);
  const order = await prisma.accommodation.count();

  await prisma.accommodation.create({ data: { ...fields, order } });
  revalidateAccommodation();
}

export async function updateAccommodation(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readAccommodationFields(formData);
  await assertUniqueRoomSlug(fields.slug, id);

  await prisma.accommodation.update({ where: { id }, data: fields });
  revalidateAccommodation();
}

export async function deleteAccommodation(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Room ID");

  // Image rows cascade-delete with the room; collect their Blob URLs first.
  const images = await prisma.accommodationImage.findMany({
    where: { accommodationId: id },
    select: { url: true },
  });
  await prisma.accommodation.delete({ where: { id } });
  await deleteAccommodationBlobs(images.map((image) => image.url));
  revalidateAccommodation();
}

export async function setAccommodationActive(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Room ID");
  const active = formData.get("active") === "true";

  await prisma.accommodation.update({ where: { id }, data: { active } });
  revalidateAccommodation();
}

export async function uploadAccommodationImages(
  accommodationId: string,
  formData: FormData,
) {
  await requireAdmin();
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  const altText = requiredText(formData, "altText", "Image description");

  if (!files.length) throw new Error("Choose at least one image to upload.");
  if (files.length > 8) throw new Error("Upload up to eight images at a time.");
  if (files.reduce((total, file) => total + file.size, 0) > 9 * 1024 * 1024) {
    throw new Error("Keep the total upload size below 9 MB per request.");
  }

  const room = await prisma.accommodation.findUnique({
    where: { id: accommodationId },
    include: {
      _count: { select: { images: true } },
      images: { orderBy: { order: "desc" }, take: 1, select: { order: true } },
    },
  });
  if (!room) throw new Error("This room no longer exists.");
  if (room._count.images + files.length > 12) throw new Error("A room can have up to twelve images.");

  const firstOrder = (room.images[0]?.order ?? -1) + 1;
  const uploads = files.map(async (file, index) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Use a JPEG, PNG, or WebP image.");
    }
    if (file.size > 8 * 1024 * 1024) throw new Error("Each image must be 8 MB or smaller.");
    const data = new Uint8Array(await file.arrayBuffer());
    const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
    const isWebp = data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46
      && data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50;
    if ((file.type === "image/jpeg" && !isJpeg) || (file.type === "image/png" && !isPng) || (file.type === "image/webp" && !isWebp)) {
      throw new Error("The selected file contents do not match their image format.");
    }

    return { data, contentType: file.type, order: firstOrder + index };
  });
  const validated = await Promise.all(uploads);

  if (!isBlobStorageConfigured()) {
    // Fallback until a Blob store is connected: keep the old behaviour of storing bytes in Postgres.
    console.warn("BLOB_READ_WRITE_TOKEN is not set; storing accommodation images in the database.");
    await prisma.accommodationImage.createMany({
      data: validated.map((image) => ({ accommodationId, altText, ...image })),
    });
    revalidateAccommodation();
    return;
  }

  const stored = await Promise.allSettled(
    validated.map((image) => storeAccommodationImage(accommodationId, image.data, image.contentType)),
  );
  const failed = stored.find((result) => result.status === "rejected");
  if (failed) {
    await deleteAccommodationBlobs(stored.map((result) => (result.status === "fulfilled" ? result.value : null)));
    throw new Error("An image could not be uploaded. Please try again.", { cause: failed.reason });
  }
  const urls = stored.map((result) => (result as PromiseFulfilledResult<string>).value);
  try {
    await prisma.accommodationImage.createMany({
      data: validated.map((image, index) => ({
        accommodationId,
        altText,
        url: urls[index],
        contentType: image.contentType,
        order: image.order,
      })),
    });
  } catch (error) {
    await deleteAccommodationBlobs(urls);
    throw error;
  }
  revalidateAccommodation();
}

export async function updateAccommodationImageAlt(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Image ID");
  const altText = requiredText(formData, "altText", "Image description");
  await prisma.accommodationImage.update({ where: { id }, data: { altText } });
  revalidateAccommodation();
}

export async function deleteAccommodationImage(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Image ID");
  const deletedUrl = await prisma.$transaction(async (transaction) => {
    const image = await transaction.accommodationImage.findUnique({
      where: { id },
      select: { accommodationId: true, url: true },
    });
    if (!image) return null;
    await transaction.accommodationImage.delete({ where: { id } });
    const remaining = await transaction.accommodationImage.findMany({
      where: { accommodationId: image.accommodationId },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    await Promise.all(remaining.map((item, order) =>
      transaction.accommodationImage.update({ where: { id: item.id }, data: { order } }),
    ));
    return image.url;
  });
  await deleteAccommodationBlobs([deletedUrl]);
  revalidateAccommodation();
}

export async function moveAccommodationImage(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Image ID");
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") return;

  const image = await prisma.accommodationImage.findUnique({
    where: { id },
    select: { accommodationId: true },
  });
  if (!image) return;

  const images = await prisma.accommodationImage.findMany({
    where: { accommodationId: image.accommodationId },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  const index = images.findIndex((candidate) => candidate.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= images.length) return;

  [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
  await prisma.$transaction(
    images.map((candidate, order) =>
      prisma.accommodationImage.update({ where: { id: candidate.id }, data: { order } }),
    ),
  );
  revalidateAccommodation();
}

export async function updateAccommodationSettings(formData: FormData) {
  await requireAdmin();
  const checkIn = String(formData.get("checkIn") ?? "").trim() || null;
  const checkOut = String(formData.get("checkOut") ?? "").trim() || null;
  if ((checkIn?.length ?? 0) > 120 || (checkOut?.length ?? 0) > 120) {
    throw new Error("Check-in and check-out information must be 120 characters or fewer.");
  }

  await prisma.accommodationSettings.upsert({
    where: { id: "default" },
    create: { id: "default", checkIn, checkOut },
    update: { checkIn, checkOut },
  });
  revalidateAccommodation();
}

function readFacilityFields(formData: FormData) {
  const name = requiredText(formData, "name", "Facility name");
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  if (!slug) throw new Error("Enter a valid facility name or slug.");

  return {
    name,
    slug,
    category: requiredText(formData, "category", "Category"),
    description: String(formData.get("description") ?? "").trim() || null,
    href: String(formData.get("href") ?? "").trim() || null,
    active: formData.get("active") === "on",
  };
}

export async function createResortFacility(formData: FormData) {
  await requireAdmin();
  const fields = readFacilityFields(formData);
  await assertUniqueFacilitySlug(fields.slug);
  const order = await prisma.resortFacility.count();
  await prisma.resortFacility.create({ data: { ...fields, order } });
  revalidateAccommodation();
}

export async function updateResortFacility(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFacilityFields(formData);
  await assertUniqueFacilitySlug(fields.slug, id);
  await prisma.resortFacility.update({
    where: { id },
    data: fields,
  });
  revalidateAccommodation();
}

export async function deleteResortFacility(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "Facility ID");
  await prisma.resortFacility.delete({ where: { id } });
  revalidateAccommodation();
}