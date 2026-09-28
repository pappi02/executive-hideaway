"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "./Toast";

/**
 * Shows a success toast (and optionally redirects) after a Server Action
 * form finishes submitting. Deliberately does NOT change how the form
 * submits — the <form action={action}> below is the exact plain pattern
 * already proven reliable everywhere else in this app. This component only
 * *observes* completion via useFormStatus() in a child, which is a passive
 * companion hook and doesn't touch the submission itself. An earlier attempt
 * routed submission through useActionState's dispatcher instead, and that
 * silently broke the action from executing at all.
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
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (wasPending.current && !pending) {
      showToast(successMessage);
      if (redirectTo) {
        const timer = setTimeout(() => router.push(redirectTo), 900);
        wasPending.current = pending;
        return () => clearTimeout(timer);
      }
      router.refresh();
    }
    wasPending.current = pending;
  }, [pending, successMessage, redirectTo, router, showToast]);

  return null;
}
