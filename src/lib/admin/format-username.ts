export function formatAdminUsername(email: string) {
  const raw = email.split("@")[0] ?? "Admin";
  const cleaned = raw.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Admin";
  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
