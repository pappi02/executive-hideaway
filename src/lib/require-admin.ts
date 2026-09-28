import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Server Action POSTs to an /admin/* route don't reliably go through
 * proxy.ts's auth redirect (a known rough edge between next-auth v5's
 * middleware wrapper and Next.js Server Actions hitting the same matched
 * path), so every mutating action checks the session itself rather than
 * trusting middleware to have already gated it.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return session;
}
