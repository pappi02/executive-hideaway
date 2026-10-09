import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Browse photos of Executive Hideaway Resort & Spa in Nairobi — barbering, spa treatments, massage, wellness, and the space itself.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main>
        <GalleryHero />

        <GalleryExplorer />

        <section className="bg-[#0b0b0a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[7px] font-semibold uppercase tracking-[0.24em] text-white/40">
                Ready when you are
              </p>
              <h2 className="mt-1.5 text-[1.8rem] font-light leading-none tracking-[-0.045em]">
                See it for yourself.
              </h2>
            </div>

            <Link
              href="/booking"
              className="group inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-(--accent) px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-transform duration-300 hover:scale-[1.02]"
            >
              Book an appointment
              <ArrowUpRight
                size={13}
                strokeWidth={2}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
