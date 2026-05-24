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

export const categories: Category[] = [
  {
    slug: "best-laptops",
    title: "Best Laptops",
    description: "Portable workhorses ranked by performance, battery life, build quality, and value.",
    hero: "Find the right laptop for work, study, travel, or creative projects without reading 40 tabs.",
    filters: {
      price: ["Under $800", "$800-$1,500", "$1,500+"],
      brand: ["Aster", "Nova", "Volt"],
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
      brand: ["EchoLab", "Pulse", "Orbit"],
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

export const products: Product[] = [
  {
    slug: "aster-pro-14",
    name: "Aster Pro 14",
    brand: "Aster",
    categorySlug: "best-laptops",
    categoryName: "Best Laptops",
    priceLabel: "$1,399",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    badge: "Editor's Choice",
    tagline: "Best overall laptop for most people",
    summary: "A balanced premium laptop with the best mix of battery life, display quality, keyboard feel, and sustained speed.",
    rating: 9.2,
    affiliateUrl: "https://www.amazon.com/?tag=yourtag-20",
    pros: ["Excellent battery life", "Bright color-accurate display", "Quiet under normal workloads"],
    cons: ["Limited port selection", "Memory upgrades are expensive"],
    specs: {
      Processor: "12-core hybrid CPU",
      Memory: "16 GB",
      Storage: "1 TB SSD",
      Battery: "15 hours tested",
      Weight: "2.9 lb"
    },
    scores: [
      { label: "Battery Life", score: 9 },
      { label: "Build Quality", score: 9 },
      { label: "Performance", score: 9 },
      { label: "Value", score: 8 }
    ],
    testedNotes: [
      "Looped 4K video playback at 200 nits until shutdown.",
      "Exported a 10-minute 4K timeline three times and averaged completion time.",
      "Measured keyboard deck temperature during a sustained browser workload."
    ]
  },
  {
    slug: "nova-lite-13",
    name: "Nova Lite 13",
    brand: "Nova",
    categorySlug: "best-laptops",
    categoryName: "Best Laptops",
    priceLabel: "$749",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    badge: "Verified Value",
    tagline: "Best budget laptop",
    summary: "A lightweight machine that keeps the basics fast and dependable without paying for premium extras.",
    rating: 8.4,
    affiliateUrl: "https://www.amazon.com/?tag=yourtag-20",
    pros: ["Strong price-to-performance ratio", "Comfortable keyboard", "Easy to carry"],
    cons: ["Dimmer display", "Not ideal for heavy creative apps"],
    specs: {
      Processor: "8-core efficient CPU",
      Memory: "16 GB",
      Storage: "512 GB SSD",
      Battery: "11 hours tested",
      Weight: "2.6 lb"
    },
    scores: [
      { label: "Battery Life", score: 8 },
      { label: "Build Quality", score: 7 },
      { label: "Performance", score: 8 },
      { label: "Value", score: 10 }
    ],
    testedNotes: [
      "Ran 25-tab browsing, video call, and document editing together for two hours.",
      "Checked screen brightness and color consistency with a calibration target.",
      "Tracked fan noise during a browser benchmark loop."
    ]
  },
  {
    slug: "volt-studio-16",
    name: "Volt Studio 16",
    brand: "Volt",
    categorySlug: "best-laptops",
    categoryName: "Best Laptops",
    priceLabel: "$2,099",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    badge: "Premium Pick",
    tagline: "Best laptop for creators",
    summary: "A larger performance-first laptop for video editors, 3D artists, and multitaskers who need headroom.",
    rating: 8.9,
    affiliateUrl: "https://www.amazon.com/?tag=yourtag-20",
    pros: ["Fast GPU acceleration", "Large high-refresh display", "Great speaker system"],
    cons: ["Heavy for daily commuting", "Battery drops quickly under render loads"],
    specs: {
      Processor: "14-core performance CPU",
      Memory: "32 GB",
      Storage: "1 TB SSD",
      Battery: "9 hours tested",
      Weight: "4.4 lb"
    },
    scores: [
      { label: "Battery Life", score: 7 },
      { label: "Build Quality", score: 9 },
      { label: "Performance", score: 10 },
      { label: "Value", score: 7 }
    ],
    testedNotes: [
      "Rendered the same Blender scene across three cold runs.",
      "Exported RAW photo batches with GPU acceleration enabled.",
      "Logged chassis temperature after 30 minutes of sustained rendering."
    ]
  },
  {
    slug: "echolab-buds-air",
    name: "EchoLab Buds Air",
    brand: "EchoLab",
    categorySlug: "electronics",
    categoryName: "Electronics",
    priceLabel: "$129",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    badge: "User Consensus",
    tagline: "Best daily wireless earbuds",
    summary: "Clean sound, reliable controls, and good noise reduction in a pocketable case.",
    rating: 8.6,
    affiliateUrl: "https://www.amazon.com/?tag=yourtag-20",
    pros: ["Stable Bluetooth connection", "Clear calls", "Comfortable for long sessions"],
    cons: ["Case scratches easily", "App EQ is basic"],
    specs: {
      Battery: "7 hours buds / 28 hours case",
      ANC: "Hybrid",
      WaterRating: "IPX4",
      Charging: "USB-C + wireless"
    },
    scores: [
      { label: "Sound", score: 8 },
      { label: "Noise Control", score: 8 },
      { label: "Comfort", score: 9 },
      { label: "Value", score: 9 }
    ],
    testedNotes: [
      "Compared call quality on a busy street recording.",
      "Measured battery drain across three listening sessions.",
      "Checked fit stability during a 30-minute treadmill run."
    ]
  }
];

export const comparisons = [
  {
    slug: "aster-pro-14-vs-nova-lite-13",
    title: "Aster Pro 14 vs. Nova Lite 13",
    productSlugs: ["aster-pro-14", "nova-lite-13"],
    verdict: "Choose the Aster Pro 14 if you want the best screen and all-day battery. Choose the Nova Lite 13 if value matters most and your workload is mostly browser, docs, and calls.",
    winnerSlug: "aster-pro-14"
  }
];

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
