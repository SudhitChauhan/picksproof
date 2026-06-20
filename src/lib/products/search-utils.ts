import { categories } from "@/lib/data";

export type SearchParams = {
  q?: string;
  category?: string;
};

export const QUICK_SEARCHES = [
  { label: "Wireless earbuds", q: "wireless earbuds" },
  { label: "Air fryer", q: "air fryer" },
  { label: "Whey protein", q: "whey protein" },
  { label: "Sunscreen", q: "sunscreen" },
  { label: "Power bank", q: "power bank" }
] as const;

const PLACEHOLDERS: Record<string, string> = {
  all: "Try wireless earbuds, air fryer, whey protein…",
  "electronics-tech": "Noise-cancelling earbuds, power bank, smartwatch…",
  "home-kitchen": "Mixer grinder, air fryer, water purifier…",
  "beauty-wellness": "Sunscreen, serum, hair oil, face wash…",
  "apparel-jewellery": "Running shoes, polo shirt, jewellery…",
  "health-fitness-sports": "Dumbbells, protein powder, yoga mat…"
};

export function getSearchPlaceholder(category?: string) {
  if (!category || category === "all") return PLACEHOLDERS.all;
  return PLACEHOLDERS[category] ?? PLACEHOLDERS.all;
}

export function isValidCategorySlug(slug: string | undefined) {
  if (!slug) return false;
  return categories.some((cat) => cat.slug === slug);
}

export function buildProductHref(slug: string) {
  return `/products/${slug}`;
}

export function buildSearchHref({ q, category }: SearchParams) {
  const params = new URLSearchParams();
  const trimmed = q?.trim();

  if (trimmed) params.set("q", trimmed);
  if (category && category !== "all" && isValidCategorySlug(category)) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function getCategoryTitle(slug: string | undefined) {
  if (!slug) return null;
  return categories.find((cat) => cat.slug === slug)?.title ?? null;
}
