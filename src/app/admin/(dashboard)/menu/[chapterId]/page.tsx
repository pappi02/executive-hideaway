import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { AdminForm } from "@/components/admin/AdminForm";
import { MoveButtons } from "@/components/admin/MoveButtons";
import {
  createChapter,
  createDish,
  createSection,
  deleteDish,
  deleteSection,
  moveDish,
  moveSection,
  updateChapter,
  updateSection,
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
  await requireAdmin();
  const { chapterId } = await params;

  if (chapterId === "new") {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-[-0.03em]">New chapter</h1>
        <ChapterForm
          action={createChapter}
          submitLabel="Create chapter"
          backHref="/admin/menu"
          successMessage="Chapter created successfully"
          redirectTo="/admin/menu"
        />
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

        <DeleteChapterButton chapterId={chapter.id} title={chapter.title} />
      </div>

      <ChapterForm
        action={updateWithId}
        defaultValues={chapter}
        submitLabel="Save chapter"
        successMessage="Chapter updated successfully"
      />

      <hr className="my-10 border-black/10" />

      <h2 className="text-lg font-medium">Sections & dishes</h2>

      <div className="mt-4 space-y-8">
        {chapter.sections.map((section, sectionIndex) => (
          <div key={section.id} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <MoveButtons
                  id={section.id}
                  action={moveSection}
                  isFirst={sectionIndex === 0}
                  isLast={sectionIndex === chapter.sections.length - 1}
                  label={section.title}
                />
                <AdminForm action={updateSection} successMessage="Section saved." className="flex min-w-0 flex-1 flex-wrap items-center gap-2 pr-3">
                  <input type="hidden" name="id" value={section.id} />
                  <input name="title" required maxLength={120} defaultValue={section.title} aria-label="Section title" className={`${inputClass} min-w-40 flex-1 font-medium`} />
                  <input name="note" maxLength={300} defaultValue={section.note ?? ""} placeholder="Note (optional)" aria-label="Section note" className={`${inputClass} min-w-40 flex-1`} />
                  <button type="submit" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/60 hover:text-black">Save</button>
                </AdminForm>
              </div>

              <AdminForm action={deleteSection} successMessage="Section removed successfully">
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="chapterId" value={chapter.id} />
                <button
                  type="submit"
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
                >
                  Delete section
                </button>
              </AdminForm>
            </div>

            <table className="mt-4 w-full text-left text-sm">
              <tbody>
                {section.dishes.map((dish, dishIndex) => (
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
                      <div className="flex items-center justify-end gap-3">
                        <MoveButtons
                          id={dish.id}
                          action={moveDish}
                          isFirst={dishIndex === 0}
                          isLast={dishIndex === section.dishes.length - 1}
                          label={dish.name}
                        />
                        <Link
                          href={`/admin/menu/${chapter.id}/dishes/${dish.id}`}
                          className="text-[10px] font-semibold uppercase tracking-[0.1em] text-black/55 hover:text-black"
                        >
                          Edit
                        </Link>

                        <AdminForm action={deleteDish} successMessage={`${dish.name} removed successfully`}>
                          <input type="hidden" name="id" value={dish.id} />
                          <input type="hidden" name="chapterId" value={chapter.id} />
                          <button
                            type="submit"
                            className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red-600/70 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </AdminForm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AdminForm
              action={createDish}
              successMessage="Dish added successfully"
              className="mt-4 flex flex-wrap items-end gap-2 border-t border-black/10 pt-4"
            >
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
            </AdminForm>
          </div>
        ))}
      </div>

      <AdminForm
        action={createSection}
        successMessage="Section added successfully"
        className="mt-6 flex items-end gap-2"
      >
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
      </AdminForm>
    </div>
  );
}
