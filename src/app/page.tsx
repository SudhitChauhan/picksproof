import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Package,
  Search,
  ShieldCheck
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryHeroImage, getCategoryIcon } from "@/lib/category-visuals";
import { categories } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS } from "@/lib/products/types";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function getPageData() {
  if (!isSupabaseConfigured()) return { products: [], isAdmin: false };
  try {
    const supabase = await createServerSupabaseClient();
    const [{ data: products }, { data: { session } }] = await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_LIST_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.auth.getSession()
    ]);
    return {
      products: products ?? [],
      isAdmin: isAdminUser(session?.user ?? null)
    };
  } catch {
    return { products: [], isAdmin: false };
  }
}

export default async function HomePage() {
  const { products, isAdmin } = await getPageData();

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="hero-frame">
        <div>
          <p className="eyebrow text-signal-light mb-5">Data-backed affiliate recommendations</p>
          <h1>Find the best products without the noise.</h1>
          <p>
            PickProof surfaces honest product specs and direct Amazon.in links — no fake reviews,
            no pressure tactics, just clear information.
          </p>
          <form className="hero-search" action="/search">
            <input name="q" placeholder="Search laptops, earbuds, phones…" aria-label="Search products" />
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Right panel */}
        {isAdmin ? (
          <div className="hero-panel">
            <h2>Product Catalogue</h2>
            <p className="type-display text-[4rem]! text-canvas! my-4!">
              {products.length}
            </p>
            <p>Total published products. Add more from the admin dashboard.</p>
            <Link
              className="btn-outline mt-5 bg-transparent! text-canvas! border-canvas/40!"
              href="/products"
            >
              Manage products
            </Link>
          </div>
        ) : (
          <div className="hero-panel">
            <ul className="list-none m-0 p-0 grid gap-[18px]">
              {[
                { icon: <Search size={18} />, text: "Search across all categories" },
                { icon: <CheckCircle size={18} />, text: "Structured specs, zero fluff" },
                { icon: <ShieldCheck size={18} />, text: "Direct affiliate links to Amazon.in" }
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3.5 text-canvas/85 text-[0.95rem]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                    {icon}
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <Link className="btn-affiliate mt-7 inline-flex gap-2" href="#categories">
              Browse categories <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section className="pp-section" id="categories">
        <div className="section-head">
          <div>
            <p className="eyebrow">Start with a hub</p>
            <h2>Browse by Category</h2>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
              <Link className="category-card" href={`/categories/${cat.slug}`} key={cat.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="category-card-bg"
                  loading="lazy"
                  src={getCategoryHeroImage(cat.slug)}
                />
                <div className="category-card-overlay" />
                <div className="category-card-body">
                  <div className="category-card-icon">{getCategoryIcon(cat.slug, 20)}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                </div>
              </Link>
          ))}
        </div>
      </section>

      {/* ── Product feed ────────────────────────────────────────────────────── */}
      <section className="pp-section pt-0">
        <div className="section-head">
          <div>
            <p className="eyebrow">Curated picks</p>
            <h2>Latest Recommendations</h2>
          </div>
          {products.length > 0 && (
            <Link className="btn-outline text-[0.9rem]" href="/search">Browse all</Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                icon={getCategoryIcon(p.category, 32)}
                product={p}
              />
            ))}
          </div>
        ) : (
          <EmptyProductsState />
        )}
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────────────── */}
      <div className="trust-strip">
        <div>
          <p className="eyebrow text-signal-light">Why trust us</p>
          <h2>Designed for proof, not pop-ups.</h2>
          <p className="mt-4">
            Every recommendation links to a full spec breakdown and uses honest affiliate CTAs —
            no pressure copy, no fake urgency.
          </p>
        </div>
        <div className="trust-grid">
          {[
            { icon: <CheckCircle size={20} />, title: "Structured Specs", body: "Every product has a grouped specification table — no marketing fluff." },
            { icon: <ExternalLink size={20} />, title: "Amazon.in Links", body: 'All "See Price" buttons go directly to Amazon India with your affiliate tag.' },
            { icon: <ShieldCheck size={20} />, title: "No Fake Reviews", body: "Products are curated by the site admin — not pulled from an API feed." }
          ].map(({ icon, title, body }) => (
            <div className="trust-item" key={title}>
              <strong className="flex items-center gap-2 mb-2.5">
                {icon} {title}
              </strong>
              <small>{body}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Empty state ───────────────────────────────────────────────────────────── */
function EmptyProductsState() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-line bg-lifted">
      <div className="relative h-[180px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          aria-hidden="true"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=60"
          className="h-full w-full object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Package size={40} className="text-canvas/70" strokeWidth={1.2} />
        </div>
      </div>
      <div className="px-10 pb-11 pt-9 text-center">
        <h3 className="text-[1.4rem] mb-2.5 text-ink">
          Products coming soon
        </h3>
        <p className="text-slate mb-7 max-w-[360px] mx-auto">
          We&apos;re curating top picks right now. Browse a category to see what&apos;s available.
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {categories.slice(0, 3).map((cat) => (
            <Link
              className="btn-outline text-[0.85rem] py-[7px] px-[18px]"
              href={`/categories/${cat.slug}`}
              key={cat.slug}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
