import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { getCategoryHeroImage, getCategoryIcon } from "@/lib/category-visuals";
import { categories } from "@/lib/data";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "All Categories — PickProof",
  description:
    "Browse every shopping category on PickProof — curated picks, comparisons, and buying guides for Indian shoppers."
};

export const dynamic = "force-dynamic";

async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  if (!isSupabaseConfigured()) return counts;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("products").select("category");
    for (const row of data ?? []) {
      if (!row.category) continue;
      counts[row.category] = (counts[row.category] ?? 0) + 1;
    }
  } catch {
    return counts;
  }

  return counts;
}

export default async function CategoriesPage() {
  const categoryCounts = await getCategoryCounts();
  const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <section className="pp-section pb-10">
        <p className="eyebrow">Browse by category</p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] mt-3 mb-4 text-ink">All categories</h1>
        <p className="text-slate text-[0.95rem] max-w-[560px] m-0">
          Deep-dive hubs with curated picks, buying context, and side-by-side compare — organized
          the way Indian shoppers shop on Amazon.in.
        </p>
        {totalProducts > 0 ? (
          <p className="text-slate text-sm mt-4 m-0">
            {totalProducts} curated pick{totalProducts !== 1 ? "s" : ""} across {categories.length}{" "}
            categories
          </p>
        ) : null}
        <Link className="btn-outline mt-6 inline-flex items-center gap-2 text-[0.9rem]" href="/search">
          <Search size={16} />
          Search all picks
        </Link>
      </section>

      <section className="pp-section pt-0">
        <div className="category-grid">
          {categories.map((cat) => {
            const productCount = categoryCounts[cat.slug] ?? 0;

            return (
              <Link className="category-card" href={`/categories/${cat.slug}`} key={cat.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  aria-hidden
                  className="category-card-bg"
                  loading="lazy"
                  src={getCategoryHeroImage(cat.slug)}
                />
                <div className="category-card-overlay" />
                <div className="category-card-body">
                  <div className="category-card-icon">{getCategoryIcon(cat.slug, 20)}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-white/80 text-[0.8rem] font-semibold mt-2">
                    {productCount > 0
                      ? `${productCount} pick${productCount === 1 ? "" : "s"}`
                      : "Explore category"}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
