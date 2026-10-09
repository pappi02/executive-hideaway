import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordFingerprint } from "@/lib/admin-session";
import { clearLoginFailures, clientIp, isLoginThrottled, recordLoginFailure } from "@/lib/login-throttle";
import { authConfig } from "@/auth.config";

/** Surfaces as error.code in the login action, so the page can explain the wait. */
class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

// Compared against when the email is unknown, so a missing account takes as
// long to reject as a wrong password and response times don't reveal which
// emails exist.
const DUMMY_HASH = "$2b$12$pHTi2FWimMXBgaGMvtLKSeaiKCqTO7QgVAaltXJdT5FnH/dIzqSnm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        if (email.length > 254 || password.length > 200) return null;

        const normalizedEmail = email.trim().toLowerCase();
        const ip = clientIp(request);
        if (await isLoginThrottled(normalizedEmail, ip)) throw new TooManyAttempts();

        const admin = await prisma.admin.findUnique({
          where: { email: normalizedEmail },
        });
        const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
        if (!admin || !valid) {
          await recordLoginFailure(normalizedEmail, ip);
          return null;
        }

        await clearLoginFailures(normalizedEmail);
        return { id: admin.id, email: admin.email, pwd: passwordFingerprint(admin.passwordHash) };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on sign-in; carry the fingerprint into the token.
      if (user && "pwd" in user) token.pwd = user.pwd;
      return token;
    },
  },
});
