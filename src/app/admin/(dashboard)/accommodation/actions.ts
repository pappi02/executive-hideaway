"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  AdminInputError,
  adminAction,
  optionalText,
  requiredText as readRequiredText,
  slugify,
  type ActionResult,
} from "@/lib/admin-action";
import {
  deleteAccommodationBlobs,
  isBlobStorageConfigured,
  storeAccommodationImage,
} from "@/lib/accommodation-images";

function requiredText(formData: FormData, name: string, label: string, max = 200) {
  return readRequiredText(formData, name, { label, max });
}

function text(formData: FormData, name: string, label: string, max = 120) {
  return optionalText(formData, name, { label, max });
}

/** Facility links: an on-site path or an https URL — never javascript: or other schemes. */
function linkHref(formData: FormData) {
  const value = text(formData, "href", "Link", 300);
  if (value === null) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    if (new URL(value).protocol === "https:") return value;
  } catch {}
  throw new AdminInputError("Link must start with / (a page on this site) or https://.");
}

function optionalBoolean(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "");
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function readAccommodationFields(formData: FormData) {
  const name = requiredText(formData, "name", "Room name", 120);
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  const description = requiredText(formData, "description", "Description", 4000);
  const priceRaw = String(formData.get("pricePerNight") ?? "").trim();
  const pricePerNight = priceRaw === "" ? null : Number(priceRaw);
  const numberOfRooms = Number(formData.get("numberOfRooms"));
  const maxGuests = Number(formData.get("maxGuests"));

  if (!slug) throw new AdminInputError("Enter a valid room name or slug.");
  // /accommodation/request is the booking-request page, so no room can own that URL.
  if (slug === "request") throw new AdminInputError(`"request" is reserved; choose another room URL.`);
  if (pricePerNight !== null && (!Number.isSafeInteger(pricePerNight) || pricePerNight < 0 || pricePerNight > 10_000_000)) {
    throw new AdminInputError("Price must be a whole number between 0 and 10,000,000.");
  }
  if (!Number.isSafeInteger(numberOfRooms) || numberOfRooms < 0 || numberOfRooms > 1000) {
    throw new AdminInputError("Number of rooms must be between 0 and 1,000.");
  }
  if (!Number.isSafeInteger(maxGuests) || maxGuests < 1 || maxGuests > 100) {
    throw new AdminInputError("Maximum guests must be between 1 and 100.");
  }

  const amenities = String(formData.get("amenities") ?? "")
    .split(/\r?\n/)
    .map((amenity) => amenity.trim())
    .filter(Boolean)
    .filter((amenity, index, all) => all.indexOf(amenity) === index);
  if (amenities.length > 40 || amenities.some((amenity) => amenity.length > 80)) {
    throw new AdminInputError("Keep amenities to 40 lines of up to 80 characters each.");
  }

  return {
    name,
    slug,
    description,
    pricePerNight,
    priceIsIndicative: formData.get("priceIsIndicative") === "on",
    isTemporary: formData.get("isTemporary") === "on",
    numberOfRooms,
    maxGuests,
    bedType: text(formData, "bedType", "Bed type"),
    roomSize: text(formData, "roomSize", "Room size"),
    bathroom: text(formData, "bathroom", "Bathroom"),
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
  if (existing && existing.id !== currentId) throw new AdminInputError("That room URL is already in use.");
}

async function assertUniqueFacilitySlug(slug: string, currentId?: string) {
  const existing = await prisma.resortFacility.findUnique({ where: { slug }, select: { id: true } });
  if (existing && existing.id !== currentId) throw new AdminInputError("That resort experience URL is already in use.");
}

export async function createAccommodation(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readAccommodationFields(formData);
    await assertUniqueRoomSlug(fields.slug);
    const order = ((await prisma.accommodation.findFirst({ orderBy: { order: "desc" }, select: { order: true } }))?.order ?? -1) + 1;

    await prisma.accommodation.create({ data: { ...fields, order } });
    revalidateAccommodation();
  });
}

export async function updateAccommodation(id: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readAccommodationFields(formData);
    await assertUniqueRoomSlug(fields.slug, id);

    await prisma.accommodation.update({ where: { id }, data: fields });
    revalidateAccommodation();
  });
}

