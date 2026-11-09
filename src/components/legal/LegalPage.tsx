import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/** Shared layout for the privacy notice and booking terms. */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  /** ISO date the text last changed, e.g. "2026-10-09". */
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const updatedLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="min-h-screen bg-[#f3efe6] text-[#0b0b0a]">
      <Navbar tone="dark" />

      <article className="mx-auto w-full max-w-3xl px-5 pb-16 pt-24 sm:px-8 sm:pt-28">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#80683c]">{eyebrow}</p>
          <h1 className="mt-2 text-[2.2rem] font-light leading-[1] tracking-[-0.05em] sm:text-[3rem]">{title}</h1>
          <p className="mt-3 text-xs text-black/55">
            Last updated <time dateTime={updated}>{updatedLabel}</time>
          </p>
          <div className="mt-5 text-[15px] leading-7 text-black/75">{intro}</div>
        </header>

        <div className="mt-10 space-y-10 text-[15px] leading-7 text-black/75 [&_a]:text-[#80683c] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-normal [&_h2]:tracking-[-0.02em] [&_h2]:text-[#0b0b0a] [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>

      <Footer />
    </main>
  );
}
