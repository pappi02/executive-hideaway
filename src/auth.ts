import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordFingerprint } from "@/lib/admin-session";
import { clearLoginAttempts, clientIp, logLoginFailure, registerLoginAttempt } from "@/lib/login-throttle";
import { decryptTotpSecret, matchTotpStep } from "@/lib/totp";
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
        code: { label: "Authenticator code", type: "text" },
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
        if (await registerLoginAttempt(normalizedEmail, ip)) throw new TooManyAttempts();

        const admin = await prisma.admin.findUnique({
          where: { email: normalizedEmail },
        });
        const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
        if (!admin || !valid) {
          logLoginFailure(normalizedEmail, ip);
          return null;
        }

        if (admin.totpEnabledAt && admin.totpSecret) {
          const code = typeof credentials?.code === "string" ? credentials.code.trim() : "";
          const step = matchTotpStep(decryptTotpSecret(admin.totpSecret), code);
          // The conditional update means a code can only be used once, even by requests racing each other.
          const accepted = step !== null && (await prisma.admin.updateMany({
            where: { id: admin.id, OR: [{ totpLastStep: null }, { totpLastStep: { lt: step } }] },
            data: { totpLastStep: step },
          })).count === 1;
          if (!accepted) {
            logLoginFailure(normalizedEmail, ip);
            return null;
          }
        }

        await clearLoginAttempts(normalizedEmail, ip);
        return {
          id: admin.id,
          email: admin.email,
          pwd: passwordFingerprint(admin.passwordHash),
          ver: admin.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on sign-in; carry the session checks into the token.
      if (user && "pwd" in user) {
        token.pwd = user.pwd;
        token.ver = user.ver;
        token.loginAt = Date.now();
      }
      return token;
    },
  },
});
