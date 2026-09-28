import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";

/**
 * Server Action POSTs to an /admin/* route don't reliably go through
 * proxy.ts's auth redirect (a known rough edge between next-auth v5's
 * middleware wrapper and Next.js Server Actions hitting the same matched
 * path), so every mutating action checks the session itself rather than
 * trusting middleware to have already gated it.
 *
 * Uses getToken() (a plain read of the JWT cookie) instead of auth() —
 * auth()'s higher-level wrapper rotates the session cookie as a side
 * effect, and calling it from inside a Server Action produced a second,
 * conflicting Set-Cookie that cleared the session on the very request
 * that was supposed to prove it. getToken() has no such side effect.
 */
export async function requireAdmin() {
  const token = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) redirect("/admin/login");
  return token;
}
