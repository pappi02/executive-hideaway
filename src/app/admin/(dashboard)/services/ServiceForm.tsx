import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-(--accent)";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50";

export interface ServiceFormValues {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  price: number | null;
  duration: number;
  image: string;
  imageAlt: string;
}

export function ServiceForm({
  action,
  categories,
  defaultValues,
  submitLabel,
  successMessage,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: { id: string; label: string }[];
  defaultValues?: ServiceFormValues;
  submitLabel: string;
  successMessage: string;
}) {
  return (
    <AdminForm
      action={action}
      successMessage={successMessage}
      redirectTo="/admin/services"
      className="mt-6 max-w-xl space-y-5"
    >
      <div>
        <label className={labelClass} htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={defaultValues?.categoryId}
          className={inputClass}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={defaultValues?.description}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="price">Price (KSh, blank = on request)</label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={defaultValues?.price ?? undefined}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="duration">Duration (minutes)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            required
            min={0}
            defaultValue={defaultValues?.duration}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="image">Image path</label>
        <input
          id="image"
          name="image"
          required
          placeholder="/images/services/example.webp"
          defaultValue={defaultValues?.image}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-black/40">
          Must already exist under /public/images/services — uploading new images isn&apos;t supported yet.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="imageAlt">Image alt text</label>
        <input
          id="imageAlt"
          name="imageAlt"
          required
          defaultValue={defaultValues?.imageAlt}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-(--accent) px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          {submitLabel}
        </button>

        <Link
          href="/admin/services"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black"
        >
          ← Back to list
        </Link>
      </div>
    </AdminForm>
  );
}
