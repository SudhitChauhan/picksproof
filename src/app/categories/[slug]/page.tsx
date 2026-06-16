import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, Search } from "lucide-react";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProductGrid } from "@/components/compare/CompareProductGrid";
import { CompareProvider } from "@/components/compare/CompareContext";
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

      <CompareProvider categorySlug={slug}>
        <section className={`pp-section ${products.length > 0 ? "category-page-with-compare" : ""}`}>
          {products.length > 0 ? (
            <>
              <div className="section-head mb-6">
                <div>
                  <p className="eyebrow">Pick up to 3</p>
                  <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 mb-1">Compare products</h2>
                  <p className="text-slate text-sm m-0">
                    Select products using the checkbox on each card, then compare side by side.
                  </p>
                </div>
                <form action="/search" className="flex gap-2">
                  <input type="hidden" name="category" value={slug} />
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

              <CompareProductGrid products={products} />

              <p className="text-slate text-sm mt-8 m-0">
                {products.length} product{products.length !== 1 ? "s" : ""} in {category.title}
              </p>
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
                <Package className="mx-auto mb-3 text-dust" size={32} />
                <h3 className="text-[1.3rem] text-ink mb-2">No {category.title} yet</h3>
                <p className="text-slate mb-6">Check back soon — we&apos;re curating picks for this category.</p>
                <Link className="btn-outline" href="/">
                  ← Back to home
                </Link>
              </div>
            </div>
          )}
        </section>

        <CompareBar isAuthenticated={isAuthenticated} />
      </CompareProvider>
    </>
  );
}
