export type Category = {
  slug: string;
  title: string;
  description: string;
  hero: string;
};

export const categories: Category[] = [
  {
    slug: "best-laptops",
    title: "Best Laptops",
    description: "Portable workhorses ranked by performance, battery life, build quality, and value.",
    hero: "Find the right laptop for work, study, travel, or creative projects."
  },
  {
    slug: "smartphones",
    title: "Smartphones",
    description: "Top picks for every budget — from flagship flagships to value-packed daily drivers.",
    hero: "The right phone for your pocket, lifestyle, and budget."
  },
  {
    slug: "electronics",
    title: "Electronics",
    description: "Everyday tech picks with clear spec breakdowns and side-by-side tradeoffs.",
    hero: "Compare the gadgets that actually improve your setup."
  },
  {
    slug: "audio",
    title: "Audio",
    description: "Headphones, earbuds, and speakers — ranked for sound, comfort, and value.",
    hero: "Hear the difference before you buy."
  },
  {
    slug: "home",
    title: "Home",
    description: "Useful home upgrades reviewed for reliability, ease of use, and long-term cost.",
    hero: "Upgrade your home with products that earn their counter space."
  },
  {
    slug: "fitness",
    title: "Fitness",
    description: "Home gym, recovery, and wearable picks scored for durability and practical value.",
    hero: "Build a better routine with gear that fits your budget and space."
  }
];

export function getCategory(slug: string) {
  return categories.find((cat) => cat.slug === slug);
}
