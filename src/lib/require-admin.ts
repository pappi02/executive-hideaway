// TEMPORARY DIAGNOSTIC: no-op to isolate whether auth is even the blocker.
export async function requireAdmin() {
  return { diagnostic: true };
}
