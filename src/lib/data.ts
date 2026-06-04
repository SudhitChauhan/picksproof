export type Category = {
  slug: string;
  title: string;
  description: string;
  hero: string;
};

export const categories: Category[] = [
  {
    slug: "electronics-tech",
    title: "Electronics & Tech Accessories",
    description:
      "Mobile accessories, wireless earbuds, smartwatches, power banks, laptop gear, and everyday tech — ranked by specs and value.",
    hero: "India’s #1 affiliate category: the tech accessories that sell year-round."
  },
  {
    slug: "home-kitchen",
    title: "Home & Kitchen Appliances",
    description:
      "Mixers, grinders, air fryers, water purifiers, and smart home tools — compared for reliability, delivery value, and daily use.",
    hero: "Kitchen and home upgrades Indians buy most on Amazon.in."
  },
  {
    slug: "beauty-wellness",
    title: "Beauty & Wellness",
    description:
      "Skincare, sunscreens, hair treatments, and clean beauty — with focus on natural, Ayurvedic, and repeat-buy favourites.",
    hero: "Beauty picks that earn trust through ingredients and results."
  },
  {
    slug: "apparel-jewellery",
    title: "Apparel, Footwear & Jewellery",
    description:
      "Everyday fashion, sportswear, cargo and polos, plus custom and demi-fine jewellery — curated for fit, quality, and price.",
    hero: "Fashion and jewellery that balance style with Amazon.in value."
  },
  {
    slug: "health-fitness-sports",
    title: "Health, Fitness & Sports Equipment",
    description:
      "Whey protein, creatine, home workout gear, and outdoor sports equipment — scored for safety, durability, and real-world use.",
    hero: "Fitness and sports gear for home gyms and active lifestyles."
  }
];

export function getCategory(slug: string) {
  return categories.find((cat) => cat.slug === slug);
}
