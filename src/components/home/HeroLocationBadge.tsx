"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroLocationBadge() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { location?: string | null } | null) => {
        if (!cancelled && data?.location) {
          setLocation(data.location);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!location) return null;

  return (
    <div className="hero-visual-badge">
      <MapPin aria-hidden className="size-4 shrink-0" />
      <span>Curated specs · {location}</span>
    </div>
  );
}
