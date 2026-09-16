
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    label: "Gallery",
    href: "/#gallery",
  },
  {
    label: "Contact",
    href: "/contact",
    page: "/contact",
  },
];

export default function Navbar({ tone = "light" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDark = tone === "dark";

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
        className={`fixed inset-x-0 top-0 z-60 ${
          isDark
            ? "bg-[#f3efe6]/90 backdrop-blur-sm"
            : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMenu}
            className={`relative z-70 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              isDark ? "text-[#0b0b0a]" : "text-white"
            }`}
          >
            Executive
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-8" aria-label="Main navigation">
              {visibleNavItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-(--accent) ${
                      isDark ? "text-[#0b0b0a]" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {pathname !== "/booking" && (
              <Link
                href="/booking"
                className="flex min-h-10 items-center justify-center rounded-full bg-(--accent) px-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
              >
                Book Appointment
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
            className={`relative z-70 flex h-13 w-13 cursor-pointer items-center justify-center bg-transparent backdrop-blur-md transition-colors duration-300 sm:h-11 sm:w-11 lg:hidden ${
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
        className={`fixed inset-x-0 top-0 z-50 h-[60svh] overflow-y-auto bg-[#0b0b0a] transition-all duration-300 lg:hidden ${
          menuOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex min-h-full flex-col px-5 pb-7 pt-24 sm:px-8 sm:pt-28">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="text-2xl font-light leading-none tracking-[-0.02em] text-white transition-colors hover:text-(--accent)"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Booking CTA */}
          {pathname !== "/booking" && (
            <div className="mt-auto">
              <Link
                href="/booking"
                onClick={closeMenu}
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-(--accent) px-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
