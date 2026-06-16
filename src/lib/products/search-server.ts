import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { isValidCategorySlug, type SearchParams } from "@/lib/products/search-utils";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

function sanitizeSearchTerm(term: string) {
  return term.replace(/[%_,]/g, " ").replace(/\s+/g, " ").trim();
}

export async function searchProducts({ q, category }: SearchParams): Promise<ProductRow[]> {
  const query = sanitizeSearchTerm(q ?? "");
  const hasCategory = category && category !== "all" && isValidCategorySlug(category);

  if (!isSupabaseConfigured() || (!query && !hasCategory)) return [];

  try {
    const supabase = await createServerSupabaseClient();
    let builder = supabase.from("products").select(PRODUCT_LIST_COLUMNS);

    if (hasCategory) {
      builder = builder.eq("category", category);
    }

    if (query) {
      const pattern = `%${query}%`;
      builder = builder.or(
        `name.ilike.${pattern},description.ilike.${pattern},brand.ilike.${pattern},slug.ilike.${pattern}`
      );
    }

    const { data } = await builder.order("created_at", { ascending: false }).limit(24);
    return (data ?? []) as ProductRow[];
  } catch {
    return [];
  }
}
