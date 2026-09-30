"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { deleteAccommodation } from "./actions";

export function DeleteAccommodationButton({ id, name }: { id: string; name: string }) {
  return (
    <AdminForm
      action={deleteAccommodation}
      successMessage={`${name} deleted.`}
      redirectTo="/admin/accommodation"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="min-h-10 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700/75 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        onClick={(event) => {
          if (!confirm(`Delete "${name}" and its room images? This can't be undone.`)) {
            event.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </AdminForm>
  );
}