/**
 * Sets an admin's password from the command line, for when the dashboard's own
 * change-password screen can't be reached. Also turns off two-factor sign-in
 * and ends every session, so it is the recovery path for a lost authenticator.
 *
 *   ADMIN_NEW_PASSWORD='...' npm run admin:reset -- owner@example.com
 *
 * Pass the password through the environment for this one run only; don't save
 * it in .env.local.
 */
import { loadEnvFile } from "node:process";
import path from "node:path";
import bcrypt from "bcryptjs";
import { MIN_PASSWORD_LENGTH } from "../src/lib/admin-session";
import { createPrismaClient } from "../src/lib/prisma";

try {
  loadEnvFile(path.resolve(import.meta.dirname, "../.env.local"));
} catch {
  // .env.local not present — fine when DATABASE_URL etc. are set another way.
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.env.ADMIN_NEW_PASSWORD;
  if (!email) throw new Error("Usage: npm run admin:reset -- <admin email>");
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Set ADMIN_NEW_PASSWORD to at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const prisma = createPrismaClient(process.env.DIRECT_URL ?? process.env.DATABASE_URL);
  await prisma.admin.update({
    where: { email },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      sessionVersion: { increment: 1 },
      totpSecret: null,
      totpEnabledAt: null,
      totpLastStep: null,
    },
  });
  await prisma.$disconnect();
  console.log(`Password reset for ${email}. Two-factor sign-in is off and all sessions have ended.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
