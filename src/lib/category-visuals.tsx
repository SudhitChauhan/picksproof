import { Dumbbell, Headphones, Package, Shirt, Sparkles, UtensilsCrossed } from "lucide-react";

/** Hero background images per category (Unsplash). */
export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "electronics-tech":
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=75",
  "home-kitchen":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=75",
  "beauty-wellness":
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=75",
  "apparel-jewellery":
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=75",
  "health-fitness-sports":
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=75"
};

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=75";

export function getCategoryHeroImage(slug: string) {
  return CATEGORY_HERO_IMAGES[slug] ?? DEFAULT_HERO;
}

export function getCategoryIcon(slug: string, size = 20) {
  const props = { size, strokeWidth: size >= 28 ? 1.4 : 1.2 };
  const icons: Record<string, React.ReactNode> = {
    "electronics-tech": <Headphones {...props} />,
    "home-kitchen": <UtensilsCrossed {...props} />,
    "beauty-wellness": <Sparkles {...props} />,
    "apparel-jewellery": <Shirt {...props} />,
    "health-fitness-sports": <Dumbbell {...props} />
  };
  return icons[slug] ?? <Package {...props} />;
}

/** Short label for compact nav (header). */
export function getCategoryNavLabel(title: string) {
  const short: Record<string, string> = {
    "Electronics & Tech Accessories": "Electronics",
    "Home & Kitchen Appliances": "Home & Kitchen",
    "Beauty & Wellness": "Beauty",
    "Apparel, Footwear & Jewellery": "Fashion",
    "Health, Fitness & Sports Equipment": "Fitness"
  };
  return short[title] ?? title;
}
