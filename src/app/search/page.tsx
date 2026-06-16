import Link from "next/link";
import { Package, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryBrowseSection } from "@/components/search/CategoryBrowseSection";
import { SearchFilters } from "@/components/search/SearchFilters";
import { categories } from "@/lib/data";
import {
  getCategoryTitle,
  isValidCategorySlug,
  QUICK_SEARCHES
} from "@/lib/products/search-utils";
import { searchProducts } from "@/lib/products/search-server";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

async function getProductsByCategory(): Promise<Record<string, ProductRow[]>> {
  const grouped = Object.fromEntries(categories.map((cat) => [cat.slug, [] as ProductRow[]]));

  if (!isSupabaseConfigured()) return grouped;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_LIST_COLUMNS)
      .order("created_at", { ascending: false });

    for (const product of (data ?? []) as ProductRow[]) {
      if (grouped[product.category]) {
        grouped[product.category].push(product);
      }
    }
  } catch {
    return grouped;
  }

  return grouped;
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category: categoryParam } = await searchParams;
  const query = q?.trim() ?? "";
  const category = isValidCategorySlug(categoryParam) ? categoryParam : undefined;
  const categoryTitle = getCategoryTitle(category);
  const isBrowsing = !query && !category;
  const results = isBrowsing ? [] : await searchProducts({ q: query, category });
  const productsByCategory = isBrowsing ? await getProductsByCategory() : null;
  const browseSections = isBrowsing
    ? categories
        .map((cat) => ({
          category: cat,
          products: productsByCategory?.[cat.slug] ?? []
        }))
        .filter((section) => section.products.length > 0)
    : [];

  const heading = query
    ? categoryTitle
      ? `"${query}" in ${categoryTitle}`
      : `"${query}"`
    : categoryTitle
      ? categoryTitle
      : "All products";

  return (
    <>
      <section className="pp-section pb-10">
        <p className="eyebrow">{query || category ? "Search results" : "Browse products"}</p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] mt-3 mb-7 text-ink">{heading}</h1>

        <SearchFilters
          categories={categories}
          initialCategory={category}
          initialQuery={query}
        />
      </section>

      <section className="pp-section pt-0">
        {query || category ? (
          results.length > 0 ? (
            <>
              <p className="text-slate text-[0.9rem] mb-6">
                {results.length} result{results.length !== 1 ? "s" : ""} found
                {categoryTitle ? ` in ${categoryTitle}` : ""}
              </p>
              <div className="product-grid">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <Search size={40} className="mx-auto mb-4 text-dust" />
              <h3 className="text-[1.4rem] mb-3">No products found</h3>
              <p className="text-slate mb-6 max-w-[420px] mx-auto">
                {query && categoryTitle
                  ? `No matches for "${query}" in ${categoryTitle}. Try another keyword or browse the full category.`
                  : query
                    ? `No products match "${query}". Try a different keyword or remove filters.`
                    : `No products in ${categoryTitle} yet.`}
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center mb-6">
                {QUICK_SEARCHES.map((item) => (
                  <Link
                    className="btn-outline text-[0.85rem] py-[7px] px-[18px]"
                    href={`/search?q=${encodeURIComponent(item.q)}${category ? `&category=${category}` : ""}`}
                    key={item.q}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link className="btn-outline" href="/search">
                Browse all products
              </Link>
            </div>
          )
        ) : browseSections.length > 0 ? (
          <div className="grid gap-12">
            {browseSections.map(({ category: cat, products }) => (
              <CategoryBrowseSection
                key={cat.slug}
                category={cat}
                products={products}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package size={40} className="mx-auto mb-4 text-dust" />
            <h3 className="text-[1.4rem] mb-3">No products yet</h3>
            <p className="text-slate mb-6">
              Products will appear here once they are published. Browse categories from the
              homepage in the meantime.
            </p>
            <Link className="btn-outline" href="/">
              Back to home
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