export async function deleteAccommodation(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", "Room ID");

    // Image rows cascade-delete with the room; collect their Blob URLs first.
    const images = await prisma.accommodationImage.findMany({
      where: { accommodationId: id },
      select: { url: true },
    });
    await prisma.accommodation.delete({ where: { id } });
    await deleteAccommodationBlobs(images.map((image) => image.url));
    revalidateAccommodation();
  });
}

export async function setAccommodationActive(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", "Room ID");
    const active = formData.get("active") === "true";

    await prisma.accommodation.update({ where: { id }, data: { active } });
    revalidateAccommodation();
  });
}

export async function uploadAccommodationImages(
  accommodationId: string,
  formData: FormData,
): Promise<ActionResult> {
  return adminAction(async () => {
    const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    const altText = requiredText(formData, "altText", "Image description", 200);

    if (!files.length) throw new AdminInputError("Choose at least one image to upload.");
    if (files.length > 8) throw new AdminInputError("Upload up to eight images at a time.");
    if (files.reduce((total, file) => total + file.size, 0) > 9 * 1024 * 1024) {
      throw new AdminInputError("Keep the total upload size below 9 MB per request.");
    }

    const room = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: {
        _count: { select: { images: true } },
        images: { orderBy: { order: "desc" }, take: 1, select: { order: true } },
      },
    });
    if (!room) throw new AdminInputError("This room no longer exists.");
    if (room._count.images + files.length > 12) throw new AdminInputError("A room can have up to twelve images.");

    const firstOrder = (room.images[0]?.order ?? -1) + 1;
    const uploads = files.map(async (file, index) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new AdminInputError("Use a JPEG, PNG, or WebP image.");
      }
      if (file.size > 8 * 1024 * 1024) throw new AdminInputError("Each image must be 8 MB or smaller.");
      const data = new Uint8Array(await file.arrayBuffer());
      const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
      const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
      const isWebp = data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46
        && data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50;
      if ((file.type === "image/jpeg" && !isJpeg) || (file.type === "image/png" && !isPng) || (file.type === "image/webp" && !isWebp)) {
        throw new AdminInputError("The selected file contents do not match their image format.");
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
      console.error("Blob upload failed", failed.reason);
      throw new AdminInputError("An image could not be uploaded. Please try again.");
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
  });
}

export async function updateAccommodationImageAlt(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", "Image ID");
    const altText = requiredText(formData, "altText", "Image description");
    await prisma.accommodationImage.update({ where: { id }, data: { altText } });
    revalidateAccommodation();
  });
}

export async function deleteAccommodationImage(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
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
  });
}

export async function moveAccommodationImage(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
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
  });
}

export async function updateAccommodationSettings(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const checkIn = String(formData.get("checkIn") ?? "").trim() || null;
    const checkOut = String(formData.get("checkOut") ?? "").trim() || null;
    if ((checkIn?.length ?? 0) > 120 || (checkOut?.length ?? 0) > 120) {
      throw new AdminInputError("Check-in and check-out information must be 120 characters or fewer.");
    }

    await prisma.accommodationSettings.upsert({
      where: { id: "default" },
      create: { id: "default", checkIn, checkOut },
      update: { checkIn, checkOut },
    });
    revalidateAccommodation();
  });
}

function readFacilityFields(formData: FormData) {
  const name = requiredText(formData, "name", "Facility name");
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  if (!slug) throw new AdminInputError("Enter a valid facility name or slug.");

  return {
    name,
    slug,
    category: requiredText(formData, "category", "Category", 80),
    description: text(formData, "description", "Description", 500),
    href: linkHref(formData),
    active: formData.get("active") === "on",
  };
}

export async function createResortFacility(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readFacilityFields(formData);
    await assertUniqueFacilitySlug(fields.slug);
    const order = ((await prisma.resortFacility.findFirst({ orderBy: { order: "desc" }, select: { order: true } }))?.order ?? -1) + 1;
    await prisma.resortFacility.create({ data: { ...fields, order } });
    revalidateAccommodation();
  });
}

export async function updateResortFacility(id: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readFacilityFields(formData);
    await assertUniqueFacilitySlug(fields.slug, id);
    await prisma.resortFacility.update({
      where: { id },
      data: fields,
    });
    revalidateAccommodation();
  });
}

export async function deleteResortFacility(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", "Facility ID");
    await prisma.resortFacility.delete({ where: { id } });
    revalidateAccommodation();
  });
}
