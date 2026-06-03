import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Headphones,
  Home,
  Laptop,
  Package,
  Smartphone,
  Zap
} from "lucide-react";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  main_image_url: string;
  amazon_affiliate_url: string;
  created_at: string;
};

type Spec = {
  id: string;
  specification_title: string;
  title: string;
  description: string;
  sort_order: number;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "best-laptops": <Laptop size={20} />,
  smartphones:    <Smartphone size={20} />,
  electronics:    <Zap size={20} />,
  audio:          <Headphones size={20} />,
  home:           <Home size={20} />,
  fitness:        <Package size={20} />
};

async function getProductBySlug(slug: string): Promise<{ product: Product; specs: Spec[] } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !product) return null;
    const { data: specs } = await supabase
      .from("product_specifications")
      .select("id, specification_title, title, description, sort_order")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true });
    return { product: product as Product, specs: (specs ?? []) as Spec[] };
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
  const categoryIcon = CATEGORY_ICONS[product.category] ?? <Package size={20} />;

  return (
    <>
      {/* Breadcrumb */}
      <div className="pp-section pb-0 pt-9">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true" className="breadcrumb-sep">›</span>
          <Link href={`/categories/${product.category}`}>
            {categoryIcon}
            {product.category.replace(/-/g, " ")}
          </Link>
          <span aria-hidden="true" className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      {/* Product hero */}
      <section className="pp-section pb-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_360px] items-start">

          {/* Left: info */}
          <div>
            <p className="eyebrow mb-3.5">
              <Link href={`/categories/${product.category}`} className="inline-flex items-center gap-1.5">
                <ArrowLeft size={12} /> {product.category.replace(/-/g, " ")}
              </Link>
            </p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-medium tracking-[-0.02em] leading-[1.1] mb-[18px] text-ink">
              {product.name}
            </h1>
            <p className="text-slate text-[1.05rem] leading-[1.75] mb-8">
              {product.description}
            </p>

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
                  * Affiliate link — prices and availability subject to change
                </p>
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-7 inline-flex items-center gap-1.5 rounded-pill border border-line bg-canvas px-4 py-1.5 text-[0.8rem] font-semibold text-slate">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-canvas text-[0.7rem] font-black">
                  {specs.length}
                </span>
                specification{specs.length !== 1 ? "s" : ""} listed below
              </div>
            )}
          </div>

          {/* Right: image */}
          <div className="sticky top-6 aspect-square overflow-hidden rounded-[28px] bg-bone shadow-[var(--shadow-md)] flex items-center justify-center">
            {product.main_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={product.name}
                src={product.main_image_url}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <div className="product-img-placeholder rounded-[28px]">
                <Package size={64} strokeWidth={1} />
                <span>No image yet</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specifications */}
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
                {/* Group header */}
                <div className="flex items-center gap-2 bg-canvas px-7 py-3.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-light shrink-0" />
                  <span className="text-[0.72rem] font-black tracking-[0.06em] uppercase text-slate">
                    {group}
                  </span>
                </div>
                {/* Spec rows */}
                {specGroups[group].map((spec, si) => (
                  <div
                    key={spec.id}
                    className={`grid grid-cols-[1fr_1.6fr] gap-4 px-7 py-3.5 border-t border-line ${si % 2 !== 0 ? "bg-black/[0.015]" : ""}`}
                  >
                    <span className="text-[0.9rem] font-medium text-ink">{spec.title}</span>
                    <span className="text-[0.9rem] text-slate">{spec.description}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA banner */}
      {product.amazon_affiliate_url && (
        <section className="pp-section pt-0">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[40px] bg-ink px-10 py-13 md:px-16 md:py-[52px]">
            <div>
              <p className="eyebrow text-signal-light mb-2.5">Ready to buy?</p>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-[-0.02em] text-canvas mb-1.5">
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
