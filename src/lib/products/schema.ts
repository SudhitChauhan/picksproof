import { z } from "zod";
import { isCloudinaryImageUrl, isHttpsImageSource } from "@/lib/cloudinary/urls";

const req = (label: string) => z.string().trim().min(1, `${label} is required.`);

const optionalText = z.string().trim().optional().default("");

/** Empty, Cloudinary URL, or any https image source (uploaded to Cloudinary on save). */
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
const optionalRating = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().min(0).max(5).optional()
);

// ── Product specification item ─────────────────────────────────────────────────
export const specItemSchema = z.object({
  specificationTitle: req("Specification title"),
  title: req("Spec title"),
  description: req("Spec description"),
  sortOrder: z.number().int().default(0)
});

export type SpecItem = z.infer<typeof specItemSchema>;
export type SpecItemInput = z.input<typeof specItemSchema>;

// ── Main product form ─────────────────────────────────────────────────────────
export const productFormSchema = z.object({
  name: req("Product name"),
  description: req("Description"),
  category: req("Category"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  mainImageUrl: productImageUrl,
  amazonAffiliateUrl: z.string().trim().url("Enter a valid Amazon affiliate URL."),
  asin: optionalText,
  brand: optionalText,
  features: z.array(z.string().trim()).default([]),
  amazonRating: optionalRating,
  amazonReviewCount: optionalInt,
  bestsellerRank: optionalInt,
  bestsellerCategory: optionalText,
  modelNumber: optionalText,
  modelName: optionalText,
  warranty: optionalText,
  countryOfOrigin: optionalText,
  specs: z.array(specItemSchema).min(1, "Add at least one specification.")
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormInput = {
  name: "",
  description: "",
  category: "electronics-tech",
  slug: "",
  mainImageUrl: "",
  amazonAffiliateUrl: "",
  asin: "",
  brand: "",
  features: [],
  amazonRating: undefined,
  amazonReviewCount: undefined,
  bestsellerRank: undefined,
  bestsellerCategory: "",
  modelNumber: "",
  modelName: "",
  warranty: "",
  countryOfOrigin: "",
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

/** Map a Supabase product row → form default values. */
export function dbProductToFormInput(
  product: {
    id?: string;
    name: string;
    description: string;
    category: string;
    slug: string;
    main_image_url: string;
    amazon_affiliate_url: string;
    asin?: string | null;
    brand?: string;
    features?: string[];
    amazon_rating?: number | null;
    amazon_review_count?: number | null;
    bestseller_rank?: number | null;
    bestseller_category?: string;
    model_number?: string;
    model_name?: string;
    warranty?: string;
    country_of_origin?: string;
  },
  specs: {
    specification_title: string;
    title: string;
    description: string;
    sort_order: number;
  }[]
): ProductFormInput | EditProductFormInput {
  return {
    ...(product.id ? { id: product.id } : {}),
    name: product.name,
    description: product.description,
    category: product.category,
    slug: product.slug,
    mainImageUrl: product.main_image_url,
    amazonAffiliateUrl: product.amazon_affiliate_url,
    asin: product.asin ?? "",
    brand: product.brand ?? "",
    features: product.features ?? [],
    amazonRating: product.amazon_rating ?? undefined,
    amazonReviewCount: product.amazon_review_count ?? undefined,
    bestsellerRank: product.bestseller_rank ?? undefined,
    bestsellerCategory: product.bestseller_category ?? "",
    modelNumber: product.model_number ?? "",
    modelName: product.model_name ?? "",
    warranty: product.warranty ?? "",
    countryOfOrigin: product.country_of_origin ?? "",
    specs: specs.map((s) => ({
      specificationTitle: s.specification_title,
      title: s.title,
      description: s.description,
      sortOrder: s.sort_order
    }))
  };
}
