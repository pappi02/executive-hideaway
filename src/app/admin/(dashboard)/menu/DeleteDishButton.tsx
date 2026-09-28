"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { deleteDish } from "./actions";

export function DeleteDishButton({
  dishId,
  chapterId,
  name,
}: {
  dishId: string;
  chapterId: string;
  name: string;
}) {
  return (
    <AdminForm
      action={deleteDish}
      successMessage={`${name} deleted successfully`}
      redirectTo={`/admin/menu/${chapterId}`}
    >
      <input type="hidden" name="id" value={dishId} />
      <input type="hidden" name="chapterId" value={chapterId} />
      <button
        type="submit"
        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
        onClick={(event) => {
          if (!confirm(`Delete "${name}"? This can't be undone.`)) {
            event.preventDefault();
          }
        }}
      >
        Delete dish
      </button>
    </AdminForm>
  );
}
