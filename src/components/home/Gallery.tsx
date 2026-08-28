"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const galleryImages = [
  { src: "/images/gallery1.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery2.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery3.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery4.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery5.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery6.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery7.webp", alt: "Executive Hideaway" },
  { src: "/images/gallery8.webp", alt: "Executive Hideaway" },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedImage = galleryImages[selectedIndex];

  const nextImage = useCallback(() => {
    setSelectedIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  }, []);

  const previousImage = useCallback(() => {
    setSelectedIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  }, []);

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") previousImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, previousImage]);

  return (
    <section
      id="gallery"
      className="overflow-hidden bg-[#f3efe6] px-5 py-8 text-[#0b0b0a] sm:px-8 sm:py-32 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
              <span className="h-px w-8 bg-[#80683c]" />
              The gallery
            </p>

            <h2 className="mt-4 max-w-3xl text-5xl font-light leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]">
              Inside the
              <br />
              <span className="text-black/30">Hideaway.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-black/45 lg:text-right">
            A glimpse into the atmosphere, craft, and details that shape the
            Executive Hideaway experience.
          </p>
        </div>

        {/* Main viewer */}
        <div className="mt-12 sm:mt-4 lg:mt-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#ddd7ca] sm:rounded-4xl">
            <div className="relative aspect-4/3 w-full sm:aspect-video lg:aspect-2/1">
              <Image
                key={selectedImage.src}
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                priority={selectedIndex === 0}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/5" />

              <div className="absolute left-100 right-5 top-5 flex items-start justify-between sm:left-7 sm:right-7 sm:top-7">
                

                <span className="text-[9px] font-medium tracking-[0.2em] text-white/60">
                  {String(selectedIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="mt-2 text-lg font-light text-white sm:text-xl">
                    Executive Hideaway Resort & Spa
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black sm:h-11 sm:w-11"
                  >
                    <ArrowLeft size={16} strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black sm:h-11 sm:w-11"
                  >
                    <ArrowRight size={16} strokeWidth={1.4} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="relative mt-4">
            <div
              className="flex gap-2 overflow-x-auto pb-3 scrollbar-none sm:gap-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {galleryImages.map((image, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={image.src}
                    ref={(element) => {
                      thumbnailRefs.current[index] = element;
                    }}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-current={isSelected}
                    className={`group relative shrink-0 overflow-hidden rounded-lg transition-all duration-500 sm:rounded-xl ${
                      isSelected
                        ? "w-24 opacity-100 ring-1 ring-[#80683c] ring-offset-2 ring-offset-[#f3efe6] sm:w-28"
                        : "w-20 opacity-45 hover:opacity-80 sm:w-24"
                    }`}
                  >
                    <div className="relative aspect-4/3">
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition-colors duration-300 ${
                          isSelected ? "bg-transparent" : "bg-black/20"
                        }`}
                      />
                      <span className="absolute bottom-2 left-2 text-[8px] font-medium tracking-[0.15em] text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-[#f3efe6] to-transparent sm:hidden" />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 flex flex-col gap-6 border-t border-black/10 pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">

          <a
            href="/gallery"
            className="group inline-flex items-center gap-4 self-start text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]"
          >
            View full gallery
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-[#0b0b0a] group-hover:text-white">
              <ArrowUpRight size={15} strokeWidth={1.4} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
