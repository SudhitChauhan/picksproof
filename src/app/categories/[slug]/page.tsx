import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Package, Search } from "lucide-react";
import { ComparisonAuthPrompt } from "@/components/ComparisonAuthPrompt";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryHeroImage, getCategoryIcon } from "@/lib/category-visuals";
import { getCategory } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

async function getCategoryProducts(categorySlug: string): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_LIST_COLUMNS)
      .eq("category", categorySlug)
      .order("created_at", { ascending: false });
    return (data ?? []) as ProductRow[];
  } catch {
    return [];
  }
}

async function getSpecsForProducts(productIds: string[]) {
  if (!isSupabaseConfigured() || productIds.length === 0) return [];
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("product_specifications")
    .select("product_id, specification_title, title, description")
    .in("product_id", productIds);
  return data ?? [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.title} — PickProof` : "Category — PickProof" };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  let isAuthenticated = false;
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    isAuthenticated = !!user;
  }

  const products = await getCategoryProducts(slug);
  const compareProducts = products.slice(0, 2);
  const compareHref = `/compare/${slug}`;
  const specs =
    compareProducts.length >= 2
      ? await getSpecsForProducts(compareProducts.map((p) => p.id))
      : [];

  return (
    <>
      <div className="cat-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" src={getCategoryHeroImage(slug)} className="cat-hero-img" />
        <div className="cat-hero-overlay" />
        <div className="cat-hero-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="cat-hero-icon">{getCategoryIcon(slug, 28)}</div>
            <p className="eyebrow text-white/75 m-0">{category.title}</p>
          </div>
          <h1 className="cat-hero-title">{category.hero}</h1>
          <p className="cat-hero-desc">{category.description}</p>
        </div>
      </div>

      <section className="pp-section">
        {products.length > 0 ? (
          <>
            <div className="section-head mb-6">
              <p className="text-slate text-sm">
                {products.length} product{products.length !== 1 ? "s" : ""} in {category.title}
              </p>
              <form action="/search" className="flex gap-2">
                <input
                  name="q"
                  placeholder={`Search ${category.title.toLowerCase()}…`}
                  className="w-52 rounded-pill border-[1.5px] border-line bg-white px-4 py-2 text-sm text-ink outline-none focus:border-ink"
                />
                <button className="btn-outline" type="submit">
                  <Search size={14} /> Search
                </button>
              </form>
            </div>

            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} icon={getCategoryIcon(slug, 32)} product={p} />
              ))}
            </div>

            {compareProducts.length >= 2 && (
              <div className="mt-16">
                <div className="section-head mb-7">
                  <div>
                    <p className="eyebrow">Side by side</p>
                    <h2>Compare in {category.title}</h2>
                    <p className="text-slate text-sm mt-1 m-0">
                      First two products in this category
                    </p>
                  </div>
                  {isAuthenticated && (
                    <Link className="btn-outline text-[0.88rem]" href={compareHref}>
                      Full comparison <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
                {isAuthenticated ? (
                  <>
                    <ComparisonTable maxRows={3} products={compareProducts} specs={specs} />
                    <p className="text-slate text-sm mt-4 m-0">
                      Preview — first 3 specifications.{" "}
                      <Link className="font-semibold text-ink" href={compareHref}>
                        View full comparison
                      </Link>
                    </p>
                  </>
                ) : (
                  <ComparisonAuthPrompt categoryTitle={category.title} returnTo={compareHref} />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="overflow-hidden rounded-[32px] border border-line bg-lifted">
            <div className="relative h-36 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden="true"
                src={getCategoryHeroImage(slug)}
                className="absolute inset-0 h-full w-full object-cover brightness-[0.35] blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center text-canvas/60">
                {getCategoryIcon(slug, 28)}
              </div>
            </div>
            <div className="px-10 pb-10 pt-8 text-center">
              <h3 className="text-[1.3rem] text-ink mb-2">No {category.title} yet</h3>
              <p className="text-slate mb-6">Check back soon — we&apos;re curating picks for this category.</p>
              <Link className="btn-outline" href="/">
                ← Back to home
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
