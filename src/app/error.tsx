"use client";

import FeedbackPage from "@/components/feedback/FeedbackPage";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  console.error("Application error:", error);

  return (
    <FeedbackPage
      eyebrow="Something went wrong"
      title={
        <>
          Let&apos;s get
          <br />
          <span className="text-black/30">you back.</span>
        </>
      }
      description="Something interrupted your experience. Please try again, or return to the homepage and start over."
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ label: "Return home", href: "/" }}
      showHomeAction={false}
    />
  );
}
