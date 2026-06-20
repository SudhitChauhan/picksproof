export type Score = {
  title: string;
  score: number;
};

export type ComplaintSeverity = "Rare" | "Occasional" | "Common";

export type Complaint = {
  title: string;
  severity: ComplaintSeverity;
};

export type PersonaScore = {
  persona: string;
  score: number;
  description: string;
};

export type SpecificationGroup = {
  category: string;
  specs: {
    label: string;
    value: string;
  }[];
};

export type Source = {
  sourceName: string;
  count?: number;
};

export type ProductDetails = {
  id: string;
  slug: string;
  categorySlug: string;

  name: string;
  category: string;
  brand: string;
  model: string;
  warranty: string;

  image: string;

  recommendation: {
    label: string;
    confidence: number;
    dataPoints: number;
  };

  pricing: {
    currentPrice: number;
    originalPrice?: number;
    discountPercent?: number;
    affiliateUrl: string;
  };

  scores: Score[];

  whyBuy: string[];
  whyAvoid: string[];

  bestFor: string[];
  notFor: string[];

  ownershipSummary: string;
  hiddenIssues: string[];

  pros: string[];
  cons: string[];

  complaints: Complaint[];

  personas: PersonaScore[];

  specificationGroups: SpecificationGroup[];

  about: string;

  sources: Source[];
};
