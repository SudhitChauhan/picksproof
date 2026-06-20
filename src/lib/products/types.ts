/** Columns stored on `public.products` (snake_case matches Supabase). */
export type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  main_image_url: string;
  amazon_affiliate_url: string;
  asin: string | null;
  brand: string;
  features: string[];
  amazon_rating: number | null;
  amazon_review_count: number | null;
  bestseller_rank: number | null;
  bestseller_category: string;
  model_number: string;
  model_name: string;
  warranty: string;
  country_of_origin: string;
  subcategory: string | null;
  model: string | null;
  price: number | null;
  mrp: number | null;
  image: string | null;
  affiliate_url: string | null;
  launch_date: string | null;
  updated_at: string;
  created_at: string;
};

export const PRODUCT_LIST_COLUMNS =
  "id, name, description, category, slug, main_image_url, amazon_affiliate_url, brand, amazon_rating, amazon_review_count, bestseller_rank, bestseller_category" as const;

export const PRODUCT_INTELLIGENCE_COLUMNS =
  "subcategory, model, price, mrp, image, affiliate_url, launch_date, updated_at" as const;

export const PRODUCT_DETAIL_COLUMNS =
  `${PRODUCT_LIST_COLUMNS}, asin, features, model_number, model_name, warranty, country_of_origin, created_at, ${PRODUCT_INTELLIGENCE_COLUMNS}` as const;
