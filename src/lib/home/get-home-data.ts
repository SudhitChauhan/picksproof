import { categories } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type HomePageData = {
  latestProducts: ProductRow[];
  topRatedProducts: ProductRow[];
  totalProducts: number;
  categoryCounts: Record<string, number>;
  spotlightCategorySlug: string | null;
};

const EMPTY: HomePageData = {
  latestProducts: [],
  topRatedProducts: [],
  totalProducts: 0,
  categoryCounts: {},
  spotlightCategorySlug: null
};

export async function getHomePageData(): Promise<HomePageData> {
  if (!isSupabaseConfigured()) return EMPTY;

  try {
    const supabase = await createServerSupabaseClient();

    const [latestResult, topRatedResult, countResult, categoryRowsResult] = await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_LIST_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("products")
        .select(PRODUCT_LIST_COLUMNS)
        .not("amazon_rating", "is", null)
        .gte("amazon_review_count", 50)
        .order("amazon_rating", { ascending: false })
        .order("amazon_review_count", { ascending: false })
        .limit(4),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("category")
    ]);

    const categoryCounts: Record<string, number> = {};
    for (const row of categoryRowsResult.data ?? []) {
      if (!row.category) continue;
      categoryCounts[row.category] = (categoryCounts[row.category] ?? 0) + 1;
    }

    const spotlightCategorySlug =
      categories.find((cat) => (categoryCounts[cat.slug] ?? 0) > 0)?.slug ?? null;

    return {
      latestProducts: (latestResult.data ?? []) as ProductRow[],
      topRatedProducts: (topRatedResult.data ?? []) as ProductRow[],
      totalProducts: countResult.count ?? 0,
      categoryCounts,
      spotlightCategorySlug
    };
  } catch {
    return EMPTY;
  }
}
