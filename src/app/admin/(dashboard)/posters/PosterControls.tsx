"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { PosterView } from "@/components/layout/PosterPopup";
import { deletePoster, setPosterActive } from "./actions";

const buttonClass = "text-[11px] font-semibold uppercase tracking-[0.12em]";

export function PosterPreviewButton({ title, imageUrl, linkUrl, autoCloseSeconds }: {
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  autoCloseSeconds: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass} text-black/55 hover:text-black`}>
        Preview
      </button>
      {open && <PosterView poster={{ title, imageUrl, linkUrl, autoCloseSeconds }} onClose={() => setOpen(false)} />}
    </>
  );
}

export function TogglePosterButton({ id, active }: { id: string; active: boolean }) {
  return (
    <AdminForm action={setPosterActive} successMessage={active ? "Poster paused" : "Poster resumed"}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={active ? "false" : "true"} />
      <button type="submit" className={`${buttonClass} text-black/55 hover:text-black`}>
        {active ? "Pause" : "Resume"}
      </button>
    </AdminForm>
  );
}

export function DeletePosterButton({ id, title, redirectTo }: { id: string; title: string; redirectTo?: string }) {
  return (
    <AdminForm action={deletePoster} successMessage={`${title} deleted`} redirectTo={redirectTo}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`${buttonClass} text-red-600/70 hover:text-red-600`}
        onClick={(event) => {
          if (!confirm(`Delete "${title}"? This can't be undone.`)) event.preventDefault();
        }}
      >
        Delete
      </button>
    </AdminForm>
  );
}
