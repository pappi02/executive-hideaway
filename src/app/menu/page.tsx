import { getMenuChapters } from "@/lib/menu-data";
import { BookViewer } from "./components/BookViewer";

// Reads live from the database (admin-editable) — always render fresh
// rather than depend on build-time DB reachability or cache revalidation.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const chapters = await getMenuChapters();

  return <BookViewer chapters={chapters} />;
}
