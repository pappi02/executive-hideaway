import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { leisureAreas } from "@/data/leisure";

/** Food, the bar & lounge, and games: the resort beyond the spa. */
export default function Leisure() {
  return (
    <section
      id="leisure"
      className="bg-[#0b0b0a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-(--accent)">
              <span className="h-px w-7 bg-(--accent)" />
              Dine, unwind, play
            </p>

            <h2 className="mt-3 text-3xl font-light leading-[1.05] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]">
              Stay a little longer.{" "}
              <span className="text-white/40">There&apos;s more to do.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/60 sm:text-right">
            Between treatments, or for an evening of its own: a kitchen, a
            lounge bar and a games room, all under one roof.
          </p>
        </div>

        {/* Areas */}
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {leisureAreas.map((area) => (
            <article
              key={area.id}
              id={area.id}
              className="group flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/3 transition-colors duration-300 hover:border-(--accent)/40"
            >
              <Link
                href={area.cta.href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-4/3 overflow-hidden bg-white/5"
              >
                <Image
                  src={area.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${area.imagePosition}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0a]/50 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--accent-light) backdrop-blur-sm">
                  {area.eyebrow}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] font-medium tracking-[0.2em] text-white/35">
                    {area.number}
                  </span>
                  <h3 className="text-xl font-light tracking-[-0.02em] sm:text-2xl">
                    {area.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {area.description}
                </p>

                <Link
                  href={area.cta.href}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                >
                  {area.cta.label}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
