import { getMenuChapters } from "@/lib/menu-data";
import { BookViewer } from "./components/BookViewer";

// Reads live from the database (admin-editable) — always render fresh
// rather than depend on build-time DB reachability or cache revalidation.
// Cached and served from the CDN; refreshed hourly, and immediately when the
// admin dashboard saves a change (revalidatePath in the admin actions).
export const revalidate = 3600;

export default async function MenuPage() {
  const chapters = await getMenuChapters();

  return <BookViewer chapters={chapters} />;
}
