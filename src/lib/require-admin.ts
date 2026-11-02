import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { MAX_SESSION_AGE_MS, passwordFingerprint } from "@/lib/admin-session";

/**
 * Server Action POSTs to an /admin/* route don't reliably go through
 * proxy.ts's auth redirect (a known rough edge between next-auth v5's
 * middleware wrapper and Next.js Server Actions hitting the same matched
 * path), so every mutating action checks the session itself rather than
 * trusting middleware to have already gated it.
 *
 * NextAuth names the session cookie __Secure-authjs.session-token over
 * HTTPS and authjs.session-token over plain HTTP — based on the actual
 * connection, not NODE_ENV. Checking both directly (rather than guessing
 * from NODE_ENV) keeps this correct in every environment: local dev,
 * `next start` over plain HTTP, and HTTPS production.
 *
 * Beyond the token's signature and expiry, the admin must still exist, their
 * password must not have changed, they must not have signed out since, and the
 * sign-in must be under a day old however actively the session has been used —
 * so a deleted admin, a password reset or a sign-out ends sessions immediately.
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const raw =
    cookieStore.get("__Secure-authjs.session-token")?.value ??
    cookieStore.get("authjs.session-token")?.value;
  const cookieName = cookieStore.get("__Secure-authjs.session-token")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token =
    raw && process.env.AUTH_SECRET
      ? await decode({ token: raw, secret: process.env.AUTH_SECRET, salt: cookieName }).catch(() => null)
      : null;

  const admin = token?.sub
    ? await prisma.admin.findUnique({
        where: { id: token.sub },
        select: { email: true, passwordHash: true, sessionVersion: true },
      })
    : null;
  if (
    !token ||
    !admin ||
    token.pwd !== passwordFingerprint(admin.passwordHash) ||
    token.ver !== admin.sessionVersion ||
    typeof token.loginAt !== "number" ||
    Date.now() - token.loginAt > MAX_SESSION_AGE_MS
  ) {
    return null;
  }
  return { id: token.sub as string, email: admin.email };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
