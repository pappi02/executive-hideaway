"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="relative z-70 text-sm font-semibold uppercase tracking-[0.2em] text-white"
          >
            Executive
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-70 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10"
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.5} />
            ) : (
              <Menu size={21} strokeWidth={1.5} />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-0 z-50 h-[60svh] overflow-y-auto bg-[#0b0b0a] transition-all duration-300 ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-28 sm:px-8">
          <nav className="flex flex-col gap-7">
            <Link
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-tight text-white transition-colors hover:text-(--accent)"
            >
              About
            </Link>

            <Link
              href="/#experience"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-tight text-white transition-colors hover:text-(--accent)"
            >
              Experience
            </Link>

            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-tight text-white transition-colors hover:text-(--accent)"
            >
              Services
            </Link>

            <Link
              href="/#gallery"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-tight text-white transition-colors hover:text-(--accent)"
            >
              Gallery
            </Link>

            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-tight text-white transition-colors hover:text-(--accent)"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto">
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-(--accent) px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
