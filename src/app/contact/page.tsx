import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clock3,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Send,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { businessContact } from "@/data/contact";

const socialIcons = {
  instagram: Camera,
  facebook: Globe,
  linkedin: Send,
  twitter: Globe,
  x: Globe,
  youtube: Send,
  tiktok: Music2,
};

export default function ContactPage() {
  const {
    primaryPhone,
    primaryPhoneHref,
    whatsappUrl,
    secondaryPhones,
    email,
    emailHref,
    location,
    socialLinks,
  } = businessContact;

  return (
    <main className="min-h-screen bg-[#f3efe6] text-[#0b0b0a]">
      <Navbar tone="dark" />

      <div className="mx-auto w-full max-w-4xl px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-10">
        <header className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#80683c]">
            Get in touch
          </p>

          <h1 className="mt-2 text-[2.4rem] font-light leading-[0.94] tracking-[-0.055em] sm:text-[3rem] lg:text-[3.6rem]">
            Let&apos;s make time <span className="text-black/30">for you.</span>
          </h1>

          <p className="mt-3 max-w-xl text-[13px] leading-[1.45] text-black/50 sm:text-sm">
            Questions, appointments, or simply want to know more? Reach out
            directly and we&apos;ll be happy to assist.
          </p>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl bg-[#0b0b0a] text-[#f3efe6]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <a
                  href={primaryPhoneHref}
                  className="block text-[1.8rem] font-light leading-none tracking-[-0.045em] transition-colors hover:text-[#c5aa72] sm:text-[2.2rem]"
                >
                  {primaryPhone}
                </a>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={primaryPhoneHref}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f3efe6] px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-colors hover:bg-[#c5aa72]"
                  >
                    <Phone size={16} strokeWidth={2} />
                    Call
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-[#c5aa72] hover:bg-[#c5aa72] hover:text-[#0b0b0a]"
                  >
                    <MessageCircle size={16} strokeWidth={2} />
                    WhatsApp
                  </a>
                </div>
              </div>

              <a
                href={emailHref}
                className="flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-[#c5aa72]"
              >
                <Mail size={16} strokeWidth={2} />
                <span className="break-all">{email}</span>
              </a>
            </div>

            {secondaryPhones.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">
                {secondaryPhones.map((phone) => (
                  <a
                    key={phone.label}
                    href={phone.href}
                    className="flex items-center gap-2 text-[12px] text-white/50 transition-colors hover:text-[#c5aa72]"
                  >
                    <Phone size={11} strokeWidth={1.5} />
                    <span>{phone.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-6 border-y border-black/8 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-[#80683c]">
              <MapPin size={13} strokeWidth={1.5} />

              <p className="text-[7px] font-semibold uppercase tracking-[0.2em]">
                Visit us
              </p>
            </div>

            <p className="mt-3 text-sm leading-5 text-black/70">
              {location.address}
            </p>

            <p className="text-sm text-black/40">{location.city}</p>

            <a
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#80683c] transition-colors hover:text-[#0b0b0a]"
            >
              Get directions
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </a>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#80683c]">
              <Clock3 size={13} strokeWidth={2} />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Opening hours
              </p>
            </div>

            <p className="mt-3 text-[15px] font-medium text-black/70">
              Monday to sunday 24/7 (open 24hrs)
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]">
              Follow us
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => {
                const platform = social.platform.toLowerCase();
                const Icon = socialIcons[platform as keyof typeof socialIcons];

                if (!Icon) return null;

                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    title={social.platform}
                    className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-black/50 transition-all duration-300 hover:border-[#80683c] hover:bg-[#80683c] hover:text-[#f3efe6]"
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span className="text-[13px] font-medium capitalize">{social.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>



        <section className="mt-6 rounded-3xl bg-[#80683c] px-5 py-5 text-[#f3efe6] sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[7px] font-semibold uppercase tracking-[0.24em] text-white/50">
                Ready when you are
              </p>

              <h2 className="mt-1.5 text-[1.8rem] font-light leading-none tracking-[-0.045em]">
                Book your next visit.
              </h2>
            </div>

            <Link
              href="/booking"
              className="group inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0b0b0a] px-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f3efe6] transition-colors hover:bg-white hover:text-[#0b0b0a]"
            >
              Book appointment
              <ArrowUpRight
                size={12}
                strokeWidth={1.5}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
