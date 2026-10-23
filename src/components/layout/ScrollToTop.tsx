"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resetScroll = () => {
      const root = document.documentElement;
      const hash = window.location.hash.slice(1);
      // A link to a section (e.g. a poster pop-up opening /services#offer-...)
      // lands on that section, re-aligned as images above it load.
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (hash && !target) return;
      root.style.scrollBehavior = "auto";
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.style.scrollBehavior = "";
    };

    resetScroll();

    const frame = window.requestAnimationFrame(resetScroll);
    const pageShow = () => resetScroll();
    const load = () => resetScroll();
    const deferredReset = window.setTimeout(resetScroll, 0);
    const settledReset = window.setTimeout(resetScroll, 500);

    window.addEventListener("pageshow", pageShow);
    window.addEventListener("load", load);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(deferredReset);
      window.clearTimeout(settledReset);
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("load", load);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  return null;
}