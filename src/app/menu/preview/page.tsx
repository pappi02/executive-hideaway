import type { Metadata } from "next";
import { getMenuChapters } from "@/lib/menu-data";
import { requireAdmin } from "@/lib/require-admin";
import { BookViewer } from "../components/BookViewer";

export const metadata: Metadata = {
  title: "Menu preview",
  robots: { index: false, follow: false },
};

/**
 * The menu as guests would see it if every draft chapter were published.
 * Admin-only and rendered per request, so drafts never reach the CDN cache
 * that serves /menu.
 */
export default async function MenuPreviewPage() {
  await requireAdmin();
  const chapters = await getMenuChapters({ includeDrafts: true });

  // Mark drafts on every page they occupy, so a screenshot can't be mistaken
  // for the published menu.
  const marked = chapters.map((chapter) =>
    chapter.published === false ? { ...chapter, eyebrow: `Draft · ${chapter.eyebrow}` } : chapter,
  );

  return (
    <>
      <BookViewer chapters={marked} />
      <p
        role="status"
        className="pointer-events-none fixed left-1/2 top-1.5 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-200/90 px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-950"
      >
        Draft preview
      </p>
    </>
  );
}
