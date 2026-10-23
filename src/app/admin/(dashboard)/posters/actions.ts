"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  AdminInputError,
  adminAction,
  oneOf,
  optionalText,
  requiredInteger,
  requiredText,
  type ActionResult,
} from "@/lib/admin-action";
import { deletePosterBlob, readPosterImage, storePosterImage } from "@/lib/poster-images";
import { POSTER_KINDS, POSTER_SECONDS_MAX } from "@/lib/posters";
import { fromNairobiInput } from "@/lib/poster-time";

/** The booking button's link: a page on this site, an https:// address, or tel:. */
function linkUrl(formData: FormData) {
  const value = optionalText(formData, "linkUrl", { label: "Link", max: 500 });
  if (value === null) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^tel:\+?[\d\s-]{6,20}$/.test(value)) return value;
  try {
    if (new URL(value).protocol === "https:") return value;
  } catch {}
  throw new AdminInputError("The link must start with / (a page on this site), https:// or tel:+254...");
}

function nairobiTime(formData: FormData, name: string, label: string) {
  const value = fromNairobiInput(String(formData.get(name) ?? "").trim());
  if (!value) throw new AdminInputError(`Choose the ${label} date and time.`);
  return value;
}

/** "What's included": one item per line. */
function highlights(formData: FormData) {
  const items = String(formData.get("highlights") ?? "")
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
  if (items.length > 12) throw new AdminInputError("List up to 12 things that are included.");
  if (items.some((item) => item.length > 120)) throw new AdminInputError("Keep each included item to 120 characters.");
  return items;
}

function readPosterFields(formData: FormData) {
  const startsAt = nairobiTime(formData, "startsAt", "start");
  const endsAt = nairobiTime(formData, "endsAt", "end");
  if (endsAt <= startsAt) throw new AdminInputError("The end must be after the start.");
  return {
    title: requiredText(formData, "title", { label: "Title", max: 120 }),
    linkUrl: linkUrl(formData),
    startsAt,
    endsAt,
    delaySeconds: requiredInteger(formData, "delaySeconds", { label: "Delay", max: POSTER_SECONDS_MAX }),
    autoCloseSeconds: requiredInteger(formData, "autoCloseSeconds", { label: "Auto-close", max: POSTER_SECONDS_MAX }),
    priority: requiredInteger(formData, "priority", { label: "Priority", min: -100, max: 100 }),
    active: formData.get("active") === "on",
    kind: oneOf(formData, "kind", POSTER_KINDS, "poster type"),
    summary: optionalText(formData, "summary", { label: "Summary", max: 300 }),
    highlights: highlights(formData),
    details: optionalText(formData, "details", { label: "Description", max: 4000 }),
    priceText: optionalText(formData, "priceText", { label: "Price", max: 80 }),
    location: optionalText(formData, "location", { label: "Location", max: 160 }),
    ctaLabel: optionalText(formData, "ctaLabel", { label: "Button label", max: 40 }),
    terms: optionalText(formData, "terms", { label: "Terms", max: 1000 }),
  };
}

function revalidatePosters() {
  revalidatePath("/admin/posters");
  // The offer sections at the top of the services page.
  revalidatePath("/services");
}

export async function createPoster(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readPosterFields(formData);
    const upload = await readPosterImage(formData);
    if (!upload) throw new AdminInputError("Choose the poster image.");
    const image = await storePosterImage(upload);
    try {
      await prisma.poster.create({ data: { ...fields, ...image } });
    } catch (error) {
      await deletePosterBlob(image.imageUrl);
      throw error;
    }
    revalidatePosters();
  });
}

export async function updatePoster(id: string, formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const fields = readPosterFields(formData);
    const previous = await prisma.poster.findUnique({ where: { id }, select: { imageUrl: true } });
    if (!previous) throw new AdminInputError("This poster no longer exists. Refresh the page.");

    const upload = await readPosterImage(formData);
    const image = upload ? await storePosterImage(upload) : null;
    try {
      await prisma.poster.update({ where: { id }, data: { ...fields, ...image } });
    } catch (error) {
      await deletePosterBlob(image?.imageUrl);
      throw error;
    }
    if (image) await deletePosterBlob(previous.imageUrl);
    revalidatePosters();
  });
}

export async function setPosterActive(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Poster ID" });
    await prisma.poster.update({ where: { id }, data: { active: formData.get("active") === "true" } });
    revalidatePosters();
  });
}

export async function deletePoster(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const id = requiredText(formData, "id", { label: "Poster ID" });
    const deleted = await prisma.poster.delete({ where: { id }, select: { imageUrl: true } });
    await deletePosterBlob(deleted.imageUrl);
    revalidatePosters();
  });
}
