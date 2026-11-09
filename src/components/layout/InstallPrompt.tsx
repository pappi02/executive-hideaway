"use client";

import { Plus, Share, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Chromium's install event; not yet in the DOM typings. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PromptKind = "native" | "ios";

const DISMISS_KEY = "hideaway-install-dismissed-at";
const DISMISS_DAYS = 14;
// Long enough that it never covers the first thing a visitor came to do.
const SHOW_DELAY_MS = 45000;
// Pages with a form to finish: a pop-up here hides fields and buttons.
const HIDDEN_ON = ["/admin", "/booking", "/accommodation/request"];

function recentlyDismissed() {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY));
    return Boolean(at) && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Private mode or blocked storage: the prompt simply returns next visit.
  }
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch support gives it away.
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

/**
 * Invites visitors to install the site as an app on their home screen.
 * Android and desktop Chrome/Edge get a one-tap Install button (the browser's
 * own install dialog); iPhone and iPad get the Share → Add to Home Screen steps,
 * since Safari offers no install API.
 */
export default function InstallPrompt() {
  const pathname = usePathname();
  const [kind, setKind] = useState<PromptKind | null>(null);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    }

    if (isStandalone() || recentlyDismissed()) return;

    let timer: number | undefined;
    const showAfterDelay = (next: PromptKind) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setKind(next), SHOW_DELAY_MS);
    };

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      showAfterDelay("native");
    };
    const onInstalled = () => {
      setKind(null);
      setDeferred(null);
    };

    if (isIOS()) {
      showAfterDelay("ios");
    } else {
      window.addEventListener("beforeinstallprompt", onBeforeInstall);
    }
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!kind || HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

  const dismiss = () => {
    rememberDismissal();
    setKind(null);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    setKind(null);
    if (outcome === "dismissed") rememberDismissal();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-body"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-80 mx-auto max-w-md animate-[install-in_0.4s_ease-out] rounded-2xl border border-white/10 bg-[#141413]/95 p-4 text-[#f5f1e8] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-5"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute right-1.5 top-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={16} strokeWidth={1.8} />
      </button>

      <div className="flex items-start gap-4 pr-6">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={192}
          height={192}
          className="h-12 w-12 shrink-0 rounded-xl"
        />
        <div className="min-w-0">
          <p id="install-title" className="text-[15px] font-medium leading-5">
            Get the Hideaway app
          </p>
          {kind === "native" ? (
            <p id="install-body" className="mt-1 text-xs leading-5 text-white/55">
              Install it on your home screen for one-tap booking, the resort menu and rooms. No app store needed.
            </p>
          ) : (
            <p id="install-body" className="mt-1 text-xs leading-5 text-white/55">
              Add it to your home screen: tap{" "}
              <Share size={13} strokeWidth={1.8} className="inline -mt-0.5 text-(--accent-light)" aria-label="Share" />{" "}
              <span className="text-white/80">Share</span> below, then{" "}
              <Plus size={13} strokeWidth={1.8} className="inline -mt-0.5 rounded-[3px] border border-current text-(--accent-light)" aria-hidden="true" />{" "}
              <span className="text-white/80">Add to Home Screen</span>.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2.5">
        {kind === "native" && (
          <button
            type="button"
            onClick={install}
            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-(--accent) px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-colors hover:bg-(--accent-light)"
          >
            Install app
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-white/15 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/30 hover:text-white"
        >
          {kind === "native" ? "Not now" : "Got it"}
        </button>
      </div>
    </div>
  );
}
