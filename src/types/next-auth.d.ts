import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** Password-hash fingerprint; see src/lib/admin-session.ts. */
    pwd?: string;
    /** Admin.sessionVersion at sign-in; see src/lib/require-admin.ts. */
    ver?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    pwd?: string;
    ver?: number;
    loginAt?: number;
  }
}
