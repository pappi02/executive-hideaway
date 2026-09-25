import type { Metadata } from "next";
import BookingPage from "@/components/booking/BookingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book an Appointment",
  description:
    "Book your appointment at Executive Hideaway Barber and Spa in Nairobi. Choose your services and request a time that works for you.",
  path: "/booking",
});

export default function Page() {
  return <BookingPage />;
}