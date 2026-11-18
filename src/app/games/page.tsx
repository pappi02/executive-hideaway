import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { comingSoonGames, games } from "@/data/leisure";
import { buildMetadata } from "@/lib/seo";
import { businessContact } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Games & Activities",
  description:
    "Pool, chess, cards, table tennis and darts at Executive Hideaway Resort & Spa in Nairobi. Ask our team about availability when you visit.",
  path: "/games",
  image: "/images/venue/pool-table-lounge.webp",
});

export default function GamesPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative min-h-[40svh] overflow-hidden bg-[#0b0b0a] text-white">
          <Image
            src="/images/venue/lounge-pool-wide-landscape.webp"
            alt="The games lounge: the pool table racked and ready, with sofas and the fireplace wall behind"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_72%]"
          />

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/15 to-[#0b0b0a]" />

          <div className="relative z-5 flex min-h-[40svh] flex-col justify-end px-5 pb-6 pt-14 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
            <div className="mx-auto w-full max-w-7xl">
              <h1 className="max-w-5xl text-[clamp(2.25rem,9vw,4.25rem)] font-light leading-[0.92] tracking-[-0.045em]">
                Games
                <br />
                <span className="text-white/35">&amp; activities.</span>
              </h1>

              <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-sm leading-6 text-white/65">
                  A quiet game or a friendly rivalry. Equipment is provided
                  on-site; ask our team what&apos;s free when you arrive.
                </p>

                <Link
                  href="#games"
                  className="group inline-flex w-fit items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
                >
                  See the games
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0b0b0a]">
                    <ArrowDownRight size={15} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Games */}
        <section
          id="games"
          className="scroll-mt-20 bg-[#f3efe6] px-5 py-8 text-[#0b0b0a] sm:px-8 sm:py-14 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
              <span className="h-px w-8 bg-[#80683c]" />
              The games room
            </p>

            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {games.map((game, index) => (
                <article
                  key={game.id}
                  id={game.id}
                  className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/60"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#d7d1c4]">
                    <Image
                      src={game.image}
                      alt={game.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${game.imagePosition}`}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[11px] font-medium tracking-[0.2em] text-black/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-xl font-light tracking-[-0.02em] sm:text-2xl">
                        {game.name}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm italic text-[#80683c]">{game.tagline}</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      {game.description}
                    </p>

                    <dl className="mt-auto grid gap-y-1.5 border-t border-black/10 pt-3 text-[13px]">
                      {[
                        ["Players", game.players],
                        ["Typical game", game.duration],
                        ["Equipment", game.equipment],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                            {label}
                          </dt>
                          <dd className="text-right text-black/75">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section
          id="coming-soon"
          className="scroll-mt-20 border-t border-black/10 bg-[#f3efe6] px-5 py-8 text-[#0b0b0a] sm:px-8 sm:py-14 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
                <span className="h-px w-8 bg-[#80683c]" />
                Coming soon
              </p>
              <h2 className="mt-3 text-3xl font-light leading-[1.05] tracking-[-0.035em] sm:text-4xl">
                More on the way.
              </h2>
              <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
                Games and activities we&apos;re planning to add. They aren&apos;t
                available yet; ask our team for the latest.
              </p>
            </div>

            <div className="mt-8 grid gap-x-12 gap-y-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoonGames.map((group) => (
                <div key={group.id}>
                  <h3 className="border-b border-black/15 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">
                    {group.title}
                  </h3>
                  <ul className="mt-1 divide-y divide-black/5">
                    {group.games.map((game) => (
                      <li key={game.name} className="py-3">
                        <p className="text-base font-normal tracking-[-0.01em]">{game.name}</p>
                        <p className="mt-0.5 text-sm leading-6 text-black/55">{game.description}</p>
                      </li>
                    ))}
                  </ul>
                  {group.note && (
                    <p className="mt-2 text-xs italic leading-5 text-black/45">{group.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquire */}
        <section className="bg-[#0b0b0a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-(--accent)">
                <span className="h-px w-7 bg-(--accent)" />
                Plan a game night
              </p>
              <h2 className="mt-3 text-3xl font-light leading-[1.05] tracking-[-0.035em] sm:text-4xl">
                Ask about tables,
                <br />
                <span className="text-white/40">rates and groups.</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                Our team will confirm what&apos;s available and the current
                rates. Pair it with something from the{" "}
                <Link href="/menu" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  kitchen and bar
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <a
                href={businessContact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-(--accent) px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b0b0a] transition-colors hover:bg-(--accent-light)"
              >
                <MessageCircle size={15} strokeWidth={1.6} aria-hidden="true" />
                WhatsApp us
                <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
              </a>
              <a
                href={businessContact.primaryPhoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/20 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#0b0b0a]"
              >
                <Phone size={14} strokeWidth={1.6} aria-hidden="true" />
                Call {businessContact.primaryPhone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
