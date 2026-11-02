import { createHash } from "node:crypto";

export const MIN_PASSWORD_LENGTH = 12;

/** However actively a session is used, signing in again is required after this long. */
export const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * A short digest of the admin's password hash, stored in the session token.
 * requireAdmin() compares it with the current hash, so changing the password
 * (e.g. re-running the seed with a new SEED_ADMIN_PASSWORD) signs out every
 * existing session. The digest reveals nothing usable about the password.
 */
export function passwordFingerprint(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}
