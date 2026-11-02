import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Slows down password guessing against the admin login. Every attempt is
 * recorded before the password is checked, so parallel requests can't slip past
 * the count, and a successful sign-in clears its own record.
 *
 * Three limits share a sliding window. An email and IP together lock quickly.
 * An IP alone stops one source trying many emails. An email alone is a much
 * higher backstop against a distributed attack, set high enough that a stranger
 * who knows the address can't keep the owner locked out from elsewhere.
 *
 * Serverless functions share no memory between invocations, so the counts live
 * in Postgres (LoginAttempt), stored as hashes rather than readable addresses.
 * If that table can't be reached sign-in is refused: the admin lookup would need
 * the same database anyway.
 */

const WINDOW_MS = 15 * 60 * 1000;
const RETENTION_MS = 24 * 60 * 60 * 1000;
const LIMITS = { pair: 5, ip: 20, email: 50 } as const;

/** Vercel overwrites x-forwarded-for with the real client address. */
export function clientIp(request: Pick<Request, "headers"> | undefined) {
  const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request?.headers.get("x-real-ip") || "unknown";
}

function hashed(kind: string, value: string) {
  return `${kind}:${createHash("sha256").update(value).digest("base64url")}`;
}

export function attemptKeys(email: string, ip: string) {
  return {
    pair: hashed("pair", `${email}|${ip}`),
    ip: hashed("ip", ip),
    email: hashed("email", email),
  };
}

export function isOverLimit(counts: Record<keyof typeof LIMITS, number>) {
  return counts.pair > LIMITS.pair || counts.ip > LIMITS.ip || counts.email > LIMITS.email;
}

/** Records this attempt and reports whether it should be refused without checking the password. */
export async function registerLoginAttempt(email: string, ip: string) {
  const keys = attemptKeys(email, ip);
  const since = new Date(Date.now() - WINDOW_MS);
  try {
    await prisma.$transaction([
      prisma.loginAttempt.createMany({ data: Object.values(keys).map((key) => ({ key })) }),
      prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } } }),
    ]);
    const [pair, ipCount, emailCount] = await Promise.all(
      [keys.pair, keys.ip, keys.email].map((key) =>
        prisma.loginAttempt.count({ where: { key, createdAt: { gte: since } } }),
      ),
    );
    return isOverLimit({ pair, ip: ipCount, email: emailCount });
  } catch (error) {
    console.error("login-throttle: could not record the attempt; refusing sign-in", error);
    return true;
  }
}

export function logLoginFailure(email: string, ip: string) {
  console.warn(`Admin sign-in failed for ${email} from ${ip}`);
}

export async function clearLoginAttempts(email: string, ip: string) {
  const keys = attemptKeys(email, ip);
  try {
    await prisma.loginAttempt.deleteMany({ where: { key: { in: [keys.pair, keys.email] } } });
  } catch (error) {
    console.error("login-throttle: could not clear attempts", error);
  }
}
