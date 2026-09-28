import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "next-auth/jwt";

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
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const raw =
    cookieStore.get("__Secure-authjs.session-token")?.value ??
    cookieStore.get("authjs.session-token")?.value;
  const cookieName = cookieStore.get("__Secure-authjs.session-token")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token =
    raw && process.env.AUTH_SECRET
      ? await decode({ token: raw, secret: process.env.AUTH_SECRET, salt: cookieName })
      : null;

  if (!token) redirect("/admin/login");
  return token;
}
