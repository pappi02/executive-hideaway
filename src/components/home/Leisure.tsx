import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { leisureAreas } from "@/data/leisure";

/** Food, the bar & lounge, and games: the resort beyond the spa. */
export default function Leisure() {
  return (
    <section
      id="leisure"
      className="bg-[#0b0b0a] px-5 py-10 text-white sm:px-8 sm:py-16 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-(--accent)">
            <span className="h-px w-7 bg-(--accent)" />
            Dine, unwind, play
          </p>

          <h2 className="mt-4 text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Stay a little longer.
            <br />
            <span className="text-white/40">There&apos;s more to do.</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
            Between treatments, or for an evening of its own: a kitchen, a
            lounge bar and a games room, all under one roof.
          </p>
        </div>

        {/* Areas */}
        <div className="mt-8 divide-y divide-white/10 border-t border-white/10 sm:mt-12 lg:mt-16">
          {leisureAreas.map((area, index) => (
            <article
              key={area.id}
              id={area.id}
              className="grid scroll-mt-24 gap-5 py-7 sm:grid-cols-2 sm:items-center sm:gap-9 sm:py-10 lg:gap-16 lg:py-14"
            >
              <Link
                href={area.cta.href}
                tabIndex={-1}
                aria-hidden="true"
                className={`group relative block aspect-[1.45] overflow-hidden bg-white/5 ${
                  index % 2 === 1 ? "sm:order-2" : ""
                }`}
              >
                <Image
                  src={area.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${area.imagePosition}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0a]/35 via-transparent to-transparent" />
              </Link>

              <div className="max-w-md">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-white/35">
                    {area.number}
                  </span>
                  <span className="h-px w-8 bg-(--accent)/50" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--accent)">
                    {area.eyebrow}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-light tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
                  {area.description}
                </p>

                <Link
                  href={area.cta.href}
                  className="group mt-5 inline-flex min-h-11 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                >
                  {area.cta.label}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0b0b0a]">
                    <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
