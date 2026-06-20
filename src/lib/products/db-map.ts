import type { ProductFormValues } from "./schema";

export function productFormToDbRow(input: ProductFormValues) {
  const imageUrl = input.mainImageUrl.trim();
  const affiliateUrl = input.amazonAffiliateUrl;
  const model =
    input.model?.trim() ||
    input.modelNumber?.trim() ||
    input.modelName?.trim() ||
    "";

  return {
    name: input.name,
    description: input.description,
    category: input.category,
    subcategory: input.subcategory?.trim() || null,
    slug: input.slug,
    main_image_url: imageUrl,
    amazon_affiliate_url: affiliateUrl,
    image: imageUrl || null,
    affiliate_url: affiliateUrl,
    price: input.price ?? null,
    mrp: input.mrp ?? null,
    launch_date: input.launchDate?.trim() || null,
    model: model || null,
    asin: input.asin || null,
    brand: input.brand ?? "",
    features: (input.features ?? []).map((f) => f.trim()).filter(Boolean),
    amazon_rating: input.amazonRating ?? null,
    amazon_review_count: input.amazonReviewCount ?? null,
    bestseller_rank: input.bestsellerRank ?? null,
    bestseller_category: input.bestsellerCategory ?? "",
    model_number: input.modelNumber?.trim() || model,
    model_name: input.modelName ?? "",
    warranty: input.warranty ?? "",
    country_of_origin: input.countryOfOrigin ?? ""
  };
}

export function productIntelligenceToDbRow(input: ProductFormValues) {
  return {
    performance_score: input.performanceScore ?? null,
    reliability_score: input.reliabilityScore ?? null,
    value_score: input.valueScore ?? null,
    comfort_score: input.comfortScore ?? null,
    maintenance_score: input.maintenanceScore ?? null,
    trust_score: input.trustScore ?? null,
    should_buy: input.shouldBuy,
    why_buy: input.whyBuyText?.trim() || null,
    why_avoid: input.whyAvoidText?.trim() || null,
    best_for: input.bestForText?.trim() || null,
    not_for: input.notForText?.trim() || null,
    hidden_issues: input.hiddenIssuesText?.trim() || null,
    long_term_experience: input.longTermExperience?.trim() || null,
    confidence_score: input.confidenceScore ?? null
  };
}
