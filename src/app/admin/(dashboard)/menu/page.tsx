import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminMenuPage() {
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

      <div className="mt-6 grid gap-3">
        {chapters.map((chapter) => {
          const dishCount = chapter.sections.reduce(
            (sum, section) => sum + section._count.dishes,
            0,
          );

          return (
            <Link
              key={chapter.id}
              href={`/admin/menu/${chapter.id}`}
              className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4 transition-colors hover:border-(--accent)"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                  {chapter.eyebrow}
                </p>
                <p className="mt-0.5 font-medium">{chapter.title}</p>
              </div>

              <p className="text-xs text-black/45">
                {chapter.sections.length} sections · {dishCount} dishes
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
