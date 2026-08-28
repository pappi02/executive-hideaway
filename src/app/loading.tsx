export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f3efe6] px-5 text-[#0b0b0a]" aria-label="Loading">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#80683c]" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/55">Executive Hideaway</span>
          <span className="h-px w-8 bg-[#80683c]" />
        </div>
        <div className="mt-8 h-px w-16 overflow-hidden bg-black/10" aria-hidden="true">
          <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] bg-[#80683c]" />
        </div>
        <p className="mt-5 text-[8px] uppercase tracking-[0.25em] text-black/25">Preparing your experience</p>
      </div>
      <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(200%); } }`}</style>
    </main>
  );
}
