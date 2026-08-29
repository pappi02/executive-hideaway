"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Clock3, X } from "lucide-react";
import type { Service } from "@/data/services";

interface BookingFormProps {
  services: Service[];
}

interface FormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
};

const WHATSAPP_NUMBER = "254759944566";

export default function BookingForm({ services }: BookingFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else {
      const normalizedPhone = form.phone.replace(/[\s()-]/g, "");
      const kenyanPhonePattern = /^(?:\+?254|0)7\d{8}$/;

      if (!kenyanPhonePattern.test(normalizedPhone)) {
        nextErrors.phone =
          "Enter a valid Kenyan mobile number, e.g. 07xx xxx xxx.";
      }
    }

    if (!form.date) {
      nextErrors.date = "Please select your preferred date.";
    } else {
      const selectedDate = new Date(`${form.date}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        nextErrors.date = "Please choose a date from today onwards.";
      }
    }

    if (!form.time) {
      nextErrors.time = "Please select your preferred time.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setIsReviewOpen(true);
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-KE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const parsedTime = new Date();

    parsedTime.setHours(Number(hours), Number(minutes), 0, 0);

    return parsedTime.toLocaleTimeString("en-KE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes <= 0) return "0 min";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) {
      return `${hours} hr ${remainingMinutes} min`;
    }

    if (hours) {
      return `${hours} hr`;
    }

    return `${remainingMinutes} min`;
  };

  const totalDuration = services.reduce(
    (total, service) => total + service.duration,
    0,
  );

  const totalPrice = services.reduce(
    (total, service) => total + (service.price ?? 0),
    0,
  );

  const hasPriceOnRequest = services.some(
    (service) => service.price === null,
  );

  const handleBookNow = () => {
    const serviceLines = services
      .map((service, index) => {
        const price =
          service.price === null
            ? "Price on request"
            : `Ksh ${service.price.toLocaleString()}`;

        return `${index + 1}. ${service.name} — ${price} — ${service.duration} min`;
      })
      .join("\n");

    const total = hasPriceOnRequest
      ? "Price on request"
      : `Ksh ${totalPrice.toLocaleString()}`;

    const message = [
      "BOOKING REQUEST",
      "",
      "Customer",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      "",
      "Appointment",
      `Date: ${formatDate(form.date)}`,
      `Time: ${formatTime(form.time)}`,
      "",
      "Services",
      serviceLines,
      "",
      `Total duration: ${formatDuration(totalDuration)}`,
      `Estimated total: ${total}`,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : "Notes: None",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    // eslint-disable-next-line react-hooks/immutability
    window.location.href = whatsappUrl;
  };

  const inputClassName =
    "mt-1.5 h-8 w-full rounded-lg border border-black/8 bg-[#f3efe6]/60 px-3 text-[13px] text-[#0b0b0a] outline-none transition-all placeholder:text-black/25 focus:border-[#80683c]/50 focus:ring-2 focus:ring-[#80683c]/10";

  const labelClassName =
    "text-[7px] font-semibold uppercase tracking-[0.17em] text-black/45";

  return (
    <>
      {/* BOOKING FORM */}
      <section className="mt-4 rounded-2xl bg-white/65 p-4 ring-1 ring-black/5 sm:mt-6 sm:p-6 lg:p-7">
        <div className="max-w-xl">
          <p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-[#80683c]">
            Appointment details
          </p>

          <h2 className="mt-2 text-xl font-light leading-none tracking-[-0.04em] sm:text-3xl">
            Tell us a little about yourself.
          </h2>

          <p className="mt-2.5 max-w-lg text-[12px] leading-5 text-black/45">
            Provide your preferred appointment details and we&apos;ll prepare
            your booking request.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <div className="grid gap-3.5 sm:grid-cols-2">
            {/* NAME */}
            <div>
              <label htmlFor="booking-name" className={labelClassName}>
                Full name
              </label>

              <input
                id="booking-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "booking-name-error" : undefined
                }
                className={inputClassName}
              />

              {errors.name && (
                <p
                  id="booking-name-error"
                  className="mt-1 text-[9px] leading-4 text-red-600"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label htmlFor="booking-phone" className={labelClassName}>
                Phone number
              </label>

              <input
                id="booking-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="+254..."
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "booking-phone-error" : undefined
                }
                className={inputClassName}
              />

              {errors.phone && (
                <p
                  id="booking-phone-error"
                  className="mt-1 text-[9px] leading-4 text-red-600"
                >
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

        <div className="mt-3.5 grid grid-cols-2 gap-3.5">
            {/* DATE */}
            <div>
              <label htmlFor="booking-date" className={labelClassName}>
                Preferred date
              </label>

              <input
                id="booking-date"
                type="date"
                value={form.date}
                onChange={(event) =>
                  updateField("date", event.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={
                  errors.date ? "booking-date-error" : undefined
                }
                className={inputClassName}
              />

              {errors.date && (
                <p
                  id="booking-date-error"
                  className="mt-1 text-[9px] leading-4 text-red-600"
                >
                  {errors.date}
                </p>
              )}
            </div>

            {/* TIME */}
            <div>
              <label htmlFor="booking-time" className={labelClassName}>
                Preferred time
              </label>

              <input
                id="booking-time"
                type="time"
                value={form.time}
                onChange={(event) =>
                  updateField("time", event.target.value)
                }
                aria-invalid={Boolean(errors.time)}
                aria-describedby={
                  errors.time ? "booking-time-error" : undefined
                }
                className={inputClassName}
              />

              {errors.time && (
                <p
                  id="booking-time-error"
                  className="mt-1 text-[9px] leading-4 text-red-600"
                >
                  {errors.time}
                </p>
              )}
            </div>
        </div>

          {/* NOTES */}
          <div className="mt-3">
            <label htmlFor="booking-notes" className={labelClassName}>
              Additional notes
              <span className="ml-1.5 font-normal normal-case tracking-normal text-black/25">
                Optional
              </span>
            </label>

            <textarea
              id="booking-notes"
              value={form.notes}
              onChange={(event) =>
                updateField("notes", event.target.value)
              }
              placeholder="Anything you'd like us to know?"
              rows={3}
              className="mt-1.5 w-full resize-none rounded-lg border border-black/8 bg-[#f3efe6]/60 px-3 py-2.5 text-[13px] leading-5 text-[#0b0b0a] outline-none transition-all placeholder:text-black/25 focus:border-[#80683c]/50 focus:ring-2 focus:ring-[#80683c]/10"
            />
          </div>

          {/* SELECTED SERVICES */}
          <div className="mt-4 rounded-lg bg-[#0b0b0a] p-3.5 text-white">
            <p className="text-[6px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Selected services
            </p>

            <div className="mt-2.5 space-y-1.5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-[12px] font-light">
                    {service.name}
                  </span>

                  <span className="shrink-0 text-[10px] text-[#c5aa72]">
                    {service.price === null
                      ? "On request"
                      : `Ksh ${service.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* REVIEW BUTTON */}
          <button
            type="submit"
            className="mt-3.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#80683c] px-5 text-[8px] font-semibold uppercase tracking-[0.17em] text-white transition-all duration-300 hover:bg-[#0b0b0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80683c] focus-visible:ring-offset-2"
          >
            Review Booking
            <ArrowUpRight size={13} strokeWidth={1.4} />
          </button>
        </form>
      </section>

      {/* REVIEW MODAL */}
      {isReviewOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-review-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsReviewOpen(false);
            }
          }}
        >
          <div
            className="relative max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#f3efe6] shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setIsReviewOpen(false)}
              aria-label="Close booking review"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/45 transition-colors hover:bg-black/10 hover:text-black"
            >
              <X size={15} strokeWidth={1.5} />
            </button>

            <div className="p-4 sm:p-6">
              <p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-[#80683c]">
                Final review
              </p>

              <h2
                id="booking-review-title"
                className="mt-2 pr-8 text-3xl font-light leading-[0.98] tracking-[-0.04em] sm:text-4xl"
              >
                Review your
                <br />
                appointment.
              </h2>

              <p className="mt-2.5 text-[12px] leading-5 text-black/45">
                Check your details before continuing with your booking.
              </p>

              {/* CUSTOMER DETAILS */}
              <div className="mt-5 overflow-hidden rounded-xl bg-white/60 ring-1 ring-black/5">
                <div className="border-b border-black/5 px-4 py-2.5">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">
                    Customer details
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-black/5">
                  <div className="bg-white/60 p-3.5">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.16em] text-black/30">
                      Full name
                    </p>
                    <p className="mt-1.5 text-[12px]">{form.name}</p>
                  </div>

                  <div className="bg-white/60 p-3.5">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.16em] text-black/30">
                      Phone
                    </p>
                    <p className="mt-1.5 text-[12px]">{form.phone}</p>
                  </div>

                  <div className="bg-white/60 p-3.5">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.16em] text-black/30">
                      Preferred date
                    </p>
                    <p className="mt-1.5 text-[12px]">
                      {formatDate(form.date)}
                    </p>
                  </div>

                  <div className="bg-white/60 p-3.5">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.16em] text-black/30">
                      Preferred time
                    </p>
                    <p className="mt-1.5 text-[12px]">
                      {formatTime(form.time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SERVICES */}
              <div className="mt-3.5 overflow-hidden rounded-xl bg-[#0b0b0a] text-white">
                <div className="border-b border-white/8 px-4 py-2.5">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#c5aa72]">
                    Selected services
                  </p>
                </div>

                <div className="divide-y divide-white/8">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div>
                        <p className="text-[12px] font-light">
                          {service.name}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1.5 text-[7px] uppercase tracking-widest text-white/35">
                          <Clock3 size={9} strokeWidth={1.4} />
                          {service.duration} min
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] text-[#c5aa72]">
                        {service.price === null
                          ? "On request"
                          : `Ksh ${service.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                  <span className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/35">
                    Total duration
                  </span>

                  <span className="text-[12px] font-medium text-[#c5aa72]">
                    {formatDuration(totalDuration)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                  <span className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/35">
                    Estimated total
                  </span>

                  <span className="text-[13px] font-medium text-[#c5aa72]">
                    {hasPriceOnRequest
                      ? "Price on request"
                      : `Ksh ${totalPrice.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* NOTES */}
              {form.notes.trim() && (
                <div className="mt-3.5 rounded-xl bg-white/60 p-3.5 ring-1 ring-black/5">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">
                    Additional notes
                  </p>

                  <p className="mt-2 text-[12px] leading-5 text-black/60">
                    {form.notes}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-black/10 px-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-black/55 transition-colors hover:bg-black/5"
                >
                  <ArrowLeft size={12} strokeWidth={1.5} />
                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="group flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#80683c] px-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#0b0b0a]"
                >
                  Book Now
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}