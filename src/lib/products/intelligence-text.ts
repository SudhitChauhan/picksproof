/** Join/split newline-delimited bullet lists for intelligence text fields. */
export function linesToList(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function listToLines(items: string[]): string {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

export const SHOULD_BUY_LABELS: Record<"buy" | "conditional" | "avoid", string> = {
  buy: "Should buy",
  conditional: "Conditional",
  avoid: "Avoid"
};

export const COMPLAINT_FREQUENCY_UI: Record<
  "rare" | "occasional" | "common" | "very_common",
  "Rare" | "Occasional" | "Common"
> = {
  rare: "Rare",
  occasional: "Occasional",
  common: "Common",
  very_common: "Common"
};

export const EVIDENCE_SOURCE_TYPES = [
  "amazon_reviews",
  "reddit",
  "youtube",
  "forum",
  "expert_review",
  "editorial",
  "survey",
  "other"
] as const;

export type EvidenceSourceType = (typeof EVIDENCE_SOURCE_TYPES)[number];

export const COMPLAINT_FREQUENCIES = ["rare", "occasional", "common", "very_common"] as const;
export const COMPLAINT_SEVERITIES = ["minor", "moderate", "major", "dealbreaker"] as const;
