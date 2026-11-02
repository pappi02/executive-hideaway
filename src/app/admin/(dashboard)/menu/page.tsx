import Link from "next/link";
import { MoveButtons } from "@/components/admin/MoveButtons";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { moveChapter } from "./actions";

export default async function AdminMenuPage() {
  await requireAdmin();
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      sections: { include: { _count: { select: { dishes: true } } } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[-0.03em]">Menu chapters</h1>

        <Link
          href="/admin/menu/new"
          className="rounded-full bg-(--accent) px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          New chapter
        </Link>
      </div>

      <p className="mt-3 text-sm text-black/50">
        Draft chapters are hidden from guests.{" "}
        <a href="/menu/preview" target="_blank" className="underline hover:text-black">
          Preview the menu with drafts
        </a>
      </p>

      <div className="mt-6 grid gap-3">
        {chapters.map((chapter, index) => {
          const dishCount = chapter.sections.reduce(
            (sum, section) => sum + section._count.dishes,
            0,
          );

          return (
            <div key={chapter.id} className="flex items-center gap-2">
              <MoveButtons id={chapter.id} action={moveChapter} isFirst={index === 0} isLast={index === chapters.length - 1} label={chapter.title} />
              <Link
                href={`/admin/menu/${chapter.id}`}
                className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4 transition-colors hover:border-(--accent)"
              >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                  {chapter.eyebrow}
                </p>
                <p className="mt-0.5 font-medium">
                  {chapter.title}
                  {!chapter.published && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800">
                      Draft
                    </span>
                  )}
                </p>
              </div>

              <p className="text-xs text-black/45">
                {chapter.sections.length} sections · {dishCount} dishes
              </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
