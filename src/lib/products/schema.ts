import { z } from "zod";
import { isCloudinaryImageUrl, isHttpsImageSource } from "@/lib/cloudinary/urls";
import {
  COMPLAINT_FREQUENCIES,
  COMPLAINT_SEVERITIES,
  EVIDENCE_SOURCE_TYPES
} from "@/lib/products/intelligence-text";

const req = (label: string) => z.string().trim().min(1, `${label} is required.`);

const optionalText = z.string().trim().optional().default("");

const productImageUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || isCloudinaryImageUrl(v) || isHttpsImageSource(v), {
    message: "Enter a valid https image URL or upload an image file."
  });

const optionalInt = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().nonnegative().optional()
);

const optionalPrice = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().nonnegative().optional()
);

const optionalRating = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().min(0).max(5).optional()
);

const optionalScore = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().min(0).max(10).optional()
);

export const specItemSchema = z.object({
  specificationTitle: req("Specification group"),
  title: req("Attribute name"),
  description: req("Attribute value"),
  sortOrder: z.number().int().default(0)
});

export type SpecItem = z.infer<typeof specItemSchema>;
export type SpecItemInput = z.input<typeof specItemSchema>;

export const evidenceItemSchema = z.object({
  sourceType: z.enum(EVIDENCE_SOURCE_TYPES),
  sourceName: req("Source name"),
  sourceUrl: optionalText,
  reviewCount: optionalInt,
  notes: optionalText
});

export type EvidenceItem = z.infer<typeof evidenceItemSchema>;

export const prosConsItemSchema = z.object({
  type: z.enum(["pro", "con"]),
  content: req("Content")
});

export type ProsConsItem = z.infer<typeof prosConsItemSchema>;

export const complaintItemSchema = z.object({
  complaint: req("Complaint"),
  frequency: z.enum(COMPLAINT_FREQUENCIES),
  severity: z.enum(COMPLAINT_SEVERITIES).default("moderate")
});

export type ComplaintItem = z.infer<typeof complaintItemSchema>;

export const personaItemSchema = z.object({
  persona: req("Persona"),
  score: optionalScore,
  reason: optionalText
});

export type PersonaItem = z.infer<typeof personaItemSchema>;

