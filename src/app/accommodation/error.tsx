"use client";

import Link from "next/link";

export default function AccommodationError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f3efe6] px-5 text-[#0b0b0a]">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">Accommodation</p>
        <h1 className="mt-3 text-3xl font-light">We couldn’t load these details.</h1>
        <p className="mt-3 text-sm leading-6 text-black/55">Please try again or contact the resort for current accommodation information.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="min-h-11 rounded-full bg-[#0b0b0a] px-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Try again</button>
          <Link href="/contact" className="min-h-11 content-center border-b border-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.13em]">Contact us</Link>
        </div>
      </div>
    </main>
  );
}