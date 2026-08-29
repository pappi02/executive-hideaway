
import {
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";

import { businessContact } from "@/data/contact";

const phoneNumber = businessContact.primaryPhone;
const phoneUrl = businessContact.primaryPhoneHref;
const whatsappUrl = businessContact.whatsappUrl;
const locationUrl = businessContact.location.googleMapsUrl;
const socialLinks = businessContact.socialLinks;

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/#gallery" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#0b0b0a] text-[#f5f1e8]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* CTA */}
        <div className="relative border-b border-white/10 py-12 sm:py-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-120 w-120 rounded-full border border-white/3.5"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/3.5"
          />

          <div className="relative mx-auto max-w-5xl">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-(--accent)">
              <span className="h-px w-8 bg-(--accent)" />
              Your time starts here
            </p>

            <h2 className="mt-6 text-5xl font-light leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-[7rem]">
              Make time for
              <br />
              <span className="text-white/30">yourself.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
              Whether you are here for a fresh cut, personal care, or simply
              some time to unwind, your Executive Hideaway experience begins
              with an appointment.
            </p>

            <a
              href="/booking"
              className="group mt-4 inline-flex min-h-14 items-center gap-5 rounded-full bg-[#f5f1e8] px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0b0b0a] transition-all duration-500 hover:bg-(--accent) hover:text-white sm:px-8"
            >
              Book an appointment

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight size={15} strokeWidth={1.4} />
              </span>
            </a>
          </div>
        </div>

        {/* Footer information */}
        <div className="grid grid-cols-2">
          {/* LEFT — Brand & Navigation */}
          <div className="py-8 pr-5 sm:py-10 sm:pr-10 lg:py-14 lg:pr-8">
            <p className="text-2xl font-light leading-[0.95] tracking-[-0.04em] sm:text-3xl lg:text-4xl">
              Executive
              <br />
              <span className="text-white/30">Hideaway</span>
            </p>

            <p className="mt-2 text-xs text-white/30 sm:text-sm">
              Barber and Spa
            </p>

            <div className="mt-6 sm:mt-16">
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/25">
                Explore
              </p>

              <nav className="mt-5 flex flex-col items-start gap-4">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-2 text-xs text-white/55 transition-colors duration-300 hover:text-white sm:text-sm"
                  >
                    {item.label}

                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.3}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* RIGHT — Location */}
          <div className="py-8 pl-5 sm:py-10 sm:pl-10 lg:py-14 lg:pl-8">
            <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Find us
            </p>

            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 block"
            >
              <div className="flex items-start gap-3">
                <MapPin
                  size={15}
                  strokeWidth={1.3}
                  className="mt-0.5 shrink-0 text-(--accent)"
                />

                <div>
                  <p className="text-sm leading-5 text-white/75 sm:text-base">
                    275 Nyeri close, kileleshwa estate,
                    Moi, Nairobi Area, 00100
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    Nairobi
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-white/20">
                    PQ9H+2M Nairobi
                  </p>
                </div>
              </div>

              <span className="mt-5 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-(--accent)">
                Open in Maps

                <ArrowUpRight
                  size={12}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </div>
        </div>

        {/* Contact links — full width, single horizontal row */}
        <div className="w-full py-4 sm:py-4">
          <div className="grid grid-cols-4 items-center">

            {/* Phone */}
            <a
              href={phoneUrl}
              aria-label={`Call ${phoneNumber}`}
              className="group flex min-w-0 items-center justify-center gap-2 text-white/45 transition-colors duration-300 hover:text-white sm:gap-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-(--accent)">
                <Phone
                  size={13}
                  strokeWidth={1.3}
                />
              </span>

              <span className="truncate text-[8px] uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.16em]">
                {phoneNumber}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="group flex min-w-0 items-center justify-center gap-2 text-white/45 transition-colors duration-300 hover:text-white sm:gap-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-(--accent)">
                <WhatsAppIcon />
              </span>

              <span className="text-[8px] uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.16em]">
                WhatsApp
              </span>
            </a>

            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="group flex min-w-0 items-center justify-center gap-2 text-white/45 transition-colors duration-300 hover:text-white sm:gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-(--accent)">
                  {social.platform === "Instagram" ? <InstagramIcon /> : <TikTokIcon />}
                </span>

                <span className="text-[8px] uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.16em]">
                  {social.platform}
                </span>
              </a>
            ))}

          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] uppercase tracking-[0.18em] text-white/20">
            © {new Date().getFullYear()} Executive Hideaway Barber and Spa
          </p>

          <p className="text-[8px] uppercase tracking-[0.18em] text-white/15">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}

/* WhatsApp Icon */
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.1A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M8.5 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.6.7c.8 1.4 1.8 2.3 3.2 3.1l.7-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.3.6-.2.8-.8 1.4-1.5 1.5-1.1.2-3.1-.6-5-2.4-1.7-1.7-2.6-3.7-2.4-4.9.1-.4.4-.6.8-.8Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* TikTok Icon */
function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 4c.3 2.3 1.6 3.7 4 4v3.1c-1.5 0-2.9-.4-4-1.1v6.3a5.2 5.2 0 1 1-4.5-5.1v3.2a2.1 2.1 0 0 1 1.5 2V4H15Z" />
    </svg>
  );
}

