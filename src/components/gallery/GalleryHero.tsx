import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="relative min-h-[40svh] overflow-hidden bg-[#0b0b0a] text-white">
      <Image
        src="/images/venue/lounge-fireplace-barber-view.webp"
        alt="The Executive Hideaway lounge, with the barber stations beyond"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_45%]"
      />

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/20 to-[#0b0b0a]" />

      <div className="relative z-5 flex min-h-[40svh] flex-col justify-end px-5 pb-6 pt-14 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
        <div className="mx-auto w-full max-w-7xl">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-(--accent-light)">
            <span className="h-px w-8 bg-(--accent-light)" />
            The gallery
          </p>

          <h1 className="mt-4 max-w-5xl text-[clamp(2.25rem,9vw,4.25rem)] font-light leading-[0.92] tracking-[-0.045em]">
            Inside the
            <br />
            <span className="text-white/35">Hideaway.</span>
          </h1>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-6 text-white/65">
              A full look at the atmosphere, craft, and details that shape
              every visit to Executive Hideaway.
            </p>

            <Link
              href="#gallery-grid"
              className="group inline-flex w-fit items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Browse the gallery

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0b0b0a]">
                <ArrowDownRight size={15} strokeWidth={1.4} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
