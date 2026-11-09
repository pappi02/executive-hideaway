import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  AccommodationRequestForm,
  AccommodationRequestFormFromUrl,
} from "@/components/accommodation/AccommodationRequestForm";
import { getActiveAccommodation } from "@/data/accommodation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Accommodation Request",
  description: "Send an accommodation booking request to Executive Hideaway Resort & Spa in Nairobi.",
  path: "/accommodation/request",
});

// Cached like the other room pages; room edits in the admin revalidate it.
export const revalidate = 3600;

export default async function AccommodationRequestPage() {
  const rooms = (await getActiveAccommodation()).map((item) => ({
    name: item.name,
    slug: item.slug,
    pricePerNight: item.pricePerNight,
    maxGuests: item.maxGuests,
  }));

  return (
    <>
      <Navbar tone="dark" />
      <main className="min-h-svh bg-[#f3efe6] px-5 pb-14 pt-24 text-[#0b0b0a] sm:px-8 sm:pt-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* The prerendered fallback is the full form; the browser then swaps in
              the same form with the ?room= selection applied. */}
          <Suspense fallback={<AccommodationRequestForm rooms={rooms} initialSlug="" />}>
            <AccommodationRequestFormFromUrl rooms={rooms} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
