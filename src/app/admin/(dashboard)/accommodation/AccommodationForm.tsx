import type { ActionResult } from "@/lib/admin-action";
import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-(--accent) focus-visible:ring-2 focus-visible:ring-(--accent)/30";
const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55";

export interface AccommodationFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  pricePerNight: number | null;
  priceIsIndicative: boolean;
  isTemporary: boolean;
  numberOfRooms: number;
  maxGuests: number;
  bedType: string | null;
  roomSize: string | null;
  bathroom: string | null;
  amenities: string[];
  breakfastIncluded: boolean | null;
  wifiAvailable: boolean | null;
  parkingAvailable: boolean | null;
  childrenAllowed: boolean;
  featured: boolean;
  active: boolean;
}

function Checkbox({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2.5 text-sm text-black/75">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="size-4 accent-[#80683c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
      />
      {label}
    </label>
  );
}

function TriStateSelect({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: boolean | null;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={value === null ? "" : String(value)} className={inputClass}>
        <option value="">Not specified</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  );
}

export function AccommodationForm({
  action,
  defaultValues,
  submitLabel,
  successMessage,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues?: AccommodationFormValues;
  submitLabel: string;
  successMessage: string;
}) {
  return (
    <AdminForm
      action={action}
      successMessage={successMessage}
      redirectTo="/admin/accommodation"
      className="mt-6 max-w-3xl space-y-6"
    >
      <section className="space-y-5 border-b border-black/10 pb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Display name</label>
            <input id="name" name="name" required defaultValue={defaultValues?.name} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="slug">Public URL slug</label>
            <input id="slug" name="slug" defaultValue={defaultValues?.slug} placeholder="generated-from-name" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} required defaultValue={defaultValues?.description} className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="pricePerNight">Price per night (KSh)</label>
            <input id="pricePerNight" name="pricePerNight" type="number" min={0} step={1} defaultValue={defaultValues?.pricePerNight ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="numberOfRooms">Configured room count</label>
            <input id="numberOfRooms" name="numberOfRooms" type="number" min={0} step={1} required defaultValue={defaultValues?.numberOfRooms ?? 1} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="maxGuests">Maximum guests</label>
            <input id="maxGuests" name="maxGuests" type="number" min={1} step={1} required defaultValue={defaultValues?.maxGuests ?? 1} className={inputClass} />
          </div>
        </div>
        <Checkbox
          name="priceIsIndicative"
          label="Rate is temporary / indicative"
          checked={defaultValues?.priceIsIndicative ?? true}
        />
        <Checkbox
          name="isTemporary"
          label="Room name and details are temporary examples"
          checked={defaultValues?.isTemporary ?? false}
        />
      </section>

      <section className="space-y-5 border-b border-black/10 pb-6">
        <h2 className="text-sm font-semibold">Room details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="bedType">Bed type</label>
            <input id="bedType" name="bedType" defaultValue={defaultValues?.bedType ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="roomSize">Room size (optional)</label>
            <input id="roomSize" name="roomSize" defaultValue={defaultValues?.roomSize ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="bathroom">Bathroom information</label>
            <input id="bathroom" name="bathroom" defaultValue={defaultValues?.bathroom ?? ""} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="amenities">Room amenities</label>
          <textarea
            id="amenities"
            name="amenities"
            rows={5}
            defaultValue={defaultValues?.amenities.join("\n")}
            className={inputClass}
            aria-describedby="amenities-help"
          />
          <p id="amenities-help" className="mt-1 text-xs text-black/45">One amenity per line. Edit or remove a line to update the public list.</p>
        </div>
      </section>

      <section className="space-y-3 border-b border-black/10 pb-6">
        <h2 className="text-sm font-semibold">Room policies and services</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <TriStateSelect name="breakfastIncluded" label="Breakfast included" value={defaultValues?.breakfastIncluded ?? null} />
          <TriStateSelect name="wifiAvailable" label="Wi-Fi in this room" value={defaultValues?.wifiAvailable ?? null} />
          <TriStateSelect name="parkingAvailable" label="Parking for this room" value={defaultValues?.parkingAvailable ?? null} />
        </div>
        <div className="grid gap-1 sm:grid-cols-3">
          <Checkbox name="childrenAllowed" label="Children allowed" checked={defaultValues?.childrenAllowed ?? false} />
          <Checkbox name="featured" label="Featured room" checked={defaultValues?.featured ?? false} />
          <Checkbox name="active" label="Visible to the public" checked={defaultValues?.active ?? true} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="min-h-11 rounded-full bg-(--accent) px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b0b0a] hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          {submitLabel}
        </button>
        <Link href="/admin/accommodation" className="min-h-11 content-center text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          Back to rooms
        </Link>
      </div>
    </AdminForm>
  );
}