import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

/**
 * Shared plumbing for the admin dashboard's Server Actions.
 *
 * Production builds replace a thrown error's message with a generic one, so an
 * action that throws "Price must be a number" shows the admin nothing useful.
 * Actions run their body through adminAction() instead: it checks the session,
 * and turns validation failures and the common Prisma errors into
 * `{ error }` results that AdminForm shows as a toast. Successful actions are
 * written to the activity log shown on /admin/account.
 */

export type ActionResult = { error: string } | undefined;

/** A problem with what the admin entered — its message is safe to show them. */
export class AdminInputError extends Error {}

export async function adminAction(name: string, body: () => Promise<void>): Promise<ActionResult> {
  // Outside the try: an expired session redirects to the login page.
  const session = await requireAdmin();

  try {
    await body();
    await prisma.adminActivity
      .create({ data: { adminEmail: session.email, action: name } })
      .catch((error) => console.error("Admin activity could not be logged", error));
    return undefined;
  } catch (error) {
    if (error instanceof AdminInputError) return { error: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { error: "That name or URL is already in use." };
      if (error.code === "P2003") return { error: "This item is still in use, so it can't be removed." };
      if (error.code === "P2025") return { error: "This item no longer exists. Refresh the page." };
    }
    console.error("Admin action failed", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TextOptions {
  label: string;
  max?: number;
}

/** Trimmed text; empty becomes null. */
export function optionalText(formData: FormData, name: string, { label, max = 200 }: TextOptions) {
  const value = String(formData.get(name) ?? "").trim();
  if (value.length > max) throw new AdminInputError(`${label} must be ${max} characters or fewer.`);
  return value || null;
}

export function requiredText(formData: FormData, name: string, options: TextOptions) {
  const value = optionalText(formData, name, options);
  if (!value) throw new AdminInputError(`${options.label} is required.`);
  return value;
}

interface IntegerOptions {
  label: string;
  min?: number;
  max?: number;
}

/** A whole number within range; empty becomes null. */
export function optionalInteger(formData: FormData, name: string, { label, min = 0, max = 10_000_000 }: IntegerOptions) {
  const raw = String(formData.get(name) ?? "").trim();
  if (raw === "") return null;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new AdminInputError(`${label} must be a whole number between ${min.toLocaleString()} and ${max.toLocaleString()}.`);
  }
  return value;
}

export function requiredInteger(formData: FormData, name: string, options: IntegerOptions) {
  const value = optionalInteger(formData, name, options);
  if (value === null) throw new AdminInputError(`${options.label} is required.`);
  return value;
}

/** One of a fixed set of values, falling back to the first when the field is absent. */
export function oneOf<T extends string>(formData: FormData, name: string, allowed: readonly T[], label: string): T {
  const value = String(formData.get(name) ?? "").trim() || allowed[0];
  if (!(allowed as readonly string[]).includes(value)) throw new AdminInputError(`Choose a valid ${label}.`);
  return value as T;
}

/** The ids with one moved a place up or down; null when it can't move that way. */
export function reorderedIds(ids: string[], id: string, direction: string) {
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : direction === "down" ? index + 1 : -1;
  if (index < 0 || target < 0 || target >= ids.length) return null;
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** A page on this site (starting with one /) or an https address; never javascript: or other schemes. */
export function isSafeLink(value: string) {
  if (value.includes("\\")) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * An image path for next/image. Only files under /public are accepted: any other
 * host would make next/image throw while rendering and take the page down.
 */
export function optionalImagePath(formData: FormData, name: string, label: string) {
  const value = optionalText(formData, name, { label, max: 300 });
  if (value === null) return null;
  if (!/^\/[A-Za-z0-9][A-Za-z0-9/_.-]*\.(?:png|jpe?g|webp|avif|gif|svg)$/i.test(value) || value.includes("..") || value.includes("//")) {
    throw new AdminInputError(`${label} must be a site image path such as /images/massage.png.`);
  }
  return value;
}

export function requiredImagePath(formData: FormData, name: string, label: string) {
  const value = optionalImagePath(formData, name, label);
  if (!value) throw new AdminInputError(`${label} is required.`);
  return value;
}
