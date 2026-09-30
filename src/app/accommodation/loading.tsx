export default function AccommodationLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f3efe6] px-5 text-[#0b0b0a]" aria-busy="true" aria-live="polite">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Loading accommodation details</p>
    </main>
  );
}