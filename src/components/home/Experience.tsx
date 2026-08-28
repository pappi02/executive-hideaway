
"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const experiences = [
  {
    number: "01",
    title: "Barbering",
    description:
      "Precision grooming and a polished finish, delivered in an environment designed around your comfort.",
    image: "/images/barbering.png",
    imagePosition: "object-center",
  },
  {
    number: "02",
    title: "Spa & Care",
    description:
      "A space to slow down, refresh, and give yourself the personal care you deserve.",
    image: "/images/spaandcare.png",
    imagePosition: "object-center",
  },
  {
    number: "03",
    title: "Wellness",
    description:
      "Take a moment away from the everyday and enjoy an experience built around relaxation.",
    image: "/images/wellness.jpg",
    imagePosition: "object-center",
  },
];

const AUTOPLAY_DELAY = 3500;
const TRANSITION_DURATION = 700;

export default function Experience() {
  /*
   * We use cloned slides to create a continuous circular belt.
   *
   * Track:
   *
   * [clone 03] [01] [02] [03] [clone 01]
   *             ↑
   *          starts here
   *
   * When the track reaches clone 01, we silently jump back
   * to real 01 after the animation completes.
   */
  const carouselSlides = useMemo(
    () => [
      experiences[experiences.length - 1],
      ...experiences,
      experiences[0],
    ],
    [],
  );

  // Start at index 1 because index 0 is the cloned last slide.
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  /*
   * Move forward through the belt.
   */
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);

    setCurrentSlide((current) => current + 1);
  }, []);

  /*
   * Move backward through the belt.
   */
  const previousSlide = useCallback(() => {
    setIsTransitioning(true);

    setCurrentSlide((current) => current - 1);
  }, []);

  /*
   * Autoplay
   */
  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [isPaused, nextSlide]);

  /*
   * Handle reaching the cloned slides.
   *
   * Track:
   *
   * [clone 03] [01] [02] [03] [clone 01]
   *      0       1    2    3       4
   *
   * If we reach 4, we have visually shown clone 01.
   * We then jump back to 1 without animation.
   *
   * If we reach 0, we have visually shown clone 03.
   * We then jump back to 3 without animation.
   */
  const handleTransitionEnd = () => {
    if (currentSlide === carouselSlides.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
    }

    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(experiences.length);
    }
  };

  /*
   * Restore the animation after an invisible reset.
   */
  useEffect(() => {
    if (!isTransitioning) {
      const frame = window.requestAnimationFrame(() => {
        setIsTransitioning(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  /*
   * Convert the cloned-track index into the real experience index.
   *
   * 1 -> 0
   * 2 -> 1
   * 3 -> 2
   */
  const realSlideIndex =
    (currentSlide - 1 + experiences.length) % experiences.length;

  /*
   * Touch start
   */
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;

    setIsPaused(true);
  };

  /*
   * Touch end
   */
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      setIsPaused(false);
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    const minimumSwipeDistance = 50;

    if (
      Math.abs(deltaX) > minimumSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      /*
       * Swipe left = move forward
       * Swipe right = move backward
       */
      if (deltaX > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;

    setIsPaused(false);
  };

  /*
   * Prevent autoplay from fighting with manual controls.
   */
  const handleManualNavigation = (direction: "next" | "previous") => {
    setIsPaused(true);

    if (direction === "next") {
      nextSlide();
    } else {
      previousSlide();
    };

    /*
     * Resume autoplay after a short interaction window.
     */
    window.setTimeout(() => {
      setIsPaused(false);
    }, 800);
  };

  return (
    <section
      id="experience"
      className="overflow-hidden bg-[#f3efe6] px-5 py-8 text-[#0b0b0a] sm:px-8 sm:py-28 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
            <span className="h-px w-7 bg-[#80683c]" />
            The experience
          </p>

          <h2 className="mt-4 text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Grooming,
            <br />
            <span className="text-black/40">reimagined.</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-black/55 sm:text-base">
            Everything at Executive Hideaway is centered around one simple
            idea: you should leave feeling better than when you arrived.
          </p>
        </div>

        {/* Carousel viewport */}
        <div
          className="relative mt-6 sm:mt-10 lg:mt-12"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full overflow-hidden">
            <div
              className={`flex w-full ${
                isTransitioning
                  ? "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
                  : ""
              }`}
              style={{
                transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
                transitionDuration: isTransitioning
                  ? `${TRANSITION_DURATION}ms`
                  : "0ms",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {carouselSlides.map((experience, index) => (
                <article
                  key={`${experience.number}-${index}`}
                  className="w-full min-w-full shrink-0 grow-0 basis-full"
                >
                  <div className="grid w-full gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">

                    {/* Image */}
                    <div className="relative">
                      <div className="absolute -inset-3 rounded-[1.75rem] bg-[#e8e2d6] blur-xl sm:-inset-5" />

                      <div className="relative h-67.5 overflow-hidden rounded-[1.35rem] sm:h-97.5 sm:rounded-[1.75rem] lg:h-125">
                        <Image
                          src={experience.image}
                          alt={experience.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className={`object-cover ${experience.imagePosition}`}
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0a]/20 via-transparent to-[#f3efe6]/10" />

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#f3efe6]/20 to-transparent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:px-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium tracking-[0.2em] text-black/35">
                          {experience.number}
                        </span>

                        <span className="h-px w-8 bg-[#80683c]/50" />
                      </div>

                      <h3 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                        {experience.title}
                      </h3>

                      <p className="mt-4 max-w-md text-sm leading-7 text-black/55 sm:text-base">
                        {experience.description}
                      </p>

                      <a
                        href="/services"
                        className="group mt-4 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]"
                      >
                        Explore services

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-[#0b0b0a] group-hover:text-white">
                          <ArrowUpRight
                            size={15}
                            strokeWidth={1.5}
                          />
                        </span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {experiences.map((experience, index) => {
                const isActive = realSlideIndex === index;

                return (
                  <button
                    key={experience.number}
                    type="button"
                    aria-label={`Go to ${experience.title}`}
                    aria-current={isActive}
                    onClick={() => {
                      setIsPaused(true);
                      setIsTransitioning(true);
                      setCurrentSlide(index + 1);

                      window.setTimeout(() => {
                        setIsPaused(false);
                      }, 800);
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      isActive
                        ? "w-9 bg-[#80683c]"
                        : "w-2 bg-black/15"
                    }`}
                  />
                );
              })}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualNavigation("previous")}
                aria-label="Previous experience"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.4}
                />
              </button>

              <button
                type="button"
                onClick={() => handleManualNavigation("next")}
                aria-label="Next experience"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.4}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-4 border-t border-black/10 pt-7">
          <a
            href="/services"
            className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#80683c]"
          >
            View all services

            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
