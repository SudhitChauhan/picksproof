import type { ProductFormValues } from "./schema";
import { sanitizeSiteStripeImageUrl } from "./sitestripe";

export function productFormToDbRow(input: ProductFormValues) {
  return {
    name: input.name,
    description: input.description,
    category: input.category,
    slug: input.slug,
    main_image_url: sanitizeSiteStripeImageUrl(input.mainImageUrl),
    amazon_affiliate_url: input.amazonAffiliateUrl,
    asin: input.asin || null,
    brand: input.brand ?? "",
    features: (input.features ?? []).map((f) => f.trim()).filter(Boolean),
    amazon_rating: input.amazonRating ?? null,
    amazon_review_count: input.amazonReviewCount ?? null,
    bestseller_rank: input.bestsellerRank ?? null,
    bestseller_category: input.bestsellerCategory ?? "",
    model_number: input.modelNumber ?? "",
    model_name: input.modelName ?? "",
    warranty: input.warranty ?? "",
    country_of_origin: input.countryOfOrigin ?? ""
  };
}
