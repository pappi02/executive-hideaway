import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** Password-hash fingerprint; see src/lib/admin-session.ts. */
    pwd?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    pwd?: string;
  }
}
