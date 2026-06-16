export const MAX_COMPARE_PRODUCTS = 3;

export type CompareProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  main_image_url: string;
  brand: string;
  amazon_rating: number | null;
};

export function buildCompareHref(categorySlug: string, productIds: string[]) {
  const ids = productIds.slice(0, MAX_COMPARE_PRODUCTS).join(",");
  return `/compare/${categorySlug}?ids=${ids}`;
}

export function parseCompareIds(value: string | undefined) {
  if (!value?.trim()) return [];
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))].slice(
    0,
    MAX_COMPARE_PRODUCTS
  );
}
