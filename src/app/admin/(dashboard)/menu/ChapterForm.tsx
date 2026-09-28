import Link from "next/link";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-(--accent)";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50";

export interface ChapterFormValues {
  title: string;
  eyebrow: string;
  standfirst: string | null;
  image: string | null;
  note: string | null;
  footnote: string | null;
  columns: number;
  stock: string;
}

export function ChapterForm({
  action,
  defaultValues,
  submitLabel,
  backHref,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: ChapterFormValues;
  submitLabel: string;
  backHref?: string;
}) {
  return (
    <form action={action} className="mt-6 max-w-xl space-y-5">
      <div>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={defaultValues?.title} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="eyebrow">Eyebrow (e.g. &quot;Chapter One&quot;)</label>
        <input id="eyebrow" name="eyebrow" required defaultValue={defaultValues?.eyebrow} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="standfirst">Standfirst</label>
        <input id="standfirst" name="standfirst" defaultValue={defaultValues?.standfirst ?? undefined} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="image">Divider image path</label>
        <input id="image" name="image" defaultValue={defaultValues?.image ?? undefined} placeholder="/images/menu/example.jpg" className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="note">Note</label>
        <textarea id="note" name="note" rows={2} defaultValue={defaultValues?.note ?? undefined} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="footnote">Footnote</label>
        <textarea id="footnote" name="footnote" rows={2} defaultValue={defaultValues?.footnote ?? undefined} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="columns">Columns</label>
          <select id="columns" name="columns" defaultValue={String(defaultValues?.columns ?? 1)} className={inputClass}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="stock">Page stock</label>
          <select id="stock" name="stock" defaultValue={defaultValues?.stock ?? "onyx"} className={inputClass}>
            <option value="onyx">Onyx (dark)</option>
            <option value="bone">Bone (light)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-(--accent) px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          {submitLabel}
        </button>

        {backHref && (
          <Link
            href={backHref}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black"
          >
            ← Back
          </Link>
        )}
      </div>
    </form>
  );
}
