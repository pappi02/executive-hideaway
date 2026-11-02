"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { ActionResult } from "@/lib/admin-action";
import { AdminForm } from "./AdminForm";

const buttonClass = "inline-flex h-7 w-7 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-25";

/** Up and down buttons for a row in an ordered list. Clicks stay here, so a clickable row doesn't also open. */
export function MoveButtons({
  id,
  action,
  isFirst,
  isLast,
  label,
}: {
  id: string;
  action: (formData: FormData) => Promise<ActionResult>;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  return (
    <div className="flex shrink-0 gap-0.5" onClick={(event) => event.stopPropagation()}>
      <AdminForm action={action} successMessage="Order updated.">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" disabled={isFirst} aria-label={`Move ${label} up`} className={buttonClass}>
          <ArrowUp size={14} aria-hidden="true" />
        </button>
      </AdminForm>
      <AdminForm action={action} successMessage="Order updated.">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" disabled={isLast} aria-label={`Move ${label} down`} className={buttonClass}>
          <ArrowDown size={14} aria-hidden="true" />
        </button>
      </AdminForm>
    </div>
  );
}
