"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicPoster } from "@/lib/posters";
import { canShowPoster, isEveryVisit, parseSeen, recordShowing } from "@/lib/poster-frequency";
import { nairobiDay } from "@/lib/poster-time";

// The admin console and the booking flow are left alone - a pop-up there gets
// in the way of something the visitor is in the middle of.
const HIDDEN_PREFIXES = ["/admin", "/booking"];

// Each poster shows up to its "times per day" on each device, at least 30
// minutes apart (lib/poster-frequency). The count for the Nairobi day is kept in
// localStorage, so another device starts its own count, and the next day it
// starts again. A poster set to "every visit" instead shows once per browser
// session (sessionStorage): each new visit to the site shows it again.
const seenKey = (id: string) => `hideaway-poster-seen:${id}`;
const visitKey = (id: string) => `hideaway-poster-visit:${id}`;

function seenThisVisit(id: string) {
  try {
    return window.sessionStorage.getItem(visitKey(id)) === "1";
  } catch {
    return false;
  }
}
const FEED_TTL_MS = 5 * 60 * 1000;

function readSeen(id: string) {
  try {
    return parseSeen(window.localStorage.getItem(seenKey(id)));
  } catch {
    return null;
  }
}

function canShowNow(poster: PublicPoster) {
  if (new Date(poster.endsAt).getTime() <= Date.now()) return false;
  if (isEveryVisit(poster.timesPerDay)) return !seenThisVisit(poster.id);
  return canShowPoster(readSeen(poster.id), nairobiDay(), Date.now(), poster.timesPerDay);
}

function markShown(poster: PublicPoster) {
  const id = poster.id;
  try {
    if (isEveryVisit(poster.timesPerDay)) {
      window.sessionStorage.setItem(visitKey(id), "1");
      return;
    }
    window.localStorage.setItem(seenKey(id), JSON.stringify(recordShowing(readSeen(id), nairobiDay(), Date.now())));
  } catch {
    // Storage blocked: it may show again on the next page load - harmless.
  }
}

function isHiddenPath(pathname: string | null) {
  return Boolean(pathname && HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix)));
}

/**
 * The poster itself: the image at up to 85% of the screen each way, a close
 * button, and (when it closes itself) a countdown bar that pauses while the
 * pointer is over it. Shared with the admin preview.
 */
export function PosterView({
  poster,
  onClose,
}: {
  poster: Pick<PublicPoster, "title" | "imageUrl" | "autoCloseSeconds"> & { detailsUrl: string | null };
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // eslint-disable-next-line @next/next/no-img-element -- sized by the viewport, not next/image's fixed widths
  const image = <img src={poster.imageUrl} alt={poster.title} className="block max-h-[85svh] max-w-[90vw] w-auto rounded-xl object-contain shadow-2xl" />;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={poster.title}
      onClick={onClose}
      className="poster-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="group relative" onClick={(event) => event.stopPropagation()}>
        {/* Opens the poster's own section at the top of the services page,
            where the full details and the booking button live. */}
        {poster.detailsUrl ? (
          <Link href={poster.detailsUrl} onClick={onClose} aria-label={`${poster.title} - see details`} className="block">
            {image}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5f1e8]">
              Tap for details
            </span>
          </Link>
        ) : (
          image
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close poster"
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0b0a] text-[#f5f1e8] shadow-lg ring-1 ring-white/20 transition-colors hover:bg-(--accent) hover:text-[#0b0b0a]"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {poster.autoCloseSeconds > 0 && (
          <div className="absolute inset-x-3 bottom-1.5 h-1 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
            <div
              className="poster-countdown h-full bg-(--accent) group-hover:[animation-play-state:paused]"
              style={{ animationDuration: `${poster.autoCloseSeconds}s` }}
              onAnimationEnd={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Site-wide promotional pop-up, mounted once in the root layout. Shows the
 * highest-priority running poster (see /admin/posters) a few seconds after
 * the visitor arrives on a page, up to its times per day on each device.
 */
export default function PosterPopup() {
  const pathname = usePathname();
  const hidden = isHiddenPath(pathname);
  const [shown, setShown] = useState<PublicPoster | null>(null);
  const showingRef = useRef(false);
  const feedRef = useRef<{ at: number; posters: PublicPoster[] } | null>(null);

  // Checked on every page the visitor opens, so a poster allowed several times a
  // day can come back later in the visit (never while one is on screen).
  useEffect(() => {
    if (hidden) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arrivedAt = Date.now();

    const cached = feedRef.current;
    const feed: Promise<PublicPoster[]> =
      cached && Date.now() - cached.at < FEED_TTL_MS
        ? Promise.resolve(cached.posters)
        : fetch("/api/posters/active")
            .then((response) => (response.ok ? response.json() : { data: [] }))
            .then((payload: { data?: PublicPoster[] }) => {
              const posters = payload.data ?? [];
              feedRef.current = { at: Date.now(), posters };
              return posters;
            });

    feed
      .then((posters) => {
        if (cancelled || showingRef.current) return;
        const poster = posters.find(canShowNow);
        if (!poster) return;
        // Loaded before it's shown, so it never pops up as an empty frame.
        const preload = new Image();
        preload.onload = () => {
          if (cancelled) return;
          timer = setTimeout(() => {
            if (cancelled || showingRef.current || !canShowNow(poster)) return;
            markShown(poster);
            showingRef.current = true;
            setShown(poster);
          }, Math.max(0, poster.delaySeconds * 1000 - (Date.now() - arrivedAt)));
        };
        preload.src = poster.imageUrl;
      })
      .catch(() => {
        // No poster this time.
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [hidden, pathname]);

  const close = useCallback(() => {
    showingRef.current = false;
    setShown(null);
  }, []);

  if (!shown || hidden) return null;
  return <PosterView poster={shown} onClose={close} />;
}
