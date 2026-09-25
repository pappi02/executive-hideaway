"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const reasons = [
  {
    title: "A refined environment",
    description:
      "A thoughtfully designed space where premium grooming and personal care feel effortless.",
    shortTitle: "Refined",
  },
  {
    title: "Personal attention",
    description:
      "Your experience should feel personal. We focus on comfort, detail, and the individual behind every appointment.",
    shortTitle: "Personal",
  },
  {
    title: "Time to unwind",
    description:
      "Step away from the pace of everyday life and give yourself time to refresh and recharge.",
    shortTitle: "Unwind",
  },
];

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#0b0b0a] px-5 py-8 text-[#f5f1e8] sm:px-8 sm:py-32 lg:px-10 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full border border-white/4 sm:-right-20 sm:h-120 sm:w-120"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 h-60 w-60 rounded-full border border-white/3 sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Intro */}
        <div className="grid gap-4 lg:grid-cols-[0.55fr_1.45fr] lg:gap-8">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-(--accent)">
              <span className="h-px w-7 bg-(--accent)" />
              Why Executive
            </p>
          </div>
        </div>

        {/* Feature panels */}
        <div className="mt-6 sm:mt-6 lg:mt-8">
          {/* Mobile / tablet cards */}
          <div className="space-y-3 lg:hidden">
            {reasons.map((reason, index) => {
              const active = activeIndex === index;

              return (
                <button
                  key={reason.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group w-full text-left transition-all duration-500 ${
                    active ? "bg-[#171715]" : "bg-white/2.5"
                  }`}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                          active ? "text-(--accent)" : "text-white/35"
                        }`}
                      >
                        {reason.shortTitle}
                      </span>

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                          active
                            ? "border-(--accent) text-(--accent)"
                            : "border-white/10 text-white/40"
                        }`}
                      >
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.4}
                          className={`transition-transform duration-300 ${
                            active ? "translate-x-0.5 -translate-y-0.5" : ""
                          }`}
                        />
                      </span>
                    </div>

                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ${
                        active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <h3 className="pt-8 text-3xl font-light tracking-[-0.035em]">
                          {reason.title}
                        </h3>

                        <p className="max-w-md pt-4 text-sm leading-6 text-white/45">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop panels */}
          <div className="hidden border-t border-white/10 lg:grid lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <article
                key={reason.title}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative min-h-97.5 cursor-default border-b border-white/10 p-8 transition-all duration-500 ${
                  index !== 0 ? "border-l border-white/10" : ""
                } ${
                  activeIndex === index ? "bg-[#171715]" : "bg-transparent"
                }`}
              >
                <div
                  className={`absolute left-8 right-8 top-0 h-px origin-left bg-(--accent) transition-transform duration-500 ${
                    activeIndex === index ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                        activeIndex === index
                          ? "text-(--accent)"
                          : "text-white/30"
                      }`}
                    >
                      {reason.shortTitle}
                    </span>

                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                        activeIndex === index
                          ? "border-(--accent) text-(--accent)"
                          : "border-white/10 text-white/30"
                      }`}
                    >
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.4}
                        className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className="max-w-xs text-3xl font-light leading-[1.05] tracking-[-0.035em] xl:text-4xl">
                      {reason.title}
                    </h3>

                    <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Closing statement */}
          <div className="mt-4 border-t border-white/10 pt-8 sm:mt-8 sm:pt-10 lg:mt-32 lg:flex lg:items-end lg:justify-between">
            <p className="max-w-md text-xs uppercase leading-6 tracking-[0.18em] text-white/30">
              Your time.
              <br />
              Your experience.
              <br />
              Your hideaway.
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40 lg:mt-0 lg:text-right">
              Come in for the grooming. Leave with a renewed sense of yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
