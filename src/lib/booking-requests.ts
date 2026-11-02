import { headers } from "next/headers";
import { clientIp } from "@/lib/login-throttle";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * Booking requests are kept so a guest who never presses send in WhatsApp isn't
 * lost, and so there is a history to work from. Free-text notes are deliberately
 * not stored: they can hold health details and travel only in the guest's own
 * WhatsApp message. Requests are deleted after a year.
 */

const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;

export async function isBookingRateLimited() {
  return isRateLimited(`booking:${clientIp({ headers: await headers() })}`, 10, 10 * 60 * 1000);
}

interface BookingRecord {
  kind: "appointment" | "accommodation";
  name: string;
  phone: string;
  summary: string;
}

/** Best effort: a failure here must never stop the guest reaching WhatsApp. */
export async function saveBookingRequest(record: BookingRecord) {
  try {
    await prisma.$transaction([
      prisma.bookingRequest.create({ data: record }),
      prisma.bookingRequest.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } } }),
    ]);
  } catch (error) {
    console.error("Booking request could not be saved", error);
  }
}
