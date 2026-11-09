import Link from "next/link";
import { POSTER_KIND_LABELS, posterAnchor, type PosterDetails } from "@/lib/posters";

const nairobi = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Nairobi",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const primaryClass =
  "inline-flex items-center justify-center rounded-full bg-[#80683c] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#0b0b0a]";

function CtaButton({ url, label }: { url: string; label: string }) {
  if (url.startsWith("/")) return <Link href={url} className={primaryClass}>{label}</Link>;
  if (url.startsWith("tel:")) return <a href={url} className={primaryClass}>{label}</a>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={primaryClass}>
      {label}
    </a>
  );
}

/**
 * "Special offers" at the top of /services: every poster running now, in full.
 * Clicking a poster pop-up anywhere on the site lands on its own article
 * here (#offer-<id>), which is highlighted.
 */
export default function PosterOffers({ posters }: { posters: PosterDetails[] }) {
  if (posters.length === 0) return null;

  return (
    <section id="offers" aria-label="Special offers" className="bg-[#f3efe6] px-5 pt-10 text-[#0b0b0a] sm:px-8 sm:pt-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
          <span className="h-px w-8 bg-[#80683c]" />
          Running now
        </p>
        <h2 className="mt-3 text-3xl font-light tracking-[-0.045em] sm:text-5xl">Special offers</h2>

        <div className="mt-6 grid gap-6">
          {posters.map((poster) => {
            const paragraphs = (poster.details ?? "").split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
            return (
              <article
                key={poster.id}
                id={posterAnchor(poster.id)}
                className="grid scroll-mt-24 gap-6 rounded-3xl border border-black/10 bg-white p-5 transition-shadow duration-500 target:border-[#80683c]/60 target:shadow-[0_0_0_3px_rgba(128,104,60,0.18),0_24px_60px_rgba(0,0,0,0.12)] sm:p-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- poster at its own proportions, from /public or Blob */}
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="mx-auto block h-auto w-full max-w-104 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                />

                <div className="grid min-w-0 content-start gap-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#80683c] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      {POSTER_KIND_LABELS[poster.kind]}
                    </span>
                    <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                      Until {nairobi.format(new Date(poster.endsAt))}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-light tracking-[-0.035em] sm:text-4xl">{poster.title}</h3>
                    {poster.summary && <p className="mt-3 max-w-2xl text-sm leading-7 text-black/65 sm:text-base">{poster.summary}</p>}
                  </div>

                  {(poster.priceText || poster.location) && (
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {poster.priceText && (
                        <div className="rounded-2xl bg-[#f3efe6] px-4 py-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Price</dt>
                          <dd className="mt-1 text-sm font-medium">{poster.priceText}</dd>
                        </div>
                      )}
                      {poster.location && (
                        <div className="rounded-2xl bg-[#f3efe6] px-4 py-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Where</dt>
                          <dd className="mt-1 text-sm font-medium">{poster.location}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  {poster.highlights.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">What&apos;s included</h4>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {poster.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm leading-6">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#80683c]" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="max-w-2xl text-sm leading-7 text-black/65">
                      {paragraph}
                    </p>
                  ))}

                  <div className="flex flex-wrap items-center gap-4">
                    {poster.ctaUrl && poster.ctaLabel ? (
                      <CtaButton url={poster.ctaUrl} label={poster.ctaLabel} />
                    ) : (
                      <CtaButton url="/booking" label="Book now" />
                    )}
                    <a
                      href="#services"
                      className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50 transition-colors hover:text-black"
                    >
                      See all services
                    </a>
                  </div>

                  {poster.terms && <p className="text-xs leading-6 text-black/45">{poster.terms}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
