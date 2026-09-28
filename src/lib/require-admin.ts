import { cookies } from "next/headers";
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
 *
 * Reads and decodes the session cookie directly rather than going through
 * auth() or getToken() — both of those returned null inside a Server
 * Action even with a genuinely valid session cookie present, for reasons
 * that didn't reproduce outside this exact call site. Decoding the raw
 * cookie ourselves removes every layer of guessing about cookie naming
 * or rotation side effects.
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map((c) => c.name);
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  let token = null;
  let decodeError: unknown = null;
  if (raw && process.env.AUTH_SECRET) {
    try {
      token = await decode({ token: raw, secret: process.env.AUTH_SECRET, salt: COOKIE_NAME });
    } catch (error) {
      decodeError = error;
    }
  }

  if (!token) {
    throw new Error(
      `requireAdmin diagnostic: cookies=${JSON.stringify(allCookies)} foundTarget=${!!raw} hasSecret=${!!process.env.AUTH_SECRET} decodeError=${decodeError instanceof Error ? decodeError.message : String(decodeError)}`,
    );
  }
  return token;
}
