
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[75svh] overflow-hidden bg-[#0b0b0a] sm:min-h-[80svh] lg:min-h-[85svh]"
    >
      {/* Background Image */}
      <Image
        src="/images/hero.png"
        alt="Executive Hideaway Resort & Spa"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Image treatment */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/10 to-[#0b0b0a]" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[75svh] flex-col justify-end px-5 pb-9 pt-32 sm:min-h-[80svh] sm:px-8 sm:pb-14 lg:min-h-[85svh] lg:px-10 lg:pb-16">
        <div className="mx-auto w-full max-w-7xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-(--accent)" />

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-(--accent-light)">
              Resort &middot; Spa &middot; Wellness &middot; Stays
            </p>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-[clamp(3.25rem,14vw,8rem)] font-light leading-[0.88] tracking-[-0.055em] text-white">
            Where time slows
            <br />
            <span className="text-white/80">and stays awhile.</span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-md text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
            A thoughtful place to stay, unwind, enjoy resort dining, and find
            time for wellness and grooming.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-(--accent) px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
            >
              Book an Appointment

              <ArrowDownRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </Link>

            <Link
              href="/menu"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              View Resort Menu
            </Link>

            <Link
              href="#about"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="absolute bottom-6 left-5 right-5 z-10 hidden items-end justify-between sm:flex lg:left-10 lg:right-10">
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
          Executive Hideaway
        </p>

        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
            Scroll to explore
          </span>

          <span className="h-px w-10 bg-white/25" />
        </div>
      </div>
    </section>
  );
}

