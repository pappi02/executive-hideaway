"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
} from "@/data/gallery";
import GalleryLightbox from "./GalleryLightbox";

type FilterId = GalleryCategory | "all";

export default function GalleryExplorer() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const filteredImages = useMemo(
    () =>
      activeFilter === "all"
        ? galleryImages
        : galleryImages.filter((image) => image.category === activeFilter),
    [activeFilter],
  );

  const openLightbox = (
    index: number,
    trigger: HTMLButtonElement | null,
  ) => {
    lastTriggerRef.current = trigger;
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    lastTriggerRef.current?.focus();
  };

  return (
    <section
      id="gallery-grid"
      className="bg-[#f3efe6] px-5 py-10 text-[#0b0b0a] sm:px-8 sm:py-14 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Filters */}
        <div
          className="flex flex-wrap gap-2 sm:gap-3"
          role="group"
          aria-label="Filter gallery by category"
        >
          <FilterPill
            label="All"
            count={galleryImages.length}
            isActive={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />

          {galleryCategories.map((category) => (
            <FilterPill
              key={category.id}
              label={category.label}
              count={
                galleryImages.filter((img) => img.category === category.id)
                  .length
              }
              isActive={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
            />
          ))}
        </div>

        {/* Masonry grid */}
        <div
          key={activeFilter}
          className="mt-8 columns-2 gap-3 sm:mt-10 sm:columns-3 sm:gap-4 lg:columns-4"
        >
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={(event) => openLightbox(index, event.currentTarget)}
              aria-label={`View image: ${image.alt}`}
              className="group relative mb-3 block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[#ddd7ca] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80683c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6] sm:mb-4 sm:rounded-3xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.orientation === "portrait" ? 900 : 1200}
                height={image.orientation === "portrait" ? 1150 : 900}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <p className="mt-10 text-sm text-black/45">
            No images in this category yet.
          </p>
        )}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}

function FilterPill({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
        isActive
          ? "border-[#80683c] bg-[#80683c] text-white"
          : "border-black/10 text-black/55 hover:border-[#80683c]/40 hover:text-[#0b0b0a]"
      }`}
    >
      {label}
      <span
        className={`text-[9px] ${isActive ? "text-white/70" : "text-black/35"}`}
      >
        {count}
      </span>
    </button>
  );
}
