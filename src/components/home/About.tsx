export default function About() {
  return (
    <section
      id="about"
      className="bg-[#0b0b0a] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Label */}
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-(--accent)">
              <span className="h-px w-7 bg-(--accent)" />
              Who we are
            </p>
          </div>

          {/* Content */}
          <div>
            <h2 className="max-w-3xl text-4xl font-light leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              More than grooming.
              <br />
              <span className="text-white/45">It&apos;s an experience.</span>
            </h2>

            <div className="mt-8 max-w-2xl space-y-5 text-sm leading-7 text-white/60 sm:text-base">
              <p>
                Welcome to Executive Hideaway Resort & Spa, a place to stay,
                unwind, and enjoy thoughtful grooming, dining, and wellness.
              </p>

              <p>
                From a room for the night to a moment of personal care, find
                space to make your time in Nairobi your own.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
