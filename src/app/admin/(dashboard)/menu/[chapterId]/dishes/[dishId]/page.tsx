import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { AdminForm } from "@/components/admin/AdminForm";
import { updateDish } from "../../../actions";
import { DeleteDishButton } from "../../../DeleteDishButton";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-(--accent)";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50";

export default async function EditDishPage({
  params,
}: {
  params: Promise<{ chapterId: string; dishId: string }>;
}) {
  await requireAdmin();
  const { chapterId, dishId } = await params;
  const dish = await prisma.dish.findUnique({ where: { id: dishId } });

  if (!dish) notFound();

  const updateWithId = updateDish.bind(null, dish.id);

  return (
    <div>
      <Link
        href={`/admin/menu/${chapterId}`}
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black"
      >
        ← Back to chapter
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[-0.03em]">Edit dish</h1>
        <DeleteDishButton dishId={dish.id} chapterId={chapterId} name={dish.name} />
      </div>

      <AdminForm
        action={updateWithId}
        successMessage="Dish updated successfully"
        className="mt-6 max-w-xl space-y-5"
      >
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={dish.name} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={dish.description ?? undefined}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="price">Price (KSh)</label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              defaultValue={dish.price ?? undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="priceNote">Price note (e.g. &quot;Market price&quot;)</label>
            <input id="priceNote" name="priceNote" defaultValue={dish.priceNote ?? undefined} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="tags">
            Tags (comma-separated: vegetarian, vegan, spicy, signature, gluten-free, contains-nuts)
          </label>
          <input id="tags" name="tags" defaultValue={dish.tags.join(", ")} className={inputClass} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="unavailable" defaultChecked={dish.unavailable} />
          Temporarily unavailable
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-full bg-(--accent) px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
          >
            Save dish
          </button>

          <Link
            href={`/admin/menu/${chapterId}`}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black"
          >
            ← Back to chapter
          </Link>
        </div>
      </AdminForm>
    </div>
  );
}
