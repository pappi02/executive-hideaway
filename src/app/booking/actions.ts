"use server";

import { isBookingRateLimited, saveBookingRequest } from "@/lib/booking-requests";
import { isValidPhone } from "@/lib/phone";
import { nairobiDay } from "@/lib/poster-time";
import { prisma } from "@/lib/prisma";
import { businessContact, isWithinSpaHours, SPA_HOURS_MESSAGE } from "@/lib/site-config";

interface AppointmentRequest {
  serviceIds: string[];
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
}

/** This action is public: check shapes and sizes before touching the database. */
function isValidInput(input: unknown): input is AppointmentRequest {
  if (typeof input !== "object" || input === null) return false;
  const value = input as Record<string, unknown>;
  const limits = { date: 10, time: 5, name: 100, phone: 20, notes: 500 };
  return (
    Object.entries(limits).every(([key, max]) => typeof value[key] === "string" && (value[key] as string).length <= max) &&
    Array.isArray(value.serviceIds) &&
    value.serviceIds.length >= 1 &&
    value.serviceIds.length <= 30 &&
    value.serviceIds.every((id) => typeof id === "string" && id.length <= 120)
  );
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(value: string) {
  return new Date(`2000-01-01T${value}:00.000Z`).toLocaleTimeString("en-KE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours} hr ${rest} min`;
  return hours ? `${hours} hr` : `${rest} min`;
}

/** Builds the WhatsApp message from current prices, never from what the browser remembers. */
export async function createAppointmentRequestLink(input: AppointmentRequest) {
  if (!isValidInput(input)) return { error: "Please check your details and try again." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name) return { error: "Please enter your name." };
  if (!isValidPhone(phone)) return { error: "Enter a valid phone number, with the country code if outside Kenya." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) {
    return { error: "Please select your preferred date." };
  }
  if (input.date < nairobiDay()) return { error: "Please choose a date from today onwards." };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) return { error: "Please select your preferred time." };
  if (!isWithinSpaHours(input.time)) return { error: SPA_HOURS_MESSAGE };

  if (await isBookingRateLimited()) return { error: "Too many requests. Please wait a few minutes and try again." };

  const found = await prisma.service.findMany({
    where: { id: { in: input.serviceIds } },
    select: { id: true, name: true, price: true, duration: true },
  });
  const services = input.serviceIds.flatMap((id) => found.filter((service) => service.id === id));
  if (services.length !== input.serviceIds.length) {
    return { error: "One of your services is no longer available. Please review your selection." };
  }

  const lines = services.map((service, index) => {
    const price = service.price === null ? "Price on request" : `Ksh ${service.price.toLocaleString()}`;
    return `${index + 1}. ${service.name} — ${price} — ${service.duration} min`;
  });
  const totalDuration = services.reduce((total, service) => total + service.duration, 0);
  const totalPrice = services.reduce((total, service) => total + (service.price ?? 0), 0);
  const total = services.some((service) => service.price === null) ? "Price on request" : `Ksh ${totalPrice.toLocaleString()}`;
  const notes = input.notes.trim();

  const message = [
    "BOOKING REQUEST",
    "",
    "Customer",
    `Name: ${name}`,
    `Phone: ${phone}`,
    "",
    "Appointment",
    `Date: ${formatDate(input.date)}`,
    `Time: ${formatTime(input.time)}`,
    "",
    "Services",
    ...lines,
    "",
    `Total duration: ${formatDuration(totalDuration)}`,
    `Estimated total: ${total}`,
    `Notes: ${notes || "None"}`,
  ].join("\n");

  await saveBookingRequest({
    kind: "appointment",
    name,
    phone,
    summary: `${formatDate(input.date)}, ${formatTime(input.time)}: ${services.map((service) => service.name).join(", ")}`,
  });

  return { url: `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}` };
}
