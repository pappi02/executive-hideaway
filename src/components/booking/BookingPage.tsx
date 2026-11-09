"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import BookingForm from "./BookingForm";
import { useBooking } from "./BookingProvider";

export default function BookingPage() {
  const { selectedServices, removeService } = useBooking();

  if (selectedServices.length === 0) {
    return (
      <main className="min-h-screen bg-[#f3efe6] text-[#0b0b0a]">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50 transition-colors hover:text-[#80683c]"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Back Home
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#80683c]">
              Appointment
            </p>
          </header>

          <section className="flex flex-1 items-center justify-center py-20">
            <div className="w-full max-w-xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
                Begin your experience
              </p>
              <h1 className="mt-5 text-5xl font-light leading-[0.95] tracking-tighter sm:text-6xl">
                Choose your
                <br />
                services.
              </h1>
              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-black/50">
                Select one or more services from our collection to begin your
                appointment request.
              </p>
              <Link
                href="/services"
                className="group mx-auto mt-9 flex min-h-12 w-fit items-center justify-center gap-3 rounded-full bg-[#0b0b0a] px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#80683c]"
              >
                Choose Your Services
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.duration,
    0,
  );

  const totalPrice = selectedServices.reduce(
    (total, service) => total + (service.price ?? 0),
    0,
  );

  const hasPriceOnRequest = selectedServices.some(
    (service) => service.price === null,
  );

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

  return (
    <main className="min-h-screen bg-[#f3efe6] text-[#0b0b0a]">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link
            href="/services"
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50 transition-colors hover:text-[#80683c]"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Services
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#80683c]">
            Appointment
          </p>
        </header>

        <section className="py-7 sm:py-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
              Your selection
            </p>
            <h1 className="mt-3 text-2xl font-light leading-[0.95] tracking-tighter sm:text-7xl">
              Your
              <br />
              experience.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/50">
              Review the services you&apos;ve selected before continuing with
              your appointment request.
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {selectedServices.map((service, index) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl bg-white/65 ring-1 ring-black/5"
              >
                <div className="grid lg:grid-cols-[220px_1fr]">
                  <div className="relative h-40 lg:h-full lg:min-h-48">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 220px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 p-4 sm:p-7">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">
                        Service {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 text-xl font-light tracking-[-0.035em]">
                        {service.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-black/35">
                        <span>{service.duration} min</span>
                        <span className="h-1 w-1 rounded-full bg-black/20" />
                        <span>
                          {service.price === null
                            ? "Price on request"
                            : `Ksh ${service.price.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      aria-label={`Remove ${service.name}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/8 text-black/35 transition-colors hover:border-black/20 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80683c]"
                    >
                      <X size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-black/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors hover:bg-black/3"
          >
            + Add another service
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </Link>

          <div className="mt-2 rounded-3xl bg-[#0b0b0a] p-5 text-white sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Estimated duration
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {selectedServices.length} {selectedServices.length === 1 ? "service" : "services"}
                </p>
              </div>
              <p className="text-right text-sm font-medium text-[#c5aa72]">
                {formatDuration(totalDuration)}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Estimated total
              </p>
              <p className="text-right text-sm font-medium text-[#c5aa72]">
                {hasPriceOnRequest
                  ? "Price on request"
                  : `Ksh ${totalPrice.toLocaleString()}`}
              </p>
            </div>
          </div>

          <BookingForm services={selectedServices} />
        </section>
      </div>
    </main>
  );
}
