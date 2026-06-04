import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { ProductTrustMeta } from "@/components/ProductTrustMeta";
import { getCategory } from "@/lib/data";
import { getCategoryIcon } from "@/lib/category-visuals";
import { PRODUCT_DEFAULT_IMAGE } from "@/lib/products/sitestripe";
import { PRODUCT_DETAIL_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

type Spec = {
  id: string;
  specification_title: string;
  title: string;
  description: string;
  sort_order: number;
};

function categoryLabel(slug: string) {
  return getCategory(slug)?.title ?? slug.replace(/-/g, " ");
}

function truncateBreadcrumb(text: string, maxLength = 25): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

async function getProductBySlug(slug: string): Promise<{ product: ProductRow; specs: Spec[] } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(PRODUCT_DETAIL_COLUMNS)
      .eq("slug", slug)
      .single();
    if (error || !product) return null;
    const { data: specs } = await supabase
      .from("product_specifications")
      .select("id, specification_title, title, description, sort_order")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true });
    return { product: product as ProductRow, specs: (specs ?? []) as Spec[] };
  } catch {
    return null;
  }
}

function groupSpecs(specs: Spec[]): Record<string, Spec[]> {
  return specs.reduce<Record<string, Spec[]>>((acc, spec) => {
    const key = spec.specification_title || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(spec);
    return acc;
  }, {});
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  return { title: result ? `${result.product.name} — PickProof` : "Product — PickProof" };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  if (!result) notFound();

  const { product, specs } = result;
  const specGroups = groupSpecs(specs);
  const specGroupKeys = Object.keys(specGroups);
  const categoryIcon = getCategoryIcon(product.category, 20);
  const categoryName = categoryLabel(product.category);
  const features = (product.features ?? []).filter(Boolean);

  return (
    <>
      <div className="pp-section pb-0 pt-9">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true" className="breadcrumb-sep">›</span>
          <Link href={`/categories/${product.category}`}>
            {categoryIcon}
            {categoryName}
          </Link>
          <span aria-hidden="true" className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current" title={product.name}>
            {truncateBreadcrumb(product.name)}
          </span>
        </nav>
      </div>

      <section className="pp-section pb-10">
        <div>
            <p className="eyebrow mb-3.5">
              <Link href={`/categories/${product.category}`} className="inline-flex items-center gap-1.5">
                <ArrowLeft size={12} /> {categoryName}
              </Link>
            </p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] mb-[18px] text-ink">
              {product.name}
            </h1>

            <ProductTrustMeta
              brand={product.brand}
              amazonRating={product.amazon_rating}
              amazonReviewCount={product.amazon_review_count}
              bestsellerRank={product.bestseller_rank}
              bestsellerCategory={product.bestseller_category}
              modelNumber={product.model_number || undefined}
              warranty={product.warranty || undefined}
              countryOfOrigin={product.country_of_origin || undefined}
            />

            <p className="text-slate text-[1.05rem] leading-[1.75] mb-8 mt-6">
              {product.description}
            </p>

            {features.length > 0 && (
              <div className="mb-8">
                <p className="eyebrow mb-3">Key features</p>
                <ul className="product-feature-list">
                  {features.map((f) => (
                    <li key={f}>
                      <Check size={16} className="shrink-0 text-signal" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.amazon_affiliate_url && (
              <div className="flex flex-col gap-2.5">
                <a
                  className="btn-affiliate text-base py-[13px] px-8 self-start"
                  href={product.amazon_affiliate_url}
                  rel="noopener noreferrer sponsored"
                  target="_blank"
                >
                  See Price on Amazon.in <ExternalLink size={16} />
                </a>
                <p className="text-[0.78rem] text-dust m-0">
                  Affiliate link — check current price and availability on Amazon.in
                </p>
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-7 inline-flex items-center gap-1.5 rounded-pill border border-line bg-canvas px-4 py-1.5 text-[0.8rem] font-semibold text-slate">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-canvas text-[0.7rem] font-black">
                  {specs.length}
                </span>
                specification{specs.length !== 1 ? "s" : ""} for comparison
              </div>
            )}
        </div>

        <div className="mt-10 aspect-video w-full overflow-hidden rounded-[28px] bg-bone shadow-[var(--shadow-md)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={product.name}
            className="h-full w-full object-cover"
            src={PRODUCT_DEFAULT_IMAGE}
          />
        </div>
      </section>

      {specs.length > 0 && (
        <section className="pp-section pt-0">
          <div className="section-head mb-7">
            <div>
              <p className="eyebrow">Full breakdown</p>
              <h2>Product Specifications</h2>
            </div>
            {product.amazon_affiliate_url && (
              <a
                className="btn-affiliate text-[0.88rem] py-[9px] px-5"
                href={product.amazon_affiliate_url}
                rel="noopener noreferrer sponsored"
                target="_blank"
              >
                See Price <ExternalLink size={13} />
              </a>
            )}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-line bg-lifted shadow-[var(--shadow-sm)]">
            {specGroupKeys.map((group, gi) => (
              <div
                key={group}
                className={gi < specGroupKeys.length - 1 ? "border-b border-line" : ""}
              >
                <div className="flex items-center gap-2 bg-canvas px-7 py-3.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-light shrink-0" />
                  <span className="text-[0.72rem] font-black tracking-[0.06em] uppercase text-slate">
                    {group}
                  </span>
                </div>
                {specGroups[group].map((spec, si) => (
                  <div
                    key={spec.id}
                    className={`grid grid-cols-[1fr_1.6fr] gap-4 px-7 py-3.5 border-t border-line ${si % 2 !== 0 ? "bg-black/[0.015]" : ""}`}
                  >
                    <span className="text-[0.9rem] font-semibold text-ink">{spec.title}</span>
                    <span className="text-[0.9rem] text-slate">{spec.description}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {product.amazon_affiliate_url && (
        <section className="pp-section pt-0">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[40px] bg-ink px-10 py-13 md:px-16 md:py-[52px]">
            <div>
              <p className="eyebrow text-signal-light mb-2.5">Ready to buy?</p>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-canvas mb-1.5">
                {product.name}
              </h2>
              <p className="text-canvas/60 m-0 text-[0.9rem]">
                Check the latest price on Amazon.in — link opens in a new tab.
              </p>
            </div>
            <a
              className="btn-affiliate shrink-0 text-base py-[14px] px-9"
              href={product.amazon_affiliate_url}
              rel="noopener noreferrer sponsored"
              target="_blank"
            >
              See Price on Amazon.in <ExternalLink size={16} />
            </a>
          </div>
        </section>
      )}
    </>
  );
}
