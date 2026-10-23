import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { posterDetailsUrl, posterImageSrc, posterStatus, type PosterStatus } from "@/lib/posters";
import { formatNairobi } from "@/lib/poster-time";
import { DeletePosterButton, PosterPreviewButton, TogglePosterButton } from "./PosterControls";

const STATUS_STYLE: Record<PosterStatus, string> = {
  live: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-sky-100 text-sky-800",
  paused: "bg-amber-100 text-amber-800",
  ended: "bg-black/5 text-black/45",
};

export default async function AdminPostersPage() {
  await requireAdmin();
  const posters = await prisma.poster.findMany({
    orderBy: [{ endsAt: "desc" }],
    take: 100,
    omit: { imageData: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-light tracking-[-0.03em]">Posters / pop-ups</h1>
        <Link
          href="/admin/posters/new"
          className="shrink-0 rounded-full bg-(--accent) px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          New poster
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-black/55">
        Promotional posters that pop up on the website a few seconds after a visitor arrives. Each poster shows once a day on
        each device while it runs, and tapping it opens its offer details at the top of the services page. Times are Nairobi time.
      </p>

      {posters.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/55">No posters yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {posters.map((poster) => {
            const status = posterStatus(poster);
            const src = posterImageSrc(poster);
            return (
              <li key={poster.id} className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of any stored image */}
                <img src={src} alt="" className="h-28 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/posters/${poster.id}`} className="font-medium hover:underline">
                      {poster.title}
                    </Link>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_STYLE[status]}`}>
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-black/55">
                    {formatNairobi(poster.startsAt)} → {formatNairobi(poster.endsAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-black/45">
                    Shows after {poster.delaySeconds}s ·{" "}
                    {poster.autoCloseSeconds ? `closes after ${poster.autoCloseSeconds}s` : "stays until closed"} · priority{" "}
                    {poster.priority}
                    {poster.linkUrl ? ` · button goes to ${poster.linkUrl}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Link href={`/admin/posters/${poster.id}`} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/55 hover:text-black">
                      Edit
                    </Link>
                    {status === "live" && (
                      <Link href={posterDetailsUrl(poster.id)} target="_blank" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/55 hover:text-black">
                        View offer
                      </Link>
                    )}
                    <PosterPreviewButton title={poster.title} imageUrl={src} autoCloseSeconds={poster.autoCloseSeconds} />
                    {status !== "ended" && <TogglePosterButton id={poster.id} active={poster.active} />}
                    <DeletePosterButton id={poster.id} title={poster.title} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
