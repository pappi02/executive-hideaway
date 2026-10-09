"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { createAccommodationRequestLink } from "@/app/accommodation/request/actions";
import { isKenyanMobile } from "@/lib/phone";

interface RequestRoom {
  name: string;
  slug: string;
  pricePerNight: number | null;
  priceIsIndicative: boolean;
  maxGuests: number;
}

interface FormValues {
  room: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  name: string;
  phone: string;
  request: string;
}

const today = new Date();
const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const fieldClass = "mt-1.5 min-h-12 w-full min-w-0 rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#0b0b0a] outline-none focus:border-[#80683c] focus-visible:ring-2 focus-visible:ring-[#80683c]/25";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.13em] text-black/55";

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function dateLabel(value: string) {
  if (!validDate(value)) return "";
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function AccommodationRequestForm({ rooms, initialSlug }: { rooms: RequestRoom[]; initialSlug: string }) {
  const [form, setForm] = useState<FormValues>({
    room: rooms.some((room) => room.slug === initialSlug) ? initialSlug : rooms[0]?.slug ?? "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    name: "",
    phone: "",
    request: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isPending, startTransition] = useTransition();
  const room = rooms.find((item) => item.slug === form.room);

  const update = (field: keyof FormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!room) nextErrors.room = "Choose an active room type.";
    if (!validDate(form.checkIn)) nextErrors.checkIn = "Enter a valid check-in date.";
    else if (form.checkIn < todayValue) nextErrors.checkIn = "Choose today or a future date.";
    if (!validDate(form.checkOut)) nextErrors.checkOut = "Enter a valid check-out date.";
    else if (validDate(form.checkIn) && form.checkOut <= form.checkIn) nextErrors.checkOut = "Check-out must be after check-in.";
    const guests = Number(form.guests);
    if (!Number.isSafeInteger(guests) || guests < 1) nextErrors.guests = "Enter at least one guest.";
    else if (room && guests > room.maxGuests) nextErrors.guests = `This room accepts up to ${room.maxGuests} guests.`;
    if (!form.name.trim()) nextErrors.name = "Enter your name.";
    if (!isKenyanMobile(form.phone)) nextErrors.phone = "Enter a valid Kenyan mobile number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionError("");
    if (!validate()) return;
    setIsReviewOpen(true);
  };

  const continueToWhatsApp = () => {
    if (!room) return;
    startTransition(async () => {
      const result = await createAccommodationRequestLink({
        slug: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        name: form.name,
        phone: form.phone,
        request: form.request,
      });
      if ("error" in result) {
        setSubmissionError(result.error ?? "We could not prepare your request. Please try again.");
        setIsReviewOpen(false);
        return;
      }
      window.location.assign(result.url);
    });
  };

  if (!rooms.length) {
    return (
      <div className="border border-black/10 bg-white/50 px-5 py-8">
        <h2 className="text-xl font-light">Room details are being updated.</h2>
        <p className="mt-2 text-sm leading-6 text-black/55">Please contact us for accommodation information.</p>
        <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center border-b border-black/25 text-[10px] font-semibold uppercase tracking-[0.13em]">Contact the resort</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:gap-14">
      <div>
        <Link href={room ? `/accommodation/${room.slug}` : "/accommodation"} className="inline-flex min-h-10 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-black/55 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]"><ArrowLeft size={13} aria-hidden="true" /> Back to room</Link>
        <h1 className="mt-5 text-[2.75rem] font-light leading-[0.95] sm:text-6xl">Request a stay.</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-black/55">Share your preferred dates and our team will confirm availability and booking details. This is a request, not an instant reservation.</p>

        {submissionError && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-700/5 px-4 py-3 text-sm text-red-900">{submissionError}</p>}

        {!isReviewOpen ? (
          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div>
              <label htmlFor="request-room" className={labelClass}>Room type</label>
              <select id="request-room" value={form.room} onChange={(event) => update("room", event.target.value)} aria-invalid={Boolean(errors.room)} aria-describedby={errors.room ? "request-room-error" : undefined} className={fieldClass}>
                {rooms.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              {errors.room && <p id="request-room-error" className="mt-1 text-xs text-red-800">{errors.room}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="request-check-in" className={labelClass}>Check-in</label>
                <input id="request-check-in" type="date" min={todayValue} value={form.checkIn} onChange={(event) => update("checkIn", event.target.value)} aria-invalid={Boolean(errors.checkIn)} aria-describedby={errors.checkIn ? "request-check-in-error" : undefined} className={fieldClass} />
                {errors.checkIn && <p id="request-check-in-error" className="mt-1 text-xs text-red-800">{errors.checkIn}</p>}
              </div>
              <div>
                <label htmlFor="request-check-out" className={labelClass}>Check-out</label>
                <input id="request-check-out" type="date" min={form.checkIn || todayValue} value={form.checkOut} onChange={(event) => update("checkOut", event.target.value)} aria-invalid={Boolean(errors.checkOut)} aria-describedby={errors.checkOut ? "request-check-out-error" : undefined} className={fieldClass} />
                {errors.checkOut && <p id="request-check-out-error" className="mt-1 text-xs text-red-800">{errors.checkOut}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="request-guests" className={labelClass}>Guests</label>
                <input id="request-guests" type="number" min={1} max={room?.maxGuests} step={1} value={form.guests} onChange={(event) => update("guests", event.target.value)} aria-invalid={Boolean(errors.guests)} aria-describedby={errors.guests ? "request-guests-error" : undefined} className={fieldClass} />
                {room && <p className="mt-1 text-xs text-black/45">Up to {room.maxGuests} for this room</p>}
                {errors.guests && <p id="request-guests-error" className="mt-1 text-xs text-red-800">{errors.guests}</p>}
              </div>
              <div>
                <label htmlFor="request-name" className={labelClass}>Your name</label>
                <input id="request-name" maxLength={100} autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "request-name-error" : undefined} className={fieldClass} />
                {errors.name && <p id="request-name-error" className="mt-1 text-xs text-red-800">{errors.name}</p>}
              </div>
            </div>

              <div>
                <label htmlFor="request-phone" className={labelClass}>Phone number</label>
              <input id="request-phone" maxLength={20} type="tel" autoComplete="tel" placeholder="07xx xxx xxx" value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "request-phone-error" : undefined} className={fieldClass} />
              {errors.phone && <p id="request-phone-error" className="mt-1 text-xs text-red-800">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="request-special" className={labelClass}>Special request <span className="font-normal normal-case tracking-normal text-black/40">Optional</span></label>
              <textarea id="request-special" rows={3} maxLength={500} value={form.request} onChange={(event) => update("request", event.target.value)} className={fieldClass} />
            </div>

            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#80683c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c] sm:w-auto">Review request <ArrowUpRight size={14} aria-hidden="true" /></button>
          </form>
        ) : (
          <section aria-labelledby="request-summary-heading" className="mt-7 border-y border-black/15 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="request-summary-heading" className="text-xl font-light">Booking request summary</h2>
              <button type="button" onClick={() => setIsReviewOpen(false)} className="min-h-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55 underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c]">Edit details</button>
            </div>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Room</dt><dd className="mt-1 wrap-break-word text-sm">{room?.name}</dd></div>
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Guests</dt><dd className="mt-1 text-sm">{form.guests}</dd></div>
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Check-in</dt><dd className="mt-1 text-sm">{dateLabel(form.checkIn)}</dd></div>
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Check-out</dt><dd className="mt-1 text-sm">{dateLabel(form.checkOut)}</dd></div>
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Name</dt><dd className="mt-1 wrap-break-word text-sm">{form.name}</dd></div>
              <div className="border-t border-black/8 py-3"><dt className="text-xs text-black/45">Phone</dt><dd className="mt-1 text-sm">{form.phone}</dd></div>
              <div className="border-t border-black/8 py-3 sm:col-span-2"><dt className="text-xs text-black/45">Special request</dt><dd className="mt-1 wrap-break-word text-sm">{form.request.trim() || "None"}</dd></div>
              {room?.pricePerNight !== null && room?.pricePerNight !== undefined && <div className="border-t border-black/8 py-3 sm:col-span-2"><dt className="text-xs text-black/45">Rate shown</dt><dd className="mt-1 text-sm">KSh {room.pricePerNight.toLocaleString()} per night{room.priceIsIndicative ? " · indicative, please confirm" : ""}</dd></div>}
            </dl>
            <p className="mt-3 text-xs leading-5 text-black/50">No payment is taken here. Our team will confirm availability and arrangements on WhatsApp. See our <Link href="/terms" className="underline underline-offset-2 hover:text-black">booking terms</Link> and <Link href="/privacy" className="underline underline-offset-2 hover:text-black">privacy notice</Link>.</p>
            <button type="button" disabled={isPending} onClick={continueToWhatsApp} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#80683c] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80683c] sm:w-auto">{isPending ? "Preparing request…" : "Continue on WhatsApp"}<ArrowUpRight size={14} aria-hidden="true" /></button>
          </section>
        )}
      </div>

      <aside className="h-fit border-t border-black/15 pt-5 lg:sticky lg:top-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#80683c]">How it works</p>
        <ol className="mt-4 space-y-4 text-sm text-black/65">
          <li className="flex gap-3"><span className="text-xs text-black/35">01</span><span>Share your preferred room and dates.</span></li>
          <li className="flex gap-3"><span className="text-xs text-black/35">02</span><span>Review the details before continuing.</span></li>
          <li className="flex gap-3"><span className="text-xs text-black/35">03</span><span>Our team confirms availability with you on WhatsApp.</span></li>
        </ol>
      </aside>
    </div>
  );
}