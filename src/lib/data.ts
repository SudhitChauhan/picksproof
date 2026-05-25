export type ScoreMetric = {
  label: string;
  score: number;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  priceLabel: string;
  image: string;
  badge: string;
  tagline: string;
  summary: string;
  rating: number;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  scores: ScoreMetric[];
  testedNotes: string[];
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  hero: string;
  filters: {
    price: string[];
    brand: string[];
    features: string[];
  };
};

export type Comparison = {
  slug: string;
  title: string;
  productSlugs: string[];
  verdict: string;
  winnerSlug: string;
};

export const categories: Category[] = [
  {
    slug: "best-laptops",
    title: "Best Laptops",
    description: "Portable workhorses ranked by performance, battery life, build quality, and value.",
    hero: "Find the right laptop for work, study, travel, or creative projects without reading 40 tabs.",
    filters: {
      price: ["Under $800", "$800-$1,500", "$1,500+"],
      brand: [],
      features: ["Long battery", "Creator GPU", "Lightweight"]
    }
  },
  {
    slug: "electronics",
    title: "Electronics",
    description: "Everyday tech picks with clear testing notes and side-by-side tradeoffs.",
    hero: "Compare the gadgets that actually improve your setup.",
    filters: {
      price: ["Under $100", "$100-$300", "$300+"],
      brand: [],
      features: ["Wireless", "Smart home", "Travel-ready"]
    }
  },
  {
    slug: "fitness",
    title: "Fitness",
    description: "Home gym, recovery, and wearable picks scored for durability and practical value.",
    hero: "Build a better routine with gear that fits your budget and space.",
    filters: {
      price: ["Under $50", "$50-$200", "$200+"],
      brand: ["Kinetic", "Stride", "CoreForm"],
      features: ["Compact", "App connected", "Beginner friendly"]
    }
  },
  {
    slug: "home",
    title: "Home",
    description: "Useful home upgrades reviewed for reliability, ease of use, and long-term cost.",
    hero: "Upgrade your home with products that earn their counter space.",
    filters: {
      price: ["Under $75", "$75-$250", "$250+"],
      brand: ["Haven", "BrightNest", "Purely"],
      features: ["Energy saving", "Quiet", "Low maintenance"]
    }
  }
];

export const products: Product[] = [];

export const comparisons: Comparison[] = [];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getComparison(slug: string) {
  return comparisons.find((comparison) => comparison.slug === slug);
}
