import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RoomCard } from "@/components/accommodation/RoomCard";
import { getAccommodationSettings, getActiveAccommodation, getActiveResortFacilities } from "@/data/accommodation";
import { buildMetadata } from "@/lib/seo";
import { accommodationImageSrc } from "@/lib/accommodation-image-src";

export const metadata: Metadata = buildMetadata({
  title: "Accommodation",
  description: "Explore room types and accommodation requests at Executive Hideaway Resort & Spa in Nairobi. Ask our team to confirm rates and availability.",
  path: "/accommodation",
  image: "/images/accommodation/executive-room-photo-1.webp",
});

// Cached and served from the CDN; refreshed hourly, and immediately when the
// admin dashboard saves a change (revalidatePath in the admin actions).
export const revalidate = 3600;

export default async function AccommodationPage() {
  const [rooms, facilities, settings] = await Promise.all([
    getActiveAccommodation(),
    getActiveResortFacilities(),
    getAccommodationSettings(),
  ]);
  const heroImage = rooms.find((room) => room.featured)?.images[0] ?? rooms[0]?.images[0];

  return (
    <>
      <Navbar />
      <main className="bg-[#f3efe6] text-[#0b0b0a]">
        <section className="relative min-h-[78svh] overflow-hidden bg-[#151513] text-white sm:min-h-[82svh]">
          {heroImage ? (
            <Image src={accommodationImageSrc(heroImage)} alt={heroImage.altText} fill priority sizes="100vw" className="object-cover object-center" />
          ) : (
            <Image src="/images/hero.png" alt="Executive Hideaway Resort & Spa" fill priority sizes="100vw" className="object-cover object-center" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/25" />
          <div className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-5 pb-9 pt-32 sm:min-h-[82svh] sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-(--accent-light)"><span className="h-px w-8 bg-(--accent)" />Stay at the Hideaway</p>
            <h1 className="mt-5 max-w-4xl text-[clamp(3.2rem,12vw,7.5rem)] font-light leading-[0.9] text-white">A quieter way<br />to stay awhile.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75 sm:text-base sm:leading-7">Room details and rates are being updated by our team. Send a request and we’ll confirm your stay directly.</p>
            <Link href="#rooms" className="mt-7 inline-flex min-h-12 w-fit items-center gap-3 border-b border-white/40 text-[10px] font-semibold uppercase tracking-[0.17em] text-white hover:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore rooms <ArrowDown size={14} aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="rooms" className="scroll-mt-16 px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 border-b border-black/15 pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">Room collection</p>
                <h2 className="mt-2 text-3xl font-light leading-tight sm:text-5xl">Find your room.</h2>
              </div>
              <p className="max-w-md text-xs leading-5 text-black/55">Rates shown as indicative are temporary examples, not confirmed offers. All requests go to our team to confirm room availability and booking details.</p>
            </div>

            {rooms.length ? (
              <div className="mt-2">
                {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
              </div>
            ) : (
              <div className="border-b border-black/15 py-12 sm:py-16">
                <h3 className="text-xl font-light">Accommodation details are currently being updated.</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-black/55">Please contact us for accommodation information while our room collection is being prepared.</p>
                <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-black/25 text-[10px] font-semibold uppercase tracking-[0.13em] hover:border-black">Contact the resort <ArrowUpRight size={13} aria-hidden="true" /></Link>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-black/10 bg-bone px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-[0.7fr_1.3fr] sm:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">Before you arrive</p>
              <h2 className="mt-2 text-2xl font-light">A few useful details.</h2>
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-black/45">Check-in</dt><dd className="mt-1 leading-5">{settings?.checkIn || "Check-in and check-out arrangements confirmed during booking."}</dd></div>
              <div><dt className="text-xs text-black/45">Check-out</dt><dd className="mt-1 leading-5">{settings?.checkOut || "Check-in and check-out arrangements confirmed during booking."}</dd></div>
            </dl>
          </div>
        </section>

        {facilities.length > 0 && (
          <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">More than a room</p>
                <h2 className="mt-3 max-w-md text-3xl font-light leading-[1.02] sm:text-5xl">Make space for the whole experience.</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-black/55">A stay also brings you close to the resort’s independently managed dining, grooming, wellness, and shared spaces.</p>
              </div>
              <ul className="grid border-t border-black/15 sm:grid-cols-2 sm:gap-x-8">
                {facilities.map((facility) => (
                  <li key={facility.id} className="border-b border-black/15 py-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">{facility.category}</p>
                    <h3 className="mt-1 text-lg font-light">{facility.name}</h3>
                    {facility.description && <p className="mt-1 text-xs leading-5 text-black/55">{facility.description}</p>}
                    {facility.href && <Link href={facility.href} className="mt-2 inline-flex min-h-9 items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#80683c] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Explore <ArrowUpRight size={12} aria-hidden="true" /></Link>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-[#0b0b0a] px-5 py-9 text-white sm:px-8 sm:py-12 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">A booking request, not an instant reservation</p><h2 className="mt-2 text-2xl font-light">Let’s plan your stay.</h2><p className="mt-2 text-xs leading-5 text-white/55">Our team will confirm availability and arrangements with you on WhatsApp.</p></div>
            {rooms[0] && <Link href={`/accommodation/request?room=${encodeURIComponent(rooms[0].slug)}`} className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-(--accent) px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0b0b0a] hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Request a room <ArrowUpRight size={13} aria-hidden="true" /></Link>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}