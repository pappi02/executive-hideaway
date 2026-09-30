import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";
import { prisma } from "@/lib/prisma";
import {
  createResortFacility,
  deleteResortFacility,
  setAccommodationActive,
  updateAccommodationSettings,
  updateResortFacility,
} from "./actions";
import { DeleteAccommodationButton } from "./DeleteAccommodationButton";

const inputClass = "min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-(--accent) focus-visible:ring-2 focus-visible:ring-(--accent)/30";
const labelClass = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-black/55";

export default async function AdminAccommodationPage() {
  const [rooms, facilities, settings] = await Promise.all([
    prisma.accommodation.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        pricePerNight: true,
        priceIsIndicative: true,
        numberOfRooms: true,
        maxGuests: true,
        active: true,
      },
    }),
    prisma.resortFacility.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.accommodationSettings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">Public accommodation</p>
            <h1 className="mt-1 text-2xl font-light">Room types</h1>
          </div>
          <Link href="/admin/accommodation/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-(--accent) px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0b0b0a] hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            Add room type
          </Link>
        </div>

        {rooms.length ? (
          <div className="mt-5 overflow-hidden border border-black/10 bg-white">
            <div className="divide-y divide-black/8 sm:hidden">
              {rooms.map((room) => (
                <article key={room.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/admin/accommodation/${room.id}`} className="wrap-break-word text-base font-medium hover:underline">{room.name}</Link>
                      <p className="mt-1 text-xs text-black/50">{room.pricePerNight === null ? "Rate not set" : `KSh ${room.pricePerNight.toLocaleString()} / night${room.priceIsIndicative ? " · indicative" : ""}`}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] ${room.active ? "text-emerald-800" : "text-black/40"}`}>{room.active ? "Public" : "Hidden"}</span>
                  </div>
                  <p className="text-xs text-black/55">{room.numberOfRooms} configured rooms · up to {room.maxGuests} guests</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/8 pt-2">
                    <AdminForm action={setAccommodationActive} successMessage={room.active ? "Room hidden from the public." : "Room made public."}>
                      <input type="hidden" name="id" value={room.id} />
                      <input type="hidden" name="active" value={String(!room.active)} />
                      <button type="submit" className="min-h-10 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/60 hover:text-black">{room.active ? "Hide room" : "Publish room"}</button>
                    </AdminForm>
                    <div className="flex items-center">
                      <Link href={`/admin/accommodation/${room.id}`} className="min-h-10 content-center px-2 text-[10px] font-semibold uppercase tracking-widest text-black/60 hover:text-black">Edit</Link>
                      <DeleteAccommodationButton id={room.id} name={room.name} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <table className="hidden w-full text-left text-sm sm:table">
              <thead className="border-b border-black/10 bg-black/2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                <tr><th className="px-4 py-3">Room type</th><th className="px-4 py-3">Indicative rate</th><th className="px-4 py-3">Inventory</th><th className="px-4 py-3">Visibility</th><th className="px-4 py-3" /></tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-4 py-3 font-medium"><Link href={`/admin/accommodation/${room.id}`} className="hover:underline">{room.name}</Link></td>
                    <td className="px-4 py-3 text-black/60">{room.pricePerNight === null ? "Not set" : `KSh ${room.pricePerNight.toLocaleString()}${room.priceIsIndicative ? " · indicative" : ""}`}</td>
                    <td className="px-4 py-3 text-black/60">{room.numberOfRooms} rooms · {room.maxGuests} guests</td>
                    <td className="px-4 py-3">
                      <AdminForm action={setAccommodationActive} successMessage={room.active ? "Room hidden from the public." : "Room made public."}>
                        <input type="hidden" name="id" value={room.id} />
                        <input type="hidden" name="active" value={String(!room.active)} />
                        <button type="submit" className={`text-[10px] font-semibold uppercase tracking-widest hover:underline ${room.active ? "text-emerald-800" : "text-black/45"}`}>{room.active ? "Public · click to hide" : "Hidden · click to publish"}</button>
                      </AdminForm>
                    </td>
                    <td className="px-4 py-3 text-right"><div className="flex justify-end"><Link href={`/admin/accommodation/${room.id}`} className="min-h-10 content-center px-2 text-[10px] font-semibold uppercase tracking-widest text-black/60 hover:text-black">Edit</Link><DeleteAccommodationButton id={room.id} name={room.name} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 border border-dashed border-black/20 px-5 py-8 text-sm text-black/55">No room types configured yet. Add a room type to publish accommodation.</p>
        )}
      </section>

      <section className="grid gap-10 border-t border-black/10 pt-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/45">Property information</p>
          <h2 className="mt-1 text-xl font-light">Arrival arrangements</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-black/55">Leave either field empty until the details are confirmed. Visitors will see a neutral booking message instead of an assumed time.</p>
          <AdminForm action={updateAccommodationSettings} successMessage="Arrival arrangements saved." className="mt-5 space-y-4">
            <div><label className={labelClass} htmlFor="checkIn">Check-in information</label><input id="checkIn" name="checkIn" defaultValue={settings?.checkIn ?? ""} placeholder="Optional" maxLength={120} className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="checkOut">Check-out information</label><input id="checkOut" name="checkOut" defaultValue={settings?.checkOut ?? ""} placeholder="Optional" maxLength={120} className={inputClass} /></div>
            <button type="submit" className="min-h-10 rounded-full border border-black/20 px-5 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Save information</button>
          </AdminForm>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/45">Separate from room amenities</p>
          <h2 className="mt-1 text-xl font-light">Available at the Resort</h2>
          <p className="mt-2 text-sm leading-6 text-black/55">Manage shared resort facilities and experiences here. They are not shown as features inside each room.</p>
          <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
            {facilities.map((facility) => (
              <div key={facility.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto]">
                <AdminForm action={updateResortFacility.bind(null, facility.id)} successMessage={`${facility.name} updated.`} className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelClass} htmlFor={`facility-name-${facility.id}`}>Name</label><input id={`facility-name-${facility.id}`} name="name" required defaultValue={facility.name} className={inputClass} /></div>
                  <div><label className={labelClass} htmlFor={`facility-category-${facility.id}`}>Category</label><input id={`facility-category-${facility.id}`} name="category" required defaultValue={facility.category} className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className={labelClass} htmlFor={`facility-description-${facility.id}`}>Description</label><input id={`facility-description-${facility.id}`} name="description" defaultValue={facility.description ?? ""} className={inputClass} /></div>
                  <div><label className={labelClass} htmlFor={`facility-href-${facility.id}`}>Page link (optional)</label><input id={`facility-href-${facility.id}`} name="href" defaultValue={facility.href ?? ""} placeholder="/services" className={inputClass} /></div>
                  <div className="flex items-end gap-3"><label className="flex min-h-10 items-center gap-2 text-xs text-black/60"><input type="checkbox" name="active" defaultChecked={facility.active} className="size-4 accent-[#80683c]" />Visible publicly</label><button type="submit" className="min-h-10 px-3 text-[10px] font-semibold uppercase tracking-widest text-black/60 hover:text-black">Save</button></div>
                </AdminForm>
                <AdminForm action={deleteResortFacility} successMessage={`${facility.name} removed.`}>
                  <input type="hidden" name="id" value={facility.id} />
                  <button type="submit" className="min-h-10 px-3 text-[10px] font-semibold uppercase tracking-widest text-red-700/70 hover:text-red-800">Remove</button>
                </AdminForm>
              </div>
            ))}
          </div>
          <AdminForm action={createResortFacility} successMessage="Resort experience added." className="mt-5 grid gap-3 sm:grid-cols-2">
            <div><label className={labelClass} htmlFor="new-facility-name">New experience</label><input id="new-facility-name" name="name" required className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="new-facility-category">Category</label><input id="new-facility-category" name="category" required className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="new-facility-description">Description</label><input id="new-facility-description" name="description" className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="new-facility-href">Page link (optional)</label><input id="new-facility-href" name="href" placeholder="/menu" className={inputClass} /></div>
            <label className="flex min-h-10 items-center gap-2 text-xs text-black/60"><input type="checkbox" name="active" defaultChecked className="size-4 accent-[#80683c]" />Visible publicly</label>
            <button type="submit" className="min-h-10 justify-self-start rounded-full border border-black/20 px-5 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Add experience</button>
          </AdminForm>
        </div>
      </section>
    </div>
  );
}