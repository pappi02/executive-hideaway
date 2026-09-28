"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastContextValue {
  showToast: (message: string) => void;
  showToastAndRedirect: (message: string, redirectTo: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const present = useCallback((next: string) => {
    setMessage(next);
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 2600);
  }, []);

  const showToast = useCallback(
    (next: string) => {
      present(next);
    },
    [present],
  );

  // The redirect timer lives here, in the layout-level provider, rather than
  // in the form's own component — Next.js Server Actions trigger an
  // automatic refresh of the current route right after the action
  // resolves, which can unmount the form (and any setTimeout it owns)
  // before a locally-scheduled redirect ever fires. This provider stays
  // mounted across navigation within /admin, so the timer survives.
  const showToastAndRedirect = useCallback(
    (next: string, redirectTo: string) => {
      present(next);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      redirectTimer.current = setTimeout(() => {
        router.push(redirectTo);
      }, 900);
    },
    [present, router],
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showToastAndRedirect }}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center px-5"
      >
        <div
          className={`flex items-center gap-3 rounded-xl bg-[#0b0b0a] px-5 py-4 text-left shadow-2xl transition-all duration-300 ${
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
          }`}
        >
          <Tick animate={visible} />
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
            {message}
          </span>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function Tick({ animate }: { animate: boolean }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--accent)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 12.5L9.5 18L20 6"
          stroke="#0b0b0a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={animate ? 0 : 1}
          style={{ transition: "stroke-dashoffset 420ms ease 120ms" }}
        />
      </svg>
    </span>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
