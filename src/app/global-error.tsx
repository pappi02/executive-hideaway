"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error("Global application error:", error);

  return (
    <html lang="en">
      <body className="m-0 bg-[#f3efe6] text-[#0b0b0a]">
        <main className="relative flex min-h-svh overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-120 w-120 rounded-full border border-black/5" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-black/5" />
          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
            <div className="flex items-center py-7 sm:py-9">
              <Link href="/" className="block shrink-0" aria-label="Executive Hideaway home">
                <Image src="/images/hideaway-lockup.svg" alt="Executive Hideaway Spa and Resort" width={341} height={100} priority className="h-11 w-auto sm:h-12" />
              </Link>
            </div>
            <div className="flex flex-1 items-center py-16">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#80683c]" /><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">System error</p></div>
                <h1 className="mt-7 text-[clamp(3.5rem,13vw,8rem)] font-light leading-[0.88] tracking-[-0.06em]">Something<br /><span className="text-black/30">went wrong.</span></h1>
                <p className="mt-8 max-w-xl text-sm leading-7 text-black/50 sm:text-base sm:leading-8">We couldn&apos;t load the Executive Hideaway experience properly. Please try again.</p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={reset} className="group inline-flex min-h-13 items-center justify-center gap-4 rounded-full bg-[#0b0b0a] px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5f1e8] transition-all duration-300 hover:bg-[#80683c]">Try again<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-[-20deg]"><RotateCcw size={14} strokeWidth={1.5} /></span></button>
                  <Link href="/" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-black/10 px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/65 transition-all duration-300 hover:border-black/20 hover:bg-black/5 hover:text-black"><ArrowLeft size={14} strokeWidth={1.4} />Return home</Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-black/10 py-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] uppercase tracking-[0.2em] text-black/25">Executive Hideaway Resort &amp; Spa</p><p className="text-[11px] uppercase tracking-[0.2em] text-black/20">Nairobi, Kenya</p></div>
          </div>
        </main>
      </body>
    </html>
  );
}
