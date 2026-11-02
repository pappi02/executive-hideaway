/**
 * A small per-instance limiter for public Server Actions. Each serverless
 * instance counts on its own, so this blunts a burst from one source rather than
 * setting an exact global limit; firewall rules at the edge are the stronger
 * layer. It keeps public actions from touching the database at all when abused.
 */

const hits = new Map<string, { count: number; resetAt: number }>();
const MAX_TRACKED = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (hits.size >= MAX_TRACKED) {
    for (const [tracked, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(tracked);
    }
    if (hits.size >= MAX_TRACKED) hits.clear();
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}
