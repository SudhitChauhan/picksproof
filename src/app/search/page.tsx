import Link from "next/link";
import { Package, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryBrowseSection } from "@/components/search/CategoryBrowseSection";
import { getCategoryIcon } from "@/lib/category-visuals";
import { categories } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type SearchPageProps = { searchParams: Promise<{ q?: string }> };

async function searchProducts(query: string): Promise<ProductRow[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_LIST_COLUMNS)
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(12);
    return (data ?? []) as ProductRow[];
  } catch {
    return [];
  }
}

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
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const isBrowsing = !query;
  const results = isBrowsing ? [] : await searchProducts(query);
  const productsByCategory = isBrowsing ? await getProductsByCategory() : null;
  const browseSections = isBrowsing
    ? categories
        .map((category) => ({
          category,
          products: productsByCategory?.[category.slug] ?? []
        }))
        .filter((section) => section.products.length > 0)
    : [];

  return (
    <>
      <section className="pp-section pb-10">
        <p className="eyebrow">{query ? "Search results" : "Browse products"}</p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] mt-3 mb-7 text-ink">
          {query ? `"${query}"` : "All products"}
        </h1>

        <form action="/search" className="flex gap-2 max-w-[560px]">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search products…"
            aria-label="Search products"
            className="flex-1 rounded-pill border-[1.5px] border-line bg-white px-5 py-3 text-[0.95rem] text-ink outline-none focus:border-ink"
          />
          <button className="btn-primary rounded-pill px-6 py-3" type="submit">
            <Search size={16} />
            Search
          </button>
        </form>
      </section>

      <section className="pp-section pt-0">
        {query ? (
          results.length > 0 ? (
            <>
              <p className="text-slate text-[0.9rem] mb-6">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="product-grid">
                {results.map((p) => (
                  <ProductCard
                    key={p.id}
                    icon={getCategoryIcon(p.category, 32)}
                    product={p}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <Search size={40} className="mx-auto mb-4 text-dust" />
              <h3 className="text-[1.4rem] mb-3">No products found</h3>
              <p className="text-slate mb-6">
                No products match &ldquo;{query}&rdquo;. Try a different keyword.
              </p>
              <Link className="btn-outline" href="/search">
                Browse all products
              </Link>
            </div>
          )
        ) : browseSections.length > 0 ? (
          <div className="grid gap-12">
            {browseSections.map(({ category, products }) => (
              <CategoryBrowseSection
                key={category.slug}
                category={category}
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
