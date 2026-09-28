"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { deleteService } from "./actions";

export function DeleteServiceButton({ id, name }: { id: string; name: string }) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <AdminForm
        action={deleteService}
        successMessage={`${name} deleted successfully`}
        redirectTo="/admin/services"
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
          onClick={(event) => {
            if (!confirm(`Delete "${name}"? This can't be undone.`)) {
              event.preventDefault();
            }
          }}
        >
          Delete service
        </button>
      </AdminForm>
    </div>
  );
}
