import Link from "next/link";
import { ExternalLink, Package, Search } from "lucide-react";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type SearchPageProps = { searchParams: Promise<{ q?: string }> };

type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  main_image_url: string;
  amazon_affiliate_url: string;
};

async function searchProducts(query: string): Promise<ProductRow[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, description, category, slug, main_image_url, amazon_affiliate_url")
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(12);
    return (data ?? []) as ProductRow[];
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = await searchProducts(query);

  return (
    <>
      {/* Search bar header */}
      <section className="pp-section pb-10">
        <p className="eyebrow">Search results</p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em] mt-3 mb-7 text-ink">
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

      {/* Results */}
      <section className="pp-section pt-0">
        {results.length > 0 ? (
          <>
            <p className="text-slate text-[0.9rem] mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="product-grid">
              {results.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="product-card-image">
                    {p.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={p.name} src={p.main_image_url} />
                    ) : (
                      <div className="product-img-placeholder">
                        <Package size={32} />
                        <span>No image yet</span>
                      </div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <p className="product-card-category">{p.category.replace(/-/g, " ")}</p>
                    <h3>{p.name}</h3>
                    <p>{p.description.length > 100 ? `${p.description.slice(0, 100)}…` : p.description}</p>
                    <div className="product-card-actions">
                      <Link
                        className="btn-primary flex-1 justify-center text-[0.88rem] py-2 px-3.5"
                        href={`/reviews/${p.slug}`}
                      >
                        View Details
                      </Link>
                      {p.amazon_affiliate_url && (
                        <a
                          className="btn-affiliate text-[0.88rem] py-2 px-3.5"
                          href={p.amazon_affiliate_url}
                          rel="noopener noreferrer sponsored"
                          target="_blank"
                        >
                          See Price <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <Search size={40} className="mx-auto mb-4 text-dust" />
            <h3 className="text-[1.4rem] font-medium mb-3">
              {query ? "No products found" : "Type something to search"}
            </h3>
            <p className="text-slate mb-6">
              {query
                ? `No products match "${query}". Try a different keyword.`
                : "Enter a product name in the search box above."}
            </p>
            <Link className="btn-outline" href="/">Browse all categories</Link>
          </div>
        )}
      </section>
    </>
  );
}
