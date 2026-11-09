import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { accommodationImageSrc } from "@/lib/accommodation-image-src";

interface RoomCardProps {
  room: {
    name: string;
    slug: string;
    description: string;
    pricePerNight: number | null;
    maxGuests: number;
    bedType: string | null;
    bathroom: string | null;
    amenities: string[];
    images: { id: string; url: string | null; altText: string }[];
    featured: boolean;
  };
}

export function RoomCard({ room }: RoomCardProps) {
  const image = room.images[0];
  const selectedAmenities = room.amenities.slice(0, 4);

  return (
    <article className="group grid min-w-0 border-t border-black/15 py-5 sm:grid-cols-[0.92fr_1.08fr] sm:gap-6 sm:py-7 lg:gap-10">
      <Link href={`/accommodation/${room.slug}`} className="relative block aspect-video overflow-hidden bg-[#d7d1c4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#80683c] sm:self-start">
        {image ? (
          <Image src={accommodationImageSrc(image)} alt={image.altText} fill priority={room.featured} sizes="(max-width: 640px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-black/45">Photos available on request.</div>
        )}
        {room.featured && <span className="absolute left-3 top-3 bg-[#0b0b0a]/85 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">Featured</span>}
      </Link>

      <div className="flex min-w-0 flex-col pt-4 sm:py-2">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <Link href={`/accommodation/${room.slug}`} className="wrap-break-word text-[1.65rem] font-light leading-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c] sm:text-3xl">{room.name}</Link>
          </div>
          <p className="shrink-0 text-right text-xs text-black/65">
            {room.pricePerNight === null ? "Rate on request" : (
              <><span className="block text-[1.1rem] font-medium text-[#0b0b0a]">KSh {room.pricePerNight.toLocaleString()}</span><span>per night</span></>
            )}
          </p>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{room.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-black/10 py-4 text-xs sm:grid-cols-3">
          <div><dt className="text-black/55">Sleeps</dt><dd className="mt-1 wrap-break-word text-black/80">{room.maxGuests}</dd></div>
          {room.bedType && <div><dt className="text-black/55">Bed</dt><dd className="mt-1 wrap-break-word text-black/80">{room.bedType}</dd></div>}
          {room.bathroom && <div><dt className="text-black/55">Bathroom</dt><dd className="mt-1 wrap-break-word text-black/80">{room.bathroom}</dd></div>}
        </dl>

        {selectedAmenities.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Selected room amenities">
            {selectedAmenities.map((amenity) => <li key={amenity} className="text-xs text-black/65">{amenity}</li>)}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-5">
          <Link href={`/accommodation/${room.slug}`} className="inline-flex min-h-11 items-center gap-2 border-b border-black/25 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">
            View room <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <Link href={`/accommodation/request?room=${encodeURIComponent(room.slug)}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0b0b0a] px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#80683c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">
            Book this room
          </Link>
        </div>
      </div>
    </article>
  );
}