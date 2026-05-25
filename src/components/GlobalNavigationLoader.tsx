"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, TrendingUp } from "lucide-react";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldShowForAnchor(anchor: HTMLAnchorElement) {
  if (anchor.target || anchor.hasAttribute("download")) {
    return false;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  const destination = new URL(anchor.href);
  const current = new URL(window.location.href);

  if (destination.origin !== current.origin) {
    return false;
  }

  return destination.pathname !== current.pathname || destination.search !== current.search;
}

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    queueMicrotask(() => {
      setIsLoading(false);
    });
  }, [pathname]);

  useEffect(() => {
    function startLoading() {
      setIsLoading(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 8000);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a");

      if (anchor instanceof HTMLAnchorElement && shouldShowForAnchor(anchor)) {
        startLoading();
      }
    }

    function handleSubmit(event: SubmitEvent) {
      if (!event.defaultPrevented) {
        startLoading();
      }
    }

    function stopLoading() {
      setIsLoading(false);
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    window.addEventListener("pageshow", stopLoading);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      window.removeEventListener("pageshow", stopLoading);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="h-1 w-full overflow-hidden bg-emerald-100/80">
        <div className="h-full w-1/3 animate-[navigation-loader_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 via-orange-400 to-emerald-600" />
      </div>
      <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-admin-line bg-white/90 px-4 py-3 text-sm font-black text-admin-ink shadow-[0_18px_60px_rgba(16,42,67,0.18)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-white">
        <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          <TrendingUp className="size-4" />
        </span>
        Loading your next pick
        <Loader2 className="size-4 animate-spin text-emerald-600" />
      </div>
    </div>
  );
}
