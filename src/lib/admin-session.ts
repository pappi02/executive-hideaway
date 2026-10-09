import { createHash } from "node:crypto";

/**
 * A short digest of the admin's password hash, stored in the session token.
 * requireAdmin() compares it with the current hash, so changing the password
 * (e.g. re-running the seed with a new SEED_ADMIN_PASSWORD) signs out every
 * existing session. The digest reveals nothing usable about the password.
 */
export function passwordFingerprint(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}
