import Link from "next/link";
import { CheckCircle, ExternalLink, Package, ShieldCheck } from "lucide-react";
import { HomeCategorySpotlight } from "@/components/home/HomeCategorySpotlight";
import { HomeComparePromo } from "@/components/home/HomeComparePromo";
import { HomeExploreCta } from "@/components/home/HomeExploreCta";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeSectionHead } from "@/components/home/HomeSectionHead";
import { HomeStatsStrip } from "@/components/home/HomeStatsStrip";
import { HomeTopRated } from "@/components/home/HomeTopRated";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryHeroImage, getCategoryIcon } from "@/lib/category-visuals";
import { categories } from "@/lib/data";
import { getHomePageData } from "@/lib/home/get-home-data";

export async function HomePageBody() {
  const { latestProducts, topRatedProducts, totalProducts, categoryCounts, spotlightCategorySlug } =
    await getHomePageData();

  const activeCategories = Object.values(categoryCounts).filter((count) => count > 0).length;

  const spotlightItems = categories
    .map((cat) => ({
      ...cat,
      productCount: categoryCounts[cat.slug] ?? 0
    }))
    .filter((cat) => cat.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 3);

  return (
    <>
      <HomeStatsStrip activeCategories={activeCategories} totalProducts={totalProducts} />

      {spotlightItems.length > 0 ? <HomeCategorySpotlight items={spotlightItems} /> : null}

      <HomeHowItWorks />

      <HomeComparePromo spotlightCategorySlug={spotlightCategorySlug} />

      <HomeTopRated products={topRatedProducts} />

      <HomeExploreCta />

      <div className="trust-strip">
        <div>
          <p className="home-section-tag">
            <span className="home-section-tag-dot" aria-hidden />
            Why trust us
          </p>
          <h2>Designed for proof, not pop-ups.</h2>
          <p className="mt-4">
            Every recommendation links to a full spec breakdown and uses honest affiliate CTAs —
            no pressure copy, no fake urgency.
          </p>
          <Link className="btn-outline trust-strip-link" href="/about">
            Learn our approach
          </Link>
        </div>
        <div className="trust-grid">
          {[
            {
              icon: <CheckCircle size={20} />,
              title: "Structured Specs",
              body: "Every product has a grouped specification table — no marketing fluff."
            },
            {
              icon: <ExternalLink size={20} />,
              title: "Amazon.in Links",
              body: 'All "See Price" buttons go directly to Amazon India with your affiliate tag.'
            },
            {
              icon: <ShieldCheck size={20} />,
              title: "No Fake Reviews",
              body: "Products are curated by the site admin — not pulled from an API feed."
            }
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

function EmptyProductsState() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-line bg-lifted">
      <div className="relative h-[180px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-charcoal to-signal/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Package size={40} className="text-canvas/70" strokeWidth={1.2} />
        </div>
      </div>
      <div className="px-10 pb-11 pt-9 text-center">
        <h3 className="text-[1.4rem] mb-2.5 text-ink">Products coming soon</h3>
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
