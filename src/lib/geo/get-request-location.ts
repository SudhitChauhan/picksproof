import type { NextRequest } from "next/server";
import { formatUserLocation } from "@/lib/geo/format-location";

export function getLocationFromHeaders(headers: Headers) {
  return formatUserLocation({
    city: headers.get("x-vercel-ip-city") ?? headers.get("cf-ipcity"),
    region: headers.get("x-vercel-ip-country-region") ?? headers.get("cf-region"),
    country: headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry")
  });
}

function isLocalIp(ip: string) {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.")
  );
}

async function getLocationFromIp(ip: string): Promise<string | null> {
  if (isLocalIp(ip)) return null;

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,countryCode`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      countryCode?: string;
    };

    if (data.status !== "success") return null;

    return formatUserLocation({
      city: data.city,
      region: data.regionName,
      country: data.countryCode
    });
  } catch {
    return null;
  }
}

export async function getRequestLocation(request: NextRequest) {
  const fromHeaders = getLocationFromHeaders(request.headers);
  if (fromHeaders) return fromHeaders;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "";

  if (!ip) return null;

  return getLocationFromIp(ip);
}