export const productFormSchema = z.object({
  name: req("Product name"),
  description: req("Description"),
  category: req("Category"),
  subcategory: optionalText,
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  mainImageUrl: productImageUrl,
  amazonAffiliateUrl: z.string().trim().url("Enter a valid Amazon affiliate URL."),
  price: optionalPrice,
  mrp: optionalPrice,
  launchDate: optionalText,
  asin: optionalText,
  brand: optionalText,
  model: optionalText,
  features: z.array(z.string().trim()).default([]),
  amazonRating: optionalRating,
  amazonReviewCount: optionalInt,
  bestsellerRank: optionalInt,
  bestsellerCategory: optionalText,
  modelNumber: optionalText,
  modelName: optionalText,
  warranty: optionalText,
  countryOfOrigin: optionalText,
  performanceScore: optionalScore,
  reliabilityScore: optionalScore,
  valueScore: optionalScore,
  comfortScore: optionalScore,
  maintenanceScore: optionalScore,
  trustScore: optionalScore,
  confidenceScore: optionalScore,
  shouldBuy: z.enum(["buy", "conditional", "avoid"]).default("conditional"),
  whyBuyText: optionalText,
  whyAvoidText: optionalText,
  bestForText: optionalText,
  notForText: optionalText,
  hiddenIssuesText: optionalText,
  longTermExperience: optionalText,
  evidence: z.array(evidenceItemSchema).default([]),
  prosCons: z.array(prosConsItemSchema).default([]),
  complaints: z.array(complaintItemSchema).default([]),
  personas: z.array(personaItemSchema).default([]),
  specs: z.array(specItemSchema).min(1, "Add at least one specification.")
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormInput = {
  name: "",
  description: "",
  category: "electronics-tech",
  subcategory: "",
  slug: "",
  mainImageUrl: "",
  amazonAffiliateUrl: "",
  price: undefined,
  mrp: undefined,
  launchDate: "",
  asin: "",
  brand: "",
  model: "",
  features: [],
  amazonRating: undefined,
  amazonReviewCount: undefined,
  bestsellerRank: undefined,
  bestsellerCategory: "",
  modelNumber: "",
  modelName: "",
  warranty: "",
  countryOfOrigin: "",
  performanceScore: undefined,
  reliabilityScore: undefined,
  valueScore: undefined,
  comfortScore: undefined,
  maintenanceScore: undefined,
  trustScore: undefined,
  confidenceScore: undefined,
  shouldBuy: "conditional",
  whyBuyText: "",
  whyAvoidText: "",
  bestForText: "",
  notForText: "",
  hiddenIssuesText: "",
  longTermExperience: "",
  evidence: [],
  prosCons: [],
  complaints: [],
  personas: [],
  specs: [
    {
      specificationTitle: "General",
      title: "",
      description: "",
      sortOrder: 0
    }
  ]
};

export const editProductFormSchema = productFormSchema.extend({
  id: z.string().uuid()
});

export type EditProductFormValues = z.infer<typeof editProductFormSchema>;
export type EditProductFormInput = z.input<typeof editProductFormSchema>;

type DbProduct = {
  id?: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string | null;
  slug: string;
  main_image_url: string;
  amazon_affiliate_url: string;
  image?: string | null;
  affiliate_url?: string | null;
  price?: number | null;
  mrp?: number | null;
  launch_date?: string | null;
  asin?: string | null;
  brand?: string;
  model?: string | null;
  features?: string[];
  amazon_rating?: number | null;
  amazon_review_count?: number | null;
  bestseller_rank?: number | null;
  bestseller_category?: string;
  model_number?: string;
  model_name?: string;
  warranty?: string;
  country_of_origin?: string;
};

type DbIntelligence = {
  performance_score?: number | null;
  reliability_score?: number | null;
  value_score?: number | null;
  comfort_score?: number | null;
  maintenance_score?: number | null;
  trust_score?: number | null;
  should_buy?: string | null;
  why_buy?: string | null;
  why_avoid?: string | null;
  best_for?: string | null;
  not_for?: string | null;
  hidden_issues?: string | null;
  long_term_experience?: string | null;
  confidence_score?: number | null;
} | null;

type DbSpec = {
  specification_title: string;
  title: string;
  description: string;
  sort_order: number;
};

type DbEvidence = {
  source_type: string;
  source_name: string;
  source_url?: string | null;
  review_count?: number | null;
  notes?: string | null;
};

type DbProsCons = {
  type: string;
  content: string;
};

type DbComplaint = {
  complaint: string;
  frequency: string;
  severity: string;
};

type DbPersona = {
  persona: string;
  score?: number | null;
  reason?: string | null;
};

export function dbProductToFormInput(
  product: DbProduct,
  specs: DbSpec[],
  intelligence: DbIntelligence = null,
  evidence: DbEvidence[] = [],
  prosCons: DbProsCons[] = [],
  complaints: DbComplaint[] = [],
  personas: DbPersona[] = []
): ProductFormInput | EditProductFormInput {
  const shouldBuy =
    intelligence?.should_buy === "buy" ||
    intelligence?.should_buy === "conditional" ||
    intelligence?.should_buy === "avoid"
      ? intelligence.should_buy
      : "conditional";

  return {
    ...(product.id ? { id: product.id } : {}),
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory ?? "",
    slug: product.slug,
    mainImageUrl: product.image || product.main_image_url || "",
    amazonAffiliateUrl: product.affiliate_url || product.amazon_affiliate_url || "",
    price: product.price ?? undefined,
    mrp: product.mrp ?? undefined,
    launchDate: product.launch_date ?? "",
    asin: product.asin ?? "",
    brand: product.brand ?? "",
    model: product.model || product.model_number || product.model_name || "",
    features: product.features ?? [],
    amazonRating: product.amazon_rating ?? undefined,
    amazonReviewCount: product.amazon_review_count ?? undefined,
    bestsellerRank: product.bestseller_rank ?? undefined,
    bestsellerCategory: product.bestseller_category ?? "",
    modelNumber: product.model_number ?? "",
    modelName: product.model_name ?? "",
    warranty: product.warranty ?? "",
    countryOfOrigin: product.country_of_origin ?? "",
    performanceScore: intelligence?.performance_score ?? undefined,
    reliabilityScore: intelligence?.reliability_score ?? undefined,
    valueScore: intelligence?.value_score ?? undefined,
    comfortScore: intelligence?.comfort_score ?? undefined,
    maintenanceScore: intelligence?.maintenance_score ?? undefined,
    trustScore: intelligence?.trust_score ?? undefined,
    confidenceScore: intelligence?.confidence_score ?? undefined,
    shouldBuy,
    whyBuyText: intelligence?.why_buy ?? "",
    whyAvoidText: intelligence?.why_avoid ?? "",
    bestForText: intelligence?.best_for ?? "",
    notForText: intelligence?.not_for ?? "",
    hiddenIssuesText: intelligence?.hidden_issues ?? "",
    longTermExperience: intelligence?.long_term_experience ?? "",
    evidence: evidence.map((row) => ({
      sourceType: row.source_type as EvidenceItem["sourceType"],
      sourceName: row.source_name,
      sourceUrl: row.source_url ?? "",
      reviewCount: row.review_count ?? undefined,
      notes: row.notes ?? ""
    })),
    prosCons: prosCons.map((row) => ({
      type: row.type as ProsConsItem["type"],
      content: row.content
    })),
    complaints: complaints.map((row) => ({
      complaint: row.complaint,
      frequency: row.frequency as ComplaintItem["frequency"],
      severity: row.severity as ComplaintItem["severity"]
    })),
    personas: personas.map((row) => ({
      persona: row.persona,
      score: row.score ?? undefined,
      reason: row.reason ?? ""
    })),
    specs: specs.length
      ? specs.map((s) => ({
          specificationTitle: s.specification_title,
          title: s.title,
          description: s.description,
          sortOrder: s.sort_order
        }))
      : defaultProductFormValues.specs
  };
}
