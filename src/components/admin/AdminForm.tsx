"use client";

import { useTransition, type ReactNode, type SubmitEvent } from "react";
import type { ActionResult } from "@/lib/admin-action";
import { useToast } from "./Toast";

/**
 * Runs a Server Action from a form and reports the outcome as a toast
 * (optionally redirecting on success).
 *
 * Submission goes through onSubmit rather than <form action>: React resets a
 * form after its action completes, which would wipe what the admin typed
 * whenever the action reports a validation error. Here the form is only reset
 * after a save that actually succeeded.
 *
 * The redirect itself is delegated to ToastProvider (mounted once at the
 * admin layout level) rather than scheduled here — Next.js's automatic
 * route refresh after a Server Action can unmount this form before a
 * locally-owned setTimeout fires, silently dropping the redirect.
 */
export function AdminForm({
  action,
  successMessage,
  redirectTo,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  successMessage: string;
  redirectTo?: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const { showToast, showToastAndRedirect } = useToast();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const submitter = event.nativeEvent.submitter;
    const formData = new FormData(form, submitter);

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await action(formData);
      } catch (error) {
        console.error(error);
        showToast("Something went wrong. Please try again.", "error");
        return;
      }

      if (result?.error) {
        showToast(result.error, "error");
        return;
      }

      form.reset();
      if (redirectTo) {
        showToastAndRedirect(successMessage, redirectTo);
      } else {
        showToast(successMessage);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} className={className}>
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
