import { z } from "zod";

const req = (label: string) => z.string().trim().min(1, `${label} is required.`);

// ── Product specification item (3 fields) ─────────────────────────────────────
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
  mainImageUrl: z.string().trim().url("Enter a valid image URL or extract it via SiteStripe."),
  amazonAffiliateUrl: z.string().trim().url("Enter a valid Amazon affiliate URL."),
  specs: z
    .array(specItemSchema)
    .min(1, "Add at least one specification.")
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormInput = {
  name: "",
  description: "",
  category: "electronics",
  slug: "",
  mainImageUrl: "",
  amazonAffiliateUrl: "",
  specs: [
    {
      specificationTitle: "",
      title: "",
      description: "",
      sortOrder: 0
    }
  ]
};

// ── Edit form (same but with id) ──────────────────────────────────────────────
export const editProductFormSchema = productFormSchema.extend({
  id: z.string().uuid()
});

export type EditProductFormValues = z.infer<typeof editProductFormSchema>;
export type EditProductFormInput = z.input<typeof editProductFormSchema>;
