import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createChapter,
  createDish,
  createSection,
  deleteDish,
  deleteSection,
  updateChapter,
} from "../actions";
import { ChapterForm } from "../ChapterForm";
import { DeleteChapterButton } from "../DeleteChapterButton";

const inputClass =
  "rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-(--accent)";

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  if (chapterId === "new") {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-[-0.03em]">New chapter</h1>
        <ChapterForm action={createChapter} submitLabel="Create chapter" backHref="/admin/menu" />
      </div>
    );
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { dishes: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!chapter) notFound();

  const updateWithId = updateChapter.bind(null, chapterId);

  return (
    <div>
      <Link href="/admin/menu" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black">
        ← All chapters
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[-0.03em]">{chapter.title}</h1>

        <DeleteChapterButton chapterId={chapter.id} />
      </div>

      <ChapterForm action={updateWithId} defaultValues={chapter} submitLabel="Save chapter" />

      <hr className="my-10 border-black/10" />

      <h2 className="text-lg font-medium">Sections & dishes</h2>

      <div className="mt-4 space-y-8">
        {chapter.sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">{section.title}</p>

              <form action={deleteSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="chapterId" value={chapter.id} />
                <button
                  type="submit"
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
                >
                  Delete section
                </button>
              </form>
            </div>

            <table className="mt-4 w-full text-left text-sm">
              <tbody>
                {section.dishes.map((dish) => (
                  <tr key={dish.id} className="border-t border-black/5">
                    <td className="py-2 pr-3">
                      {dish.name}
                      {dish.unavailable && (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-red-600/70">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-black/50">
                      {dish.price !== null ? `KSh ${dish.price.toLocaleString()}` : dish.priceNote ?? "—"}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/menu/${chapter.id}/dishes/${dish.id}`}
                          className="text-[10px] font-semibold uppercase tracking-[0.1em] text-black/55 hover:text-black"
                        >
                          Edit
                        </Link>

                        <form action={deleteDish}>
                          <input type="hidden" name="id" value={dish.id} />
                          <input type="hidden" name="chapterId" value={chapter.id} />
                          <button
                            type="submit"
                            className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red-600/70 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <form action={createDish} className="mt-4 flex flex-wrap items-end gap-2 border-t border-black/10 pt-4">
              <input type="hidden" name="chapterId" value={chapter.id} />
              <input type="hidden" name="sectionId" value={section.id} />

              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">Name</label>
                <input name="name" required className={inputClass} />
              </div>

              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">Price</label>
                <input name="price" type="number" min={0} className={`${inputClass} w-24`} />
              </div>

              <div className="min-w-48 flex-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">Description</label>
                <input name="description" className={inputClass} />
              </div>

              <button
                type="submit"
                className="rounded-full bg-black/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/70 transition-colors hover:bg-(--accent) hover:text-[#0b0b0a]"
              >
                Add dish
              </button>
            </form>
          </div>
        ))}
      </div>

      <form action={createSection} className="mt-6 flex items-end gap-2">
        <input type="hidden" name="chapterId" value={chapter.id} />

        <div>
          <label className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">New section title</label>
          <input name="title" required className={inputClass} />
        </div>

        <button
          type="submit"
          className="rounded-full bg-black/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/70 transition-colors hover:bg-(--accent) hover:text-[#0b0b0a]"
        >
          Add section
        </button>
      </form>
    </div>
  );
}
