"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock3, X } from "lucide-react";
import type { Service } from "@/data/services";
import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";

interface ServiceCardProps {
  service: Service;
  reverse?: boolean;
}

export default function ServiceCard({
  service,
  reverse = false,
}: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addService } = useBooking();
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  const closeCard = () => setIsOpen(false);
  const handleChooseService = (event?: React.MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    addService(service);
    closeCard();
    router.push("/booking");
  };

  useEffect(() => {
    if (!isOpen) return;

    hasOpened.current = true;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && hasOpened.current) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`View details for ${service.name}`}
        aria-expanded={isOpen}
        aria-controls={`service-dialog-${service.id}`}
        className="group block w-full overflow-hidden rounded-[1.25rem] bg-white/65 text-left ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80683c] focus-visible:ring-offset-2"
      >
        <div className="grid min-h-55 grid-cols-[45%_55%] sm:min-h-60">
        {/* Image */}
        <div
          className={`relative h-55 overflow-hidden bg-[#ddd7ca] sm:h-60 ${
            reverse ? "order-1" : "order-2"
          }`}
        >
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 55vw, 420px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div
          className={`flex h-55 flex-col p-4 sm:h-60 sm:p-5 ${
            reverse ? "order-2" : "order-1"
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80683c]">
              {service.category}
            </p>

            <h3 className="mt-2 text-xl font-light leading-[1.05] tracking-[-0.035em] text-[#0b0b0a] sm:text-2xl">
              {service.name}
            </h3>

            <p className="mt-2 line-clamp-2 text-[11px] leading-[1.55] text-black/45 sm:text-xs sm:leading-5">
              {service.description}
            </p>
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25 sm:text-[11px]">
                  Price
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-[#80683c] sm:text-xs">
                  {service.price === null
                    ? "Price on request"
                    : `Ksh ${service.price.toLocaleString()}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1 text-black/30">
                <Clock3 size={11} strokeWidth={1.4} />

                <span className="text-[11px] uppercase tracking-[0.08em] sm:text-[11px]">
                  {service.duration} min
                </span>
              </div>
            </div>

            <div className="mt-3 flex min-h-9 w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 group-hover:bg-[#80683c] sm:min-h-10 sm:text-[11px]">
              View Details
              <ArrowUpRight size={11} strokeWidth={1.4} />
            </div>
          </div>
        </div>
        </div>
      </button>

      {isOpen && (
        <div
          ref={dialogRef}
          id={`service-dialog-${service.id}`}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`service-title-${service.id}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCard();
          }}
        >
          <div
            className="relative max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#f3efe6] shadow-2xl shadow-black/20"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCard}
              aria-label="Close service details"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="grid lg:grid-cols-[45%_55%]">
              <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-115">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

                <p className="absolute bottom-5 left-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  {service.category}
                </p>
              </div>

              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#80683c]">
                    The experience
                  </p>

                  <h2
                    id={`service-title-${service.id}`}
                    className="mt-3 text-3xl font-light leading-[1] tracking-[-0.035em] text-[#0b0b0a] sm:text-4xl"
                  >
                    {service.name}
                  </h2>

                  <div className="mt-6 h-px w-full bg-black/8" />

                  <p className="mt-6 text-sm leading-7 text-black/60 sm:text-base">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/3 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                        Price
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#80683c]">
                        {service.price === null
                          ? "Price on request"
                          : `Ksh ${service.price.toLocaleString()}`}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/3 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                        Duration
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#0b0b0a]">
                        <Clock3 size={14} strokeWidth={1.4} />
                        {service.duration} minutes
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/booking"
                    onClick={handleChooseService}
                    className="group mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#0b0b0a] px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#80683c]"
                  >
                    Choose & Continue
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.4}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}