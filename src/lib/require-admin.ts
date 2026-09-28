import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "next-auth/jwt";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

/**
 * Server Action POSTs to an /admin/* route don't reliably go through
 * proxy.ts's auth redirect (a known rough edge between next-auth v5's
 * middleware wrapper and Next.js Server Actions hitting the same matched
 * path), so every mutating action checks the session itself rather than
 * trusting middleware to have already gated it.
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  const token =
    raw && process.env.AUTH_SECRET
      ? await decode({ token: raw, secret: process.env.AUTH_SECRET, salt: COOKIE_NAME })
      : null;

  if (!token) redirect("/admin/login");
  return token;
}
