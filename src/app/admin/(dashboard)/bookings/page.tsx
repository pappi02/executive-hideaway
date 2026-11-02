import { AdminForm } from "@/components/admin/AdminForm";
import { BOOKING_STATUSES } from "@/lib/booking-requests";
import { formatNairobi } from "@/lib/poster-time";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { deleteBookingRequest, setBookingStatus } from "./actions";

export default async function AdminBookingsPage() {
  await requireAdmin();
  const requests = await prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">Booking requests</h1>
      <p className="mt-3 text-sm text-black/50">
        Saved when a guest continues to WhatsApp, so some may never have arrived as a message. Nothing here is a
        confirmed booking until you confirm it with the guest. Requests are deleted after a year.
      </p>

      {requests.length === 0 ? (
        <p className="mt-6 border border-dashed border-black/20 px-4 py-6 text-sm text-black/55">No requests yet.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {request.name} · <a href={`tel:${request.phone.replace(/[\s()-]/g, "")}`} className="underline">{request.phone}</a>
                </p>
                <p className="text-xs text-black/45">{formatNairobi(request.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-black/60">
                <span className="capitalize">{request.kind}</span>: {request.summary}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
                <AdminForm action={setBookingStatus} successMessage="Status updated." className="flex items-center gap-2">
                  <input type="hidden" name="id" value={request.id} />
                  <label htmlFor={`status-${request.id}`} className="sr-only">Status</label>
                  <select id={`status-${request.id}`} name="status" defaultValue={request.status} className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm capitalize">
                    {BOOKING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button type="submit" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/60 hover:text-black">Save</button>
                </AdminForm>
                <AdminForm action={deleteBookingRequest} successMessage="Request deleted.">
                  <input type="hidden" name="id" value={request.id} />
                  <button type="submit" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600">Delete</button>
                </AdminForm>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
