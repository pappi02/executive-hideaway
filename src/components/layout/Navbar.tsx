
"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  page?: string;
};

type NavbarProps = {
  tone?: "light" | "dark";
};

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    page: "/",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Experience",
    href: "/#experience",
  },
  {
    label: "Services",
    href: "/services",
    page: "/services",
  },
  {
    label: "Accommodation",
    href: "/accommodation",
    page: "/accommodation",
  },
  {
    label: "Resort Menu",
    href: "/menu",
    page: "/menu",
  },
  {
    label: "Games",
    href: "/games",
    page: "/games",
  },
  {
    label: "Gallery",
    href: "/gallery",
    page: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
    page: "/contact",
  },
];

export default function Navbar({ tone = "light" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // The light navbar is transparent over the hero; once the page scrolls it
  // takes a dark backdrop so its white links stay legible over cream sections.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isDark = tone === "dark";
  const isAccommodation = pathname.startsWith("/accommodation");
  const accommodationSlug = pathname.match(/^\/accommodation\/([^/]+)$/)?.[1];
  const bookingCtaHref = isAccommodation
    ? accommodationSlug
      ? `/accommodation/request?room=${encodeURIComponent(accommodationSlug)}`
      : "/accommodation#rooms"
    : "/booking";
  const bookingCtaLabel = isAccommodation ? "Request a Stay" : "Book Appointment";
  const showBookingCta = pathname !== "/booking" && pathname !== "/accommodation/request";

  const visibleNavItems = navItems.filter((item) => {
    if (!item.page) return true;

    return item.page !== pathname;
  });

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-60 transition-[background-color,box-shadow] duration-300 ${
          isDark
            ? "bg-[#f3efe6]/90 backdrop-blur-sm"
            : menuOpen
              ? "bg-[#0b0b0a]"
              : scrolled
                ? "bg-[#0b0b0a]/90 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8 sm:py-4 lg:px-10 2xl:gap-16">
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Executive Hideaway Spa and Resort — home"
            className="relative z-70 block shrink-0"
          >
            <Image
              src={isDark ? "/images/hideaway-lockup.svg" : "/images/hideaway-lockup-light.svg"}
              alt="Executive Hideaway Spa and Resort"
              width={341}
              height={100}
              priority
              className={`h-11 w-auto sm:h-12 lg:h-14 ${
                isDark ? "" : "drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-5 xl:flex 2xl:gap-10">
            <ul className="flex items-center gap-4 2xl:gap-8" aria-label="Main navigation">
              {visibleNavItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest transition-colors hover:text-(--accent) ${
                      isDark ? "text-[#0b0b0a]" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {showBookingCta && (
              <Link
                href={bookingCtaHref}
                className="flex min-h-10 shrink-0 whitespace-nowrap items-center justify-center rounded-full bg-(--accent) px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
              >
                {bookingCtaLabel}
              </Link>
            )}
          </div>

          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`relative z-70 flex h-13 w-13 cursor-pointer items-center justify-center bg-transparent backdrop-blur-md transition-colors duration-300 sm:h-11 sm:w-11 xl:hidden ${
              isDark
                ? "text-[#0b0b0a] hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }`}
          >
            {menuOpen ? (
              <X size={36} strokeWidth={2} />
            ) : (
              <Menu size={36} strokeWidth={2} />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-0 z-50 max-h-svh overflow-y-auto overscroll-contain border-b border-white/10 bg-[#0b0b0a] shadow-[0_24px_48px_rgba(0,0,0,0.45)] transition-all duration-300 xl:hidden ${
          menuOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        inert={!menuOpen}
      >
        <div className="flex flex-col px-5 pb-8 pt-23 sm:px-8 sm:pt-28">
          <nav className="flex flex-col gap-1 sm:gap-1.5" aria-label="Mobile navigation">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-11 items-center text-[1.375rem] font-light leading-none tracking-[-0.02em] text-white sm:text-2xl transition-colors hover:text-(--accent)"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Booking CTA */}
          {showBookingCta && (
            <div className="mt-8">
              <Link
                href={bookingCtaHref}
                onClick={closeMenu}
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-(--accent) px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
              >
                {bookingCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
