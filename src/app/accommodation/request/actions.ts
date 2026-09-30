"use server";

import { prisma } from "@/lib/prisma";
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

export async function createAccommodationRequestLink(input: AccommodationRequest) {
  const room = await prisma.accommodation.findFirst({
    where: { slug: input.slug, active: true },
    select: { name: true, maxGuests: true, pricePerNight: true, priceIsIndicative: true },
  });
  if (!room) return { error: "This room is no longer accepting requests. Please choose another room." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  const normalizedPhone = phone.replace(/[\s()-]/g, "");
  const phonePattern = /^(?:\+?254|0)\d{9}$/;
  const guests = Number(input.guests);

  if (!name) return { error: "Enter your name to continue." };
  if (!phonePattern.test(normalizedPhone)) return { error: "Enter a valid Kenyan mobile number." };
  if (!isValidDate(input.checkIn) || !isValidDate(input.checkOut)) return { error: "Enter valid check-in and check-out dates." };
  if (input.checkIn < new Date().toISOString().slice(0, 10)) return { error: "Check-in must be today or a future date." };
  if (input.checkOut <= input.checkIn) return { error: "Check-out must be after check-in." };
  if (!Number.isSafeInteger(guests) || guests < 1) return { error: "Guest count must be at least one." };
  if (guests > room.maxGuests) return { error: `This room accepts up to ${room.maxGuests} guests.` };

  const rate = room.pricePerNight === null
    ? "Rate: To be confirmed"
    : `Room rate: KSh ${room.pricePerNight.toLocaleString()} per night${room.priceIsIndicative ? " (indicative; please confirm)" : ""}`;

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

  return {
    url: `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}`,
  };
}