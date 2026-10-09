import { prisma } from "@/lib/prisma";

/**
 * Slows down password guessing against the admin login. Failed attempts are
 * counted per email and per client IP over a sliding window; once either
 * passes its limit, sign-in is refused until the window clears.
 *
 * Serverless functions share no memory between invocations, so the counts
 * live in Postgres (LoginAttempt). If that table can't be reached the check
 * fails open — a database hiccup must never lock the owner out — and logs it.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_EMAIL = 5;
const MAX_FAILURES_PER_IP = 20;
const RETENTION_MS = 24 * 60 * 60 * 1000;

/** Vercel overwrites x-forwarded-for with the real client address. */
export function clientIp(request: Request | undefined) {
  const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request?.headers.get("x-real-ip") || "unknown";
}

function keys(email: string, ip: string) {
  return { emailKey: `email:${email}`, ipKey: `ip:${ip}` };
}

export async function isLoginThrottled(email: string, ip: string) {
  const { emailKey, ipKey } = keys(email, ip);
  const since = new Date(Date.now() - WINDOW_MS);
  try {
    const [emailFailures, ipFailures] = await Promise.all([
      prisma.loginAttempt.count({ where: { key: emailKey, createdAt: { gte: since } } }),
      prisma.loginAttempt.count({ where: { key: ipKey, createdAt: { gte: since } } }),
    ]);
    return emailFailures >= MAX_FAILURES_PER_EMAIL || ipFailures >= MAX_FAILURES_PER_IP;
  } catch (error) {
    console.error("login-throttle: could not read attempts; allowing sign-in", error);
    return false;
  }
}

export async function recordLoginFailure(email: string, ip: string) {
  const { emailKey, ipKey } = keys(email, ip);
  console.warn(`Admin sign-in failed for ${email} from ${ip}`);
  try {
    await prisma.$transaction([
      prisma.loginAttempt.createMany({ data: [{ key: emailKey }, { key: ipKey }] }),
      prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } } }),
    ]);
  } catch (error) {
    console.error("login-throttle: could not record failed attempt", error);
  }
}

export async function clearLoginFailures(email: string) {
  try {
    await prisma.loginAttempt.deleteMany({ where: { key: keys(email, "").emailKey } });
  } catch (error) {
    console.error("login-throttle: could not clear attempts", error);
  }
}
