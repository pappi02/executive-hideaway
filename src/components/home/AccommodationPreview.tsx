import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedAccommodation } from "@/data/accommodation";
import { accommodationImageSrc } from "@/lib/accommodation-image-src";

export default async function AccommodationPreview() {
  // No try/catch on purpose: if the database is unreachable while the hourly
  // revalidation runs, the render fails and Next.js keeps serving the last good
  // home page. Catching here would cache a page without the room for an hour.
  const room = await getFeaturedAccommodation();
  if (!room) return null;

  const image = room.images[0];

  return (
    <section className="bg-bone px-5 py-9 text-[#0b0b0a] sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-[1.05fr_0.95fr] sm:items-center sm:gap-9 lg:gap-14">
        <Link href={`/accommodation/${room.slug}`} className="relative block aspect-[1.35] overflow-hidden bg-[#d7d1c4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#80683c]">
          {image ? <Image src={accommodationImageSrc(image)} alt={image.altText} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-sm text-black/45">Photos available on request.</span>}
        </Link>
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">A place to stay</p>
          <h2 className="mt-2 text-3xl font-light leading-[0.98] sm:text-4xl">Stay at the Hideaway.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/60">Find a room for your time in Nairobi, with resort dining, wellness, and grooming experiences close by.</p>
          <Link href="/accommodation" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-black/25 text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Explore accommodation <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}