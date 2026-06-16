import type { ProductFormInput } from "./schema";

/** Apify / scraper-style Amazon product payload (subset we support). */
export type AmazonScraperProduct = {
  title?: string;
  url?: string;
  asin?: string;
  brand?: string | null;
  stars?: number | null;
  reviewsCount?: number | null;
  features?: string[] | null;
  attributes?: { key: string; value: string }[] | null;
  bestsellerRanks?: { rank: number; category: string }[] | null;
  breadCrumbs?: string | null;
};

/** Attribute keys useful for compare tables and detail specs (no price/seller/reviews). */
const COMPARE_ATTRIBUTE_KEYS: Record<string, string> = {
  "Brand Name": "Product Details",
  "Model Number": "Product Details",
  "Model Name": "Product Details",
  Colour: "Product Details",
  "Country of Origin": "Product Details",
  "Warranty Description": "Product Details",
  "Box Contents": "Product Details",
  "Headphones Ear Placement": "Design",
  "Headphone Form Factor": "Design",
  "Earpiece Shape": "Design",
  "Enclosure Material": "Design",
  "Item Weight Unit of Measure": "Design",
  "Audio Driver Type": "Audio",
  "Audio Driver Size": "Audio",
  "Frequency Range": "Audio",
  "Impedance Unit of Measure": "Audio",
  "Noise Control": "Audio",
  "Audio Latency": "Audio",
  "Bluetooth Version": "Connectivity",
  "Bluetooth Range": "Connectivity",
  "Wireless Technology Type": "Connectivity",
  "Network Connectivity Technology": "Connectivity",
  "Compatible Devices": "Connectivity",
  "Headphone Jack": "Connectivity",
  "Water Resistance Level": "Durability",
  "Battery Average Life": "Battery & Charging",
  "Battery Charge Time": "Battery & Charging",
  "Product Features": "Features",
  "Specific Uses For Product": "Features",
  "Control Type": "Features",
  "Control Method": "Features"
};

const SKIP_ATTRIBUTE_KEYS = new Set([
  "Replacement Reason  Replacement Period  Replacement Policy",
  "Manufacturer",
  "Manufacturer Contact Information",
  "Customer Reviews",
  "Best Sellers Rank",
  "ASIN",
  "Importer Contact Information",
  "Packer Contact Information",
  "Is Autographed",
  "Customer Package Type",
  "Number of Items",
  "Unit Count",
  "Antenna Location",
  "Style Name",
  "Item Type Name"
]);

const MAX_ATTR_VALUE_LEN = 220;

function inferCategory(breadCrumbs: string | null | undefined): string {
  if (!breadCrumbs) return "electronics-tech";
  const lower = breadCrumbs.toLowerCase();
  if (
    lower.includes("beauty") ||
    lower.includes("skin") ||
    lower.includes("hair") ||
    lower.includes("makeup") ||
    lower.includes("personal care")
  ) {
    return "beauty-wellness";
  }
  if (
    lower.includes("clothing") ||
    lower.includes("apparel") ||
    lower.includes("shoe") ||
    lower.includes("jewel") ||
    lower.includes("fashion") ||
    (lower.includes("watch") && lower.includes("wear"))
  ) {
    return "apparel-jewellery";
  }
  if (
    lower.includes("fitness") ||
    lower.includes("sport") ||
    lower.includes("exercise") ||
    lower.includes("nutrition") ||
    lower.includes("supplement")
  ) {
    return "health-fitness-sports";
  }
  if (lower.includes("kitchen") || lower.includes("home") || lower.includes("appliance")) {
    return "home-kitchen";
  }
  if (
    lower.includes("electronic") ||
    lower.includes("computer") ||
    lower.includes("phone") ||
    lower.includes("laptop") ||
    lower.includes("headphone") ||
    lower.includes("earbud") ||
    lower.includes("accessories")
  ) {
    return "electronics-tech";
  }
  return "electronics-tech";
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-+$/, "");
}

function attrValue(key: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_ATTR_VALUE_LEN) return null;
  if (SKIP_ATTRIBUTE_KEYS.has(key)) return null;
  return trimmed;
}

function mapAttributesToSpecs(
  attributes: { key: string; value: string }[] | null | undefined
): ProductFormInput["specs"] {
  if (!attributes?.length) return [];

  const specs: ProductFormInput["specs"] = [];
  let sortOrder = 0;

  for (const { key, value } of attributes) {
    const group = COMPARE_ATTRIBUTE_KEYS[key];
    if (!group) continue;
    const desc = attrValue(key, value);
    if (!desc) continue;
    specs.push({
      specificationTitle: group,
      title: key,
      description: desc,
      sortOrder: sortOrder++
    });
  }

  return specs;
}

function buildDescription(features: string[]): string {
  if (features.length === 0) return "";
  const bullets = features.slice(0, 4).join(". ");
  return bullets.length > 400 ? `${bullets.slice(0, 397)}…` : bullets;
}

/** Parse one object, a JSON array, or multiple objects separated by blank lines. */
export function parseAmazonJsonInput(text: string): AmazonScraperProduct[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item === "object") as AmazonScraperProduct[];
    }
    if (parsed && typeof parsed === "object") {
      return [parsed as AmazonScraperProduct];
    }
  } catch {
    // fall through to block parsing
  }

  const blocks = trimmed.split(/\n\s*\n+/).map((block) => block.trim()).filter(Boolean);
  const results: AmazonScraperProduct[] = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block) as unknown;
      if (Array.isArray(parsed)) {
        results.push(...(parsed.filter((item) => item && typeof item === "object") as AmazonScraperProduct[]));
      } else if (parsed && typeof parsed === "object") {
        results.push(parsed as AmazonScraperProduct);
      }
    } catch {
      continue;
    }
  }

  return results;
}

/** Map scraper JSON → admin form defaults (no price, seller, or review text). */
export function amazonJsonToProductForm(json: AmazonScraperProduct): Partial<ProductFormInput> {
  const title = json.title?.trim() ?? "";
  const features = (json.features ?? []).map((f) => f.trim()).filter(Boolean);

  const attrs = json.attributes ?? [];
  const getAttr = (key: string) =>
    attrs.find((a) => a.key === key)?.value?.trim() ?? "";

  const specsFromFeatures =
    features.length > 0
      ? features.map((f, i) => ({
          specificationTitle: "Highlights",
          title: `Feature ${i + 1}`,
          description: f,
          sortOrder: i
        }))
      : [];

  const specsFromAttrs = mapAttributesToSpecs(attrs);
  const specs = [...specsFromFeatures, ...specsFromAttrs];

  const topBsr = json.bestsellerRanks?.[0];

  return {
    name: title,
    description: buildDescription(features) || title,
    category: inferCategory(json.breadCrumbs),
    slug: slugFromTitle(title),
    amazonAffiliateUrl: json.url?.trim() ?? "",
    asin: json.asin?.trim() ?? "",
    brand: json.brand?.trim() ?? getAttr("Brand Name"),
    features,
    amazonRating: json.stars ?? undefined,
    amazonReviewCount: json.reviewsCount ?? undefined,
    bestsellerRank: topBsr?.rank,
    bestsellerCategory: topBsr?.category ?? "",
    modelNumber: getAttr("Model Number"),
    modelName: getAttr("Model Name"),
    warranty: getAttr("Warranty Description"),
    countryOfOrigin: getAttr("Country of Origin"),
    specs:
      specs.length > 0
        ? specs
        : [{ specificationTitle: "General", title: "", description: "", sortOrder: 0 }]
  };
}
