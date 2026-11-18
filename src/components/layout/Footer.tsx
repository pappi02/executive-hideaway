
import {
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SignOff } from "./SignOff";

import { businessContact } from "@/lib/site-config";

const phoneNumbers = [
  { label: businessContact.primaryPhone, href: businessContact.primaryPhoneHref },
  ...businessContact.secondaryPhones,
];
const whatsappUrl = businessContact.whatsappUrl;
const locationUrl = businessContact.location.googleMapsUrl;
const socialLinks = businessContact.socialLinks;

const contactLinkClass =
  "group flex min-h-10 min-w-0 items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors duration-300 hover:text-white";
const contactIconClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-(--accent)";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Accommodation", href: "/accommodation" },
  { label: "Resort Menu", href: "/menu" },
  { label: "Games", href: "/games" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#0b0b0a] text-[#f5f1e8]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* CTA */}
        <div className="relative border-b border-white/10 py-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-120 w-120 rounded-full border border-white/3.5"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/3.5"
          />

          <div className="relative mx-auto max-w-5xl">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-(--accent)">
              <span className="h-px w-8 bg-(--accent)" />
              Your time starts here
            </p>

            <h2 className="mt-4 text-3xl font-light leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Make time for
              <br />
              <span className="text-white/30">yourself.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Whether you are planning a stay, a meal, or time for personal
              care, our team can help you plan your visit.
            </p>

            <a
              href="/booking"
              className="group mt-5 inline-flex min-h-11 items-center gap-4 rounded-full bg-[#f5f1e8] px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b0b0a] transition-all duration-500 hover:bg-(--accent) hover:text-white sm:px-7"
            >
              Book an appointment

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight size={15} strokeWidth={1.4} />
              </span>
            </a>
            <Link
              href="/accommodation"
              className="group mt-3 ml-0 inline-flex min-h-11 items-center gap-4 rounded-full border border-white/20 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-(--accent) hover:text-(--accent-light) sm:ml-3 sm:px-7"
            >
              Explore accommodation
              <ArrowUpRight size={15} strokeWidth={1.4} />
            </Link>
          </div>
        </div>

        {/* Brand, navigation, location and contact: one row of four columns on large screens */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-b border-white/10 py-8 sm:gap-x-10 sm:py-10 lg:grid-cols-[1fr_1.15fr_1.25fr_1fr] lg:gap-x-12 lg:py-12">
          {/* Brand */}
          <div className="col-span-2 flex items-center gap-5 lg:col-span-1 lg:flex-col lg:items-start">
            <Link
              href="/"
              aria-label="Executive Hideaway Spa and Resort — home"
              className="block shrink-0"
            >
              <Image
                src="/images/hideaway-logo-light.svg"
                alt="Executive Hideaway Spa and Resort"
                width={509}
                height={591}
                className="h-auto w-20 sm:w-24"
              />
            </Link>

            <p className="text-xs leading-6 text-white/45 sm:text-sm">
              Resort · Spa · Wellness · Stays
              <br />
              Kileleshwa, Nairobi
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Explore
            </p>

            <nav className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex min-h-10 items-center gap-2 whitespace-nowrap text-xs text-white/55 transition-colors duration-300 hover:text-white sm:text-sm"
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

          {/* Location */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Find us
            </p>

            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 block"
            >
              <div className="flex items-start gap-3">
                <MapPin
                  size={15}
                  strokeWidth={1.3}
                  className="mt-0.5 shrink-0 text-(--accent)"
                />

                <div>
                  <p className="text-sm leading-5 text-white/75">
                    275 Nyeri close, kileleshwa estate,
                    Moi, Nairobi Area, 00100
                  </p>

                  <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/20">
                    PQ9H+2M Nairobi
                  </p>
                </div>
              </div>

              <span className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent)">
                Open in Maps

                <ArrowUpRight
                  size={12}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Contact
            </p>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-1">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  aria-label={`Call ${phone.label}`}
                  className={contactLinkClass}
                >
                  <span className={contactIconClass}>
                    <Phone size={13} strokeWidth={1.3} />
                  </span>
                  <span className="truncate">{phone.label}</span>
                </a>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className={contactLinkClass}
              >
                <span className={contactIconClass}>
                  <WhatsAppIcon />
                </span>
                WhatsApp
              </a>

              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={contactLinkClass}
                >
                  <span className={contactIconClass}>
                    {social.platform === "Instagram" ? <InstagramIcon /> : <TikTokIcon />}
                  </span>
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/20">
            © {new Date().getFullYear()} Executive Hideaway Resort & Spa
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="inline-flex min-h-10 items-center text-[11px] uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-10 items-center text-[11px] uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white">
              Booking terms
            </Link>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/15">
              Nairobi, Kenya
            </p>
          </div>

          <SignOff />
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

