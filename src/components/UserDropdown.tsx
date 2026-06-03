"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

type Props = {
  email: string;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
};

export function UserDropdown({ email, isAdmin, logoutAction }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const username = email.split("@")[0];
  const initial = username[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-row items-center gap-2 rounded-pill border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-canvas hover:border-ink cursor-pointer"
      >
        {/* Avatar */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-canvas text-xs font-black">
          {initial}
        </span>
        {/* Username */}
        <span className="max-w-[100px] truncate">{username}</span>
        {/* Chevron */}
        <ChevronDown
          size={13}
          className={`shrink-0 text-slate transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[220px] rounded-[20px] border border-line bg-white p-2 shadow-[var(--shadow-md)]"
          style={{ animation: "dropdown-in 0.15s ease" }}
          role="menu"
        >
          {/* Identity header */}
          <div className="flex items-center gap-3 border-b border-line px-3 pb-3 pt-2 mb-1.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas text-base font-black">
              {initial}
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-sm font-bold text-ink">{username}</strong>
              <span className="block truncate text-xs text-slate">{email}</span>
            </div>
          </div>

          {/* Nav items */}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas transition-colors"
          >
            <User size={15} className="shrink-0 text-slate" />
            My Profile
          </Link>

          {isAdmin && (
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas transition-colors"
            >
              <Settings size={15} className="shrink-0 text-slate" />
              Admin Dashboard
            </Link>
          )}

          {/* Divider */}
          <div className="my-1.5 h-px bg-line" />

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={15} className="shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
