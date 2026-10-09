import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";

type FeedbackPageProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  showHomeAction?: boolean;
};

export default function FeedbackPage({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  showHomeAction = true,
}: FeedbackPageProps) {
  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[#f3efe6] text-[#0b0b0a]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-120 w-120 rounded-full border border-black/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-black/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 -left-48 h-96 w-96 rounded-full border border-black/5" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between py-7 sm:py-9">
          <Link href="/" className="block shrink-0" aria-label="Executive Hideaway home">
            <Image
              src="/images/eh-logo.png"
              alt="Executive Hideaway Spa and Resort"
              width={960}
              height={600}
              priority
              sizes="(min-width: 640px) 102px, 90px"
              className="h-14 w-auto sm:h-16"
            />
          </Link>
          <span className="text-[8px] uppercase tracking-[0.25em] text-black/25">Barber · Spa · Wellness</span>
        </div>

        <div className="flex flex-1 items-center py-16 sm:py-20">
          <div className="w-full max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#80683c]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">{eyebrow}</p>
            </div>

            <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,13vw,8rem)] font-light leading-[0.88] tracking-[-0.06em]">{title}</h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-black/50 sm:text-base sm:leading-8">{description}</p>

            {(primaryAction || secondaryAction || showHomeAction) && (
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryAction?.href && (
                  <Link href={primaryAction.href} className="group inline-flex min-h-13 items-center justify-center gap-4 rounded-full bg-[#0b0b0a] px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5f1e8] transition-all duration-300 hover:bg-[#80683c]">
                    {primaryAction.label}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight size={14} strokeWidth={1.5} /></span>
                  </Link>
                )}

                {primaryAction?.onClick && (
                  <button type="button" onClick={primaryAction.onClick} className="group inline-flex min-h-13 items-center justify-center gap-4 rounded-full bg-[#0b0b0a] px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5f1e8] transition-all duration-300 hover:bg-[#80683c]">
                    {primaryAction.label}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-[-20deg]"><RotateCcw size={14} strokeWidth={1.5} /></span>
                  </button>
                )}

                {secondaryAction && (
                  <Link href={secondaryAction.href} className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-black/10 px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/65 transition-all duration-300 hover:border-black/20 hover:bg-black/5 hover:text-black">
                    <ArrowLeft size={14} strokeWidth={1.4} />
                    {secondaryAction.label}
                  </Link>
                )}

                {showHomeAction && !secondaryAction && (
                  <Link href="/" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-black/10 px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/65 transition-all duration-300 hover:border-black/20 hover:bg-black/5 hover:text-black">
                    <ArrowLeft size={14} strokeWidth={1.4} />
                    Return home
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] uppercase tracking-[0.2em] text-black/25">Executive Hideaway Resort &amp; Spa</p>
          <p className="text-[8px] uppercase tracking-[0.2em] text-black/20">Nairobi, Kenya</p>
        </div>
      </div>
    </main>
  );
}
