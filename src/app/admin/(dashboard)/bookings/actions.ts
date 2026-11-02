"use server";

import { revalidatePath } from "next/cache";
import { adminAction, oneOf, requiredText, type ActionResult } from "@/lib/admin-action";
import { BOOKING_STATUSES } from "@/lib/booking-requests";
import { prisma } from "@/lib/prisma";

export async function setBookingStatus(formData: FormData): Promise<ActionResult> {
  return adminAction("setBookingStatus", async () => {
    const id = requiredText(formData, "id", { label: "Request ID" });
    const status = oneOf(formData, "status", BOOKING_STATUSES, "status");
    await prisma.bookingRequest.update({ where: { id }, data: { status } });
    revalidatePath("/admin/bookings");
  });
}

export async function deleteBookingRequest(formData: FormData): Promise<ActionResult> {
  return adminAction("deleteBookingRequest", async () => {
    const id = requiredText(formData, "id", { label: "Request ID" });
    await prisma.bookingRequest.delete({ where: { id } });
    revalidatePath("/admin/bookings");
  });
}
