import FeedbackPage from "@/components/feedback/FeedbackPage";

export default function NotFound() {
  return (
    <FeedbackPage
      eyebrow="404 · Page not found"
      title={
        <>
          A wrong
          <br />
          <span className="text-black/30">turn.</span>
        </>
      }
      description="The page you're looking for doesn't seem to be here. Let's get you back to the Executive Hideaway."
      secondaryAction={{ label: "Go back home", href: "/" }}
      showHomeAction={false}
    />
  );
}
