import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAccommodationSettings, getActiveAccommodationBySlug } from "@/data/accommodation";
import { buildMetadata } from "@/lib/seo";
import { accommodationImageSrc } from "@/lib/accommodation-image-src";

// Cached and served from the CDN; refreshed hourly, and immediately when the
// admin dashboard saves a change (revalidatePath in the admin actions).
export const revalidate = 3600;

// No room pages are built ahead of time; each is rendered on its first visit and then cached.
export function generateStaticParams() {
  return [];
}

type RoomPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getActiveAccommodationBySlug(slug);
  if (!room) return buildMetadata({ title: "Accommodation", description: "Explore accommodation at Executive Hideaway Resort & Spa in Nairobi.", path: `/accommodation/${slug}` });

  return buildMetadata({
    title: room.name,
    description: room.description,
    path: `/accommodation/${room.slug}`,
    image: room.images[0] ? accommodationImageSrc(room.images[0]) : "/images/og-hideaway-lounge.jpg",
  });
}

export default async function AccommodationRoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const [room, settings] = await Promise.all([
    getActiveAccommodationBySlug(slug),
    getAccommodationSettings(),
  ]);
  if (!room) notFound();

  return (
    <>
      <Navbar tone="dark" />
      <main className="bg-[#f3efe6] text-[#0b0b0a]">
        <section className="px-5 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <Link href="/accommodation" className="inline-flex min-h-10 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-black/55 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]"><ArrowLeft size={13} aria-hidden="true" /> All rooms</Link>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">Accommodation at Executive Hideaway</p>
                <h1 className="mt-3 wrap-break-word text-[clamp(2.7rem,9vw,6rem)] font-light leading-[0.93]">{room.name}</h1>
              </div>
              <div>
                <p className="text-sm leading-6 text-black/60">{room.description}</p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-black/15 pt-4">
                  <p>
                    {room.pricePerNight === null ? <span className="text-sm text-black/65">Rate on request</span> : <><span className="text-2xl font-light">KSh {room.pricePerNight.toLocaleString()}</span><span className="ml-2 text-xs text-black/50">per night</span></>}
                  </p>
                  <Link href={`/accommodation/request?room=${encodeURIComponent(room.slug)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-white hover:bg-[#80683c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Book this room <ArrowUpRight size={13} aria-hidden="true" /></Link>
                </div>
              </div>
            </div>

            {room.images.length ? (
              <div className={`mt-8 grid gap-3 ${room.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {room.images.map((image, index) => (
                  // Photos are landscape: kept at 16:9 so a room is never cropped. With an odd count, the first runs full width.
                  <figure key={image.id} className={`relative aspect-video overflow-hidden bg-[#ddd6ca] ${index === 0 && room.images.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
                    <Image src={accommodationImageSrc(image)} alt={image.altText} fill priority={index === 0} sizes={index === 0 && room.images.length % 2 === 1 ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 640px) 100vw, 640px"} className="object-cover" />
                  </figure>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid aspect-[1.4] place-items-center bg-[#e5dfd3] px-5 text-sm text-black/45">Photos available on request.</div>
            )}

            <div className="mt-10 grid gap-10 border-t border-black/15 pt-7 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">Room details</p>
                <h2 className="mt-2 text-2xl font-light">The details that matter.</h2>
                <p className="mt-3 text-xs leading-5 text-black/55">Our team confirms availability and your booking with you on WhatsApp.</p>
              </div>
              <dl className="grid gap-x-7 border-t border-black/10 sm:grid-cols-2 sm:border-t-0">
                <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Sleeps</dt><dd className="mt-1 text-sm">{room.maxGuests}</dd></div>
                {room.bedType && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Bed type</dt><dd className="mt-1 wrap-break-word text-sm">{room.bedType}</dd></div>}
                {room.roomSize && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Room size</dt><dd className="mt-1 text-sm">{room.roomSize}</dd></div>}
                {room.bathroom && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Bathroom</dt><dd className="mt-1 wrap-break-word text-sm">{room.bathroom}</dd></div>}
                {room.breakfastIncluded !== null && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Breakfast</dt><dd className="mt-1 text-sm">{room.breakfastIncluded ? "Included" : "Not included"}</dd></div>}
                {room.wifiAvailable !== null && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Wi-Fi</dt><dd className="mt-1 text-sm">{room.wifiAvailable ? "Available in this room" : "Not listed for this room"}</dd></div>}
                {room.parkingAvailable !== null && <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Parking</dt><dd className="mt-1 text-sm">{room.parkingAvailable ? "Available" : "Not included for this room"}</dd></div>}
                <div className="border-b border-black/10 py-4"><dt className="text-xs text-black/55">Children</dt><dd className="mt-1 text-sm">{room.childrenAllowed ? "Allowed" : "Not allowed"}</dd></div>
              </dl>
            </div>

            {room.amenities.length > 0 && (
              <section className="mt-10 border-t border-black/15 pt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">In this room</p>
                <h2 className="mt-2 text-2xl font-light">Room amenities</h2>
                <ul className="mt-5 grid border-t border-black/10 sm:grid-cols-2 sm:gap-x-8">
                  {room.amenities.map((amenity) => <li key={amenity} className="border-b border-black/10 py-3 text-sm">{amenity}</li>)}
                </ul>
              </section>
            )}

            <div className="mt-10 flex flex-col gap-5 border-t border-black/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-black/60">
                {settings?.checkIn || settings?.checkOut ? (
                  <>
                    {settings.checkIn && <>Check-in: {settings.checkIn}<br /></>}
                    {settings.checkOut && <>Check-out: {settings.checkOut}</>}
                  </>
                ) : "We’ll agree your arrival and departure times when we confirm your booking."}
              </p>
              <Link href={`/accommodation/request?room=${encodeURIComponent(room.slug)}`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-6 text-[11px] font-semibold uppercase tracking-[0.13em] text-white hover:bg-[#80683c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Book this room <ArrowUpRight size={13} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}