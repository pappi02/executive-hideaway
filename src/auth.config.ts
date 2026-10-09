import type { NextAuthConfig } from "next-auth";

/**
 * Database-free part of the auth setup, shared by src/auth.ts and src/proxy.ts.
 *
 * The proxy only needs to read the JWT session cookie. Importing the full
 * config (with the Credentials provider) dragged Prisma and its engines into
 * the proxy function bundle, adding ~60 MB to every deployment's Functions
 * Storage. Keep imports here free of Prisma, bcrypt and other server-only code.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // Admin sessions last a working day (refreshed while in use) rather than
    // the 30-day default, so a stolen cookie goes stale quickly.
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
} satisfies NextAuthConfig;
