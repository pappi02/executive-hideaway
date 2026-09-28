"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "./Toast";

/**
 * Shows a success toast (and optionally redirects) after a Server Action
 * form finishes submitting. Deliberately does NOT change how the form
 * submits — the <form action={action}> below is the exact plain pattern
 * already proven reliable everywhere else in this app. This component only
 * *observes* completion via useFormStatus() in a child, which is a passive
 * companion hook and doesn't touch the submission itself.
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
  action: (formData: FormData) => Promise<void>;
  successMessage: string;
  redirectTo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      {children}
      <SubmitWatcher successMessage={successMessage} redirectTo={redirectTo} />
    </form>
  );
}

function SubmitWatcher({
  successMessage,
  redirectTo,
}: {
  successMessage: string;
  redirectTo?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);
  const { showToast, showToastAndRedirect } = useToast();

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (redirectTo) {
        showToastAndRedirect(successMessage, redirectTo);
      } else {
        showToast(successMessage);
      }
    }
    wasPending.current = pending;
  }, [pending, successMessage, redirectTo, showToast, showToastAndRedirect]);

  return null;
}
