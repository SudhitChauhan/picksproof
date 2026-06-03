import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  Headphones,
  Home,
  Laptop,
  Package,
  Search,
  Smartphone,
  Zap
} from "lucide-react";
import { getCategory } from "@/lib/data";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };
type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  main_image_url: string;
  amazon_affiliate_url: string;
};

const CATEGORY_META: Record<string, { icon: React.ReactNode; image: string }> = {
  "best-laptops": {
    icon: <Laptop size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=75"
  },
  smartphones: {
    icon: <Smartphone size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=75"
  },
  electronics: {
    icon: <Zap size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=75"
  },
  audio: {
    icon: <Headphones size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=75"
  },
  home: {
    icon: <Home size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=75"
  },
  fitness: {
    icon: <Package size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=75"
  }
};

async function getCategoryProducts(categorySlug: string): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, description, category, slug, main_image_url, amazon_affiliate_url")
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = await getCategoryProducts(slug);
  const meta = CATEGORY_META[slug] ?? {
    icon: <Package size={28} strokeWidth={1.4} />,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=75"
  };

  return (
    <>
      {/* ── Category hero ──────────────────────────────────────────────────── */}
      <div className="cat-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" src={meta.image} className="cat-hero-img" />
        <div className="cat-hero-overlay" />
        <div className="cat-hero-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="cat-hero-icon">{meta.icon}</div>
            <p className="eyebrow text-white/75 m-0">{category.title}</p>
          </div>
          <h1 className="cat-hero-title">{category.hero}</h1>
          <p className="cat-hero-desc">{category.description}</p>
        </div>
      </div>

      {/* ── Products ────────────────────────────────────────────────────────── */}
      <section className="pp-section">
        {products.length > 0 ? (
          <>
            {/* Toolbar */}
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
                <button
                  className="btn-outline"
                  type="submit"
                >
                  <Search size={14} /> Search
                </button>
              </form>
            </div>

            <div className="product-grid">
              {products.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="product-card-image">
                    {p.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={p.name} src={p.main_image_url} />
                    ) : (
                      <div className="product-img-placeholder">
                        <span className="text-slate">{meta.icon}</span>
                        <span>No image yet</span>
                      </div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <h3>{p.name}</h3>
                    <p>{p.description.length > 110 ? `${p.description.slice(0, 110)}…` : p.description}</p>
                    <div className="product-card-actions">
                      <Link
                        className="btn-primary flex-1 justify-center text-[0.88rem] py-[9px] px-3"
                        href={`/reviews/${p.slug}`}
                      >
                        View Details <ArrowRight size={13} />
                      </Link>
                      {p.amazon_affiliate_url && (
                        <a
                          className="btn-affiliate text-[0.88rem] py-[9px] px-3"
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
          /* Empty state */
          <div className="overflow-hidden rounded-[32px] border border-line bg-lifted">
            <div className="relative h-36 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden="true"
                src={meta.image}
                className="absolute inset-0 h-full w-full object-cover brightness-[0.35] blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center text-canvas/60">
                {meta.icon}
              </div>
            </div>
            <div className="px-10 pb-10 pt-8 text-center">
              <h3 className="text-[1.3rem] font-medium text-ink mb-2">No {category.title} yet</h3>
              <p className="text-slate mb-6">Check back soon — we&apos;re curating picks for this category.</p>
              <Link className="btn-outline" href="/">← Back to home</Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
