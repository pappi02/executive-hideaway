
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

const HERO_SRC = "/images/hero-hideaway-experience.jpg";
const HERO_ALT = "A guest enjoying a massage in a candlelit suite, with dinner and drinks, a bed, and chess and table tennis nearby";

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-[#0b0b0a] pt-17 sm:pt-20 lg:pt-22"
    >
      {/* The image starts below the fixed navbar so the logo never sits on it.
          The photo is landscape (16:9) and fills the section at every width. Narrow
          screens crop in on the massage, on the left of the photo. */}
      <div className="relative flex min-h-[72svh] flex-col overflow-hidden sm:min-h-[64svh] lg:min-h-[80svh]">
        <Image
          src={HERO_SRC}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[24%_50%] lg:object-center"
        />

        {/* Image treatment */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent via-40% to-[#0b0b0a]/90 lg:from-transparent lg:via-transparent lg:via-45% lg:to-[#0b0b0a]/85" />

        <div className="absolute inset-0 hidden bg-linear-to-r from-[#0b0b0a]/70 via-[#0b0b0a]/15 via-50% to-transparent lg:block" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-8 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-7xl">
            <div>
              {/* Eyebrow */}
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="h-px w-8 bg-(--accent)" />

                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-(--accent-light)">
                  Resort &middot; Spa &middot; Wellness &middot; Stays
                </p>
              </div>

              {/* Heading */}
              <h1 className="max-w-5xl text-[clamp(2.25rem,8vw,5.5rem)] lg:text-[clamp(3rem,5.2vw,5.25rem)] font-light uppercase leading-[0.92] tracking-[-0.04em] text-white">
                The Hideaway
                <br />
                <span className="text-white/80">Spa and Resort</span>
              </h1>

              {/* Description */}
              <p className="mt-5 hidden max-w-md text-sm sm:block leading-6 text-white/70 sm:text-base sm:leading-7">
                A thoughtful place to stay, unwind, enjoy resort dining, and find
                time for wellness and grooming.
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <Link
                  href="/booking"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-(--accent) px-5 sm:min-h-13 sm:px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
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
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 sm:min-h-13 sm:px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  View Resort Menu
                </Link>

                <Link
                  href="#about"
                  className="hidden sm:inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 sm:min-h-13 sm:px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="absolute bottom-6 left-5 right-5 z-10 hidden items-end justify-end sm:flex lg:hidden">

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              Scroll to explore
            </span>

            <span className="h-px w-10 bg-white/25" />
          </div>
        </div>
      </div>
    </section>
  );
}

