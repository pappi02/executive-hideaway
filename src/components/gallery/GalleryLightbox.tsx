"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/data/gallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const image = images[index];
  const total = images.length;

  const goNext = () => onNavigate((index + 1) % total);
  const goPrevious = () => onNavigate((index - 1 + total) % total);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const deltaX = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goNext();
      else goPrevious();
    }

    touchStartX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${image.alt} — image ${index + 1} of ${total}`}
      className="fixed inset-0 z-100 flex flex-col bg-black/92 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:bg-white hover:text-[#0b0b0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center px-3 pb-4 sm:px-6">
        <button
          type="button"
          onClick={goPrevious}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-[#0b0b0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex sm:left-6"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>

        <div className="relative h-full max-h-[75svh] w-full max-w-5xl">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-[#0b0b0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex sm:right-6"
        >
          <ArrowRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Caption + mobile nav */}
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-8">
        <p className="max-w-md text-[11px] leading-5 text-white/50 sm:text-xs">
          {image.alt}
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous image"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white"
          >
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
