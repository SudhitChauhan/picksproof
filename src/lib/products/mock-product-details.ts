import type { ProductDetails } from "@/lib/products/product-details-types";

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetails> = {
  "philips-air-fryer-na120-00": {
    id: "mock-philips-na120",
    slug: "philips-air-fryer-na120-00",
    categorySlug: "home-kitchen",

    name: "PHILIPS Air Fryer NA120/00, Rapid Air Technology, 1500W, 4.2L",
    category: "AIR FRYERS",
    brand: "PHILIPS",
    model: "NA120/00",
    warranty: "2 Year Warranty",

    image: "",

    recommendation: {
      label: "Should buy",
      confidence: 8.4,
      dataPoints: 7642
    },

    pricing: {
      currentPrice: 8999,
      originalPrice: 12995,
      discountPercent: 31,
      affiliateUrl: "https://www.amazon.in/dp/example"
    },

    scores: [
      { title: "Performance", score: 8.6 },
      { title: "Reliability", score: 7.9 },
      { title: "Value", score: 7.2 },
      { title: "Comfort", score: 8.0 },
      { title: "Maintenance", score: 6.8 },
      { title: "Trust", score: 8.3 }
    ],

    whyBuy: [
      "Consistently even cooking across fries, chicken, and reheated meals",
      "Low long-term failure rate in verified buyer cohorts",
      "Strong buyer satisfaction for daily 2–3 meal use",
      "Useful HomeID companion app with guided recipes"
    ],

    whyAvoid: [
      "Non-stick coating wear visible after heavy daily use",
      "Basket latch mechanism feels less premium than higher-tier models"
    ],

    bestFor: [
      "Small households cooking 2–3 times a day",
      "Daily home cooks who want faster weeknight meals",
      "First-time air fryer users upgrading from microwave reheating"
    ],

    notFor: [
      "Large families needing single-batch capacity for 5+ servings",
      "Heavy batch cooking or meal-prep workflows",
      "Users expecting fully dishwasher-safe removable parts"
    ],

    ownershipSummary:
      "Owners at the 12+ month mark report stable performance with recurring complaints primarily around coating wear and basket latch durability rather than heating failure.",

    hiddenIssues: [
      "Pan latch loosens after prolonged daily usage — more common after 9–12 months of heavy use."
    ],

    pros: [
      "Even cooking with Rapid Air technology",
      "Lower energy consumption vs conventional ovens",
      "Useful recipe ecosystem via HomeID app"
    ],

    cons: [
      "Non-stick coating wear over time",
      "Basket latch durability concerns at high usage"
    ],

    complaints: [
      { title: "Non-stick coating scratches or peels", severity: "Common" },
      { title: "Basket latch loosens over time", severity: "Occasional" },
      { title: "Touch panel responsiveness issues", severity: "Rare" }
    ],

    personas: [
      {
        persona: "Daily home cook",
        score: 9.1,
        description: "Ideal for quick weeknight meals and reheating without oil-heavy cooking."
      },
      {
        persona: "Bachelor / small household",
        score: 8.7,
        description: "4.2L capacity suits 1–2 people with minimal counter footprint."
      },
      {
        persona: "Large family",
        score: 5.4,
        description: "Batch size limits make multi-portion cooking inefficient."
      },
      {
        persona: "Air fryer beginner",
        score: 8.5,
        description: "12 presets and app guidance lower the learning curve."
      }
    ],

    specificationGroups: [
      {
        category: "Performance",
        specs: [
          { label: "Wattage", value: "1500W" },
          { label: "Capacity", value: "4.2 L" },
          { label: "Cooking modes", value: "12 presets" }
        ]
      },
      {
        category: "Build",
        specs: [
          { label: "Colour", value: "Black" },
          { label: "Control method", value: "Touch" },
          { label: "Country of origin", value: "China" }
        ]
      },
      {
        category: "Ownership",
        specs: [
          { label: "Warranty", value: "2 years" },
          { label: "App support", value: "HomeID app" }
        ]
      }
    ],

    about: `Cook with up to 90% less fat using patented Rapid Air technology and a starfish-design pan for even results without flipping.

Key highlights:
- Rapid Air circulation for crispy exteriors with minimal oil
- 4.2L basket suited to small households and daily use
- 12 cooking presets for fries, chicken, baking, and reheating
- HomeID app with guided recipes and cooking tips`,

    sources: [
      { sourceName: "Amazon.in verified reviews", count: 7500 },
      { sourceName: "r/IndianKitchenGadgets", count: 142 },
      { sourceName: "Long-term teardown — Tech Origin" },
      { sourceName: "Expert reviews", count: 18 },
      { sourceName: "YouTube long-term reviews", count: 24 },
      { sourceName: "Warranty claim reports", count: 89 }
    ]
  }
};

export function getMockProductDetails(slug: string): ProductDetails | null {
  return MOCK_PRODUCT_DETAILS[slug] ?? null;
}
