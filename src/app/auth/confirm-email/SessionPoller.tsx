"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Polls /api/auth/session every 3 seconds.
 * When the user clicks the confirmation link (even in another tab),
 * Supabase creates a session cookie; the next poll detects it and
 * auto-redirects to /profile — no password re-entry needed.
 */
export function SessionPoller() {
  const router = useRouter();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Animated dots so the user can see it's actively checking
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);

    const sessionTimer = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const { authenticated } = (await res.json()) as { authenticated: boolean };
        if (authenticated) {
          router.replace("/profile");
        }
      } catch {
        // ignore network hiccups
      }
    }, 3000);

    return () => {
      clearInterval(dotTimer);
      clearInterval(sessionTimer);
    };
  }, [router]);

  return (
    <p
      style={{
        fontSize: "0.8rem",
        color: "var(--dust)",
        margin: "20px 0 0",
        textAlign: "center"
      }}
    >
      Waiting for confirmation{dots}
    </p>
  );
}
