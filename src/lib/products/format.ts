export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${n.toLocaleString("en-IN")}+`;
  return String(n);
}

export function truncateBreadcrumb(text: string, maxLength = 28) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function scoreBarTone(score: number): "high" | "mid" | "low" {
  if (score >= 8) return "high";
  if (score >= 7) return "mid";
  return "low";
}
