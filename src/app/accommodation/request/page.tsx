import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AccommodationRequestForm } from "@/components/accommodation/AccommodationRequestForm";
import { getActiveAccommodation } from "@/data/accommodation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Accommodation Request",
  description: "Send an accommodation booking request to Executive Hideaway Resort & Spa in Nairobi.",
  path: "/accommodation/request",
});

export const dynamic = "force-dynamic";

export default async function AccommodationRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const [{ room }, rooms] = await Promise.all([searchParams, getActiveAccommodation()]);

  return (
    <>
      <Navbar tone="dark" />
      <main className="min-h-svh bg-[#f3efe6] px-5 pb-14 pt-24 text-[#0b0b0a] sm:px-8 sm:pt-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <AccommodationRequestForm
            initialSlug={room ?? ""}
            rooms={rooms.map((item) => ({
              name: item.name,
              slug: item.slug,
              pricePerNight: item.pricePerNight,
              priceIsIndicative: item.priceIsIndicative,
              maxGuests: item.maxGuests,
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}