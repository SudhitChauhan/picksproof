import { z } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required.`);

export const productFormSchema = z.object({
  title: requiredText("Title"),
  brand: requiredText("Brand"),
  category: requiredText("Category"),
  mainImageUrl: z.string().trim().url("Enter a valid image URL."),
  globalScore: z.coerce.number().min(0).max(10),
  links: z
    .array(
      z.object({
        retailerName: requiredText("Retailer name"),
        affiliateUrl: z.string().trim().url("Enter a valid affiliate URL."),
        price: z.coerce.number().min(0, "Price must be 0 or higher."),
        isPrimary: z.boolean()
      })
    )
    .min(1, "Add at least one affiliate link."),
  specs: z
    .array(
      z.object({
        specName: requiredText("Spec name"),
        specValue: requiredText("Spec value")
      })
    )
    .min(1, "Add at least one specification."),
  review: z.object({
    summary: requiredText("Review summary"),
    pros: z.array(z.object({ value: requiredText("Pro") })).min(1, "Add at least one pro."),
    cons: z.array(z.object({ value: requiredText("Con") })).min(1, "Add at least one con."),
    editorVerdict: requiredText("Editor verdict")
  })
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormInput = {
  title: "",
  brand: "",
  category: "Headphones",
  mainImageUrl: "",
  globalScore: 8,
  links: [
    {
      retailerName: "Amazon",
      affiliateUrl: "",
      price: 0,
      isPrimary: true
    }
  ],
  specs: [
    {
      specName: "",
      specValue: ""
    }
  ],
  review: {
    summary: "",
    pros: [{ value: "" }],
    cons: [{ value: "" }],
    editorVerdict: ""
  }
};
