"use server";

import { prisma } from "@/lib/prisma";
import { isBookingRateLimited, saveBookingRequest } from "@/lib/booking-requests";
import { isValidPhone } from "@/lib/phone";
import { nairobiDay } from "@/lib/poster-time";
import { businessContact } from "@/lib/site-config";

interface AccommodationRequest {
  slug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  phone: string;
  request: string;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const LIMITS = { slug: 120, name: 100, phone: 20, request: 500, checkIn: 10, checkOut: 10 } as const;

/** This action is public: check shapes and sizes before touching the database. */
function isValidInput(input: unknown): input is AccommodationRequest {
  if (typeof input !== "object" || input === null) return false;
  const value = input as Record<string, unknown>;
  return (
    (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).every(
      (key) => typeof value[key] === "string" && (value[key] as string).length <= LIMITS[key],
    ) &&
    (typeof value.guests === "number" || typeof value.guests === "string")
  );
}

export async function createAccommodationRequestLink(input: AccommodationRequest) {
  if (!isValidInput(input)) return { error: "Please check your details and try again." };
  if (await isBookingRateLimited()) return { error: "Too many requests. Please wait a few minutes and try again." };

  const room = await prisma.accommodation.findFirst({
    where: { slug: input.slug, active: true },
    select: { name: true, maxGuests: true, pricePerNight: true },
  });
  if (!room) return { error: "This room is no longer accepting requests. Please choose another room." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  const guests = Number(input.guests);

  if (!name) return { error: "Enter your name to continue." };
  if (!isValidPhone(phone)) return { error: "Enter a valid phone number, with the country code if outside Kenya." };
  if (!isValidDate(input.checkIn) || !isValidDate(input.checkOut)) return { error: "Enter valid check-in and check-out dates." };
  if (input.checkIn < nairobiDay()) return { error: "Check-in must be today or a future date." };
  if (input.checkOut <= input.checkIn) return { error: "Check-out must be after check-in." };
  if (!Number.isSafeInteger(guests) || guests < 1) return { error: "Guest count must be at least one." };
  if (guests > room.maxGuests) return { error: `This room accepts up to ${room.maxGuests} guests.` };

  const rate = room.pricePerNight === null
    ? "Rate: To be confirmed"
    : `Room rate: KSh ${room.pricePerNight.toLocaleString()} per night`;

  const message = [
    "Hello Executive Hideaway Resort & Spa,",
    "",
    "I would like to make an accommodation booking request.",
    "",
    `Room: ${room.name}`,
    `Check-in: ${formatDate(input.checkIn)}`,
    `Check-out: ${formatDate(input.checkOut)}`,
    `Guests: ${guests}`,
    rate,
    `Name: ${name}`,
    `Phone: ${phone}`,
    "",
    "Special request:",
    input.request.trim() || "None",
    "",
    "Please confirm availability and booking details.",
    "",
    "Thank you.",
  ].join("\n");

  await saveBookingRequest({
    kind: "accommodation",
    name,
    phone,
    summary: `${room.name}, ${formatDate(input.checkIn)} to ${formatDate(input.checkOut)}, ${guests} guest${guests === 1 ? "" : "s"}`,
  });

  return {
    url: `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}`,
  };
}