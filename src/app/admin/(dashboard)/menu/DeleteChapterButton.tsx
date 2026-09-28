"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { deleteChapter } from "./actions";

export function DeleteChapterButton({ chapterId, title }: { chapterId: string; title: string }) {
  return (
    <AdminForm
      action={deleteChapter}
      successMessage={`${title} deleted successfully`}
      redirectTo="/admin/menu"
    >
      <input type="hidden" name="id" value={chapterId} />
      <button
        type="submit"
        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
        onClick={(event) => {
          if (!confirm(`Delete "${title}"? This removes all its sections and dishes.`)) {
            event.preventDefault();
          }
        }}
      >
        Delete chapter
      </button>
    </AdminForm>
  );
}
