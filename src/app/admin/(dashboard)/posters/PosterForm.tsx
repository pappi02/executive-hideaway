"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import type { ActionResult } from "@/lib/admin-action";
import { endOfSunday, toNairobiInput } from "@/lib/poster-time";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-(--accent)";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50";
const presetClass =
  "rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/60 transition-colors hover:border-(--accent) hover:text-black";

const HOUR_MS = 60 * 60 * 1000;

export interface PosterFormValues {
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  startsAt: string;
  endsAt: string;
  delaySeconds: number;
  autoCloseSeconds: number;
  priority: number;
  active: boolean;
}

export function PosterForm({
  action,
  defaultValues,
  submitLabel,
  successMessage,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues?: PosterFormValues;
  submitLabel: string;
  successMessage: string;
}) {
  const isNew = !defaultValues;
  const [startsAt, setStartsAt] = useState(() => defaultValues?.startsAt ?? toNairobiInput(new Date()));
  const [endsAt, setEndsAt] = useState(() => defaultValues?.endsAt ?? toNairobiInput(endOfSunday()));

  const endIn = (ms: number) => setEndsAt(toNairobiInput(new Date(Date.now() + ms)));

  return (
    <AdminForm action={action} successMessage={successMessage} redirectTo="/admin/posters" className="mt-6 max-w-xl space-y-5">
      <div>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required maxLength={120} defaultValue={defaultValues?.title} className={inputClass} />
        <p className="mt-1 text-xs text-black/40">Read out by screen readers and shown in this list.</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="image">{isNew ? "Poster image" : "Replace image (optional)"}</label>
        {defaultValues?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of any stored image
          <img src={defaultValues.imageUrl} alt="" className="mt-2 h-40 w-auto rounded-lg border border-black/10" />
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={isNew}
          className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-black/5 file:px-3 file:py-1 file:text-xs`}
        />
        <p className="mt-1 text-xs text-black/40">JPEG, PNG or WebP, up to 4 MB. A portrait poster works best.</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="linkUrl">Link when tapped (optional)</label>
        <input
          id="linkUrl"
          name="linkUrl"
          placeholder="/services, https://... or tel:+254719506995"
          defaultValue={defaultValues?.linkUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="startsAt">Starts (Nairobi time)</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="endsAt">Ends (Nairobi time)</label>
          <input id="endsAt" name="endsAt" type="datetime-local" required value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={presetClass} onClick={() => setEndsAt(toNairobiInput(endOfSunday()))}>Until Sunday midnight</button>
        <button type="button" className={presetClass} onClick={() => endIn(24 * HOUR_MS)}>24 hours</button>
        <button type="button" className={presetClass} onClick={() => endIn(3 * 24 * HOUR_MS)}>3 days</button>
        <button type="button" className={presetClass} onClick={() => endIn(7 * 24 * HOUR_MS)}>1 week</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="delaySeconds">Delay (sec)</label>
          <input id="delaySeconds" name="delaySeconds" type="number" required min={0} max={300} defaultValue={defaultValues?.delaySeconds ?? 10} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="autoCloseSeconds">Auto-close (sec)</label>
          <input id="autoCloseSeconds" name="autoCloseSeconds" type="number" required min={0} max={300} defaultValue={defaultValues?.autoCloseSeconds ?? 6} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="priority">Priority</label>
          <input id="priority" name="priority" type="number" required min={-100} max={100} defaultValue={defaultValues?.priority ?? 0} className={inputClass} />
        </div>
      </div>
      <p className="-mt-3 text-xs text-black/40">
        Delay: seconds after a visitor arrives. Auto-close: 0 keeps it up until they close it. When several posters run at once, the highest priority shows.
      </p>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaultValues?.active ?? true} className="h-4 w-4 accent-(--accent)" />
        Active (untick to pause)
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-(--accent) px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          {submitLabel}
        </button>
        <Link href="/admin/posters" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black">
          ← Back to list
        </Link>
      </div>
    </AdminForm>
  );
}
