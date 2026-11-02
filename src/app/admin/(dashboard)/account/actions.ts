"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { AdminInputError, adminAction, requiredText, type ActionResult } from "@/lib/admin-action";
import { MIN_PASSWORD_LENGTH } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { decryptTotpSecret, encryptTotpSecret, generateTotpSecret, matchTotpStep } from "@/lib/totp";

async function currentAdmin() {
  const session = await requireAdmin();
  return prisma.admin.findUniqueOrThrow({ where: { id: session.id } });
}

/** Ends every session, including this one, so the form sends the admin back to sign in. */
export async function changePassword(formData: FormData): Promise<ActionResult> {
  return adminAction("changePassword", async () => {
    const admin = await currentAdmin();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    if (!(await bcrypt.compare(current, admin.passwordHash))) throw new AdminInputError("Your current password is incorrect.");
    if (next.length < MIN_PASSWORD_LENGTH) throw new AdminInputError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (next.length > 72) throw new AdminInputError("Use 72 characters or fewer.");
    if (next !== String(formData.get("confirm") ?? "")) throw new AdminInputError("The new passwords don't match.");

    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  });
}

/** Stores a new secret, not yet active: sign-in only asks for codes after one has been confirmed. */
export async function startTwoFactorSetup(): Promise<ActionResult> {
  return adminAction("startTwoFactorSetup", async () => {
    const admin = await currentAdmin();
    if (admin.totpEnabledAt) throw new AdminInputError("Two-factor sign-in is already on.");
    await prisma.admin.update({ where: { id: admin.id }, data: { totpSecret: encryptTotpSecret(generateTotpSecret()) } });
    revalidatePath("/admin/account");
  });
}

export async function confirmTwoFactorSetup(formData: FormData): Promise<ActionResult> {
  return adminAction("confirmTwoFactorSetup", async () => {
    const admin = await currentAdmin();
    if (!admin.totpSecret) throw new AdminInputError("Start the setup first.");
    const step = matchTotpStep(decryptTotpSecret(admin.totpSecret), requiredText(formData, "code", { label: "Code", max: 6 }));
    if (step === null) throw new AdminInputError("That code isn't right. Check your phone's clock and try again.");
    await prisma.admin.update({ where: { id: admin.id }, data: { totpEnabledAt: new Date(), totpLastStep: step } });
    revalidatePath("/admin/account");
  });
}

export async function turnOffTwoFactor(formData: FormData): Promise<ActionResult> {
  return adminAction("turnOffTwoFactor", async () => {
    const admin = await currentAdmin();
    if (!(await bcrypt.compare(String(formData.get("password") ?? ""), admin.passwordHash))) {
      throw new AdminInputError("Your password is incorrect.");
    }
    await prisma.admin.update({ where: { id: admin.id }, data: { totpSecret: null, totpEnabledAt: null, totpLastStep: null } });
    revalidatePath("/admin/account");
  });
}
