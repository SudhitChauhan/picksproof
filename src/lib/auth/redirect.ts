const AUTH_PREFIXES = ["/login", "/register", "/auth"];

export function getSafeNextPath(value: string | undefined | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "";

  const pathname = value.split("?")[0] ?? value;
  if (AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "";
  }

  return value;
}

export function buildLoginHref(nextPath?: string | null) {
  const next = getSafeNextPath(nextPath);
  if (!next) return "/login";
  return `/login?next=${encodeURIComponent(next)}`;
}

export function buildRegisterHref(nextPath?: string | null) {
  const next = getSafeNextPath(nextPath);
  if (!next) return "/register";
  return `/register?next=${encodeURIComponent(next)}`;
}
