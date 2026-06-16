import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryHeroImage, getCategoryIcon } from "@/lib/category-visuals";
import type { Category } from "@/lib/data";
import { HomeSectionHead } from "./HomeSectionHead";

type SpotlightItem = Category & {
  productCount: number;
};

type Props = {
  items: SpotlightItem[];
};

export function HomeCategorySpotlight({ items }: Props) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;

  return (
    <section className="pp-section home-spotlight" id="categories">
      <HomeSectionHead
        action={
          <Link className="btn-outline text-[0.9rem]" href="#categories">
            All categories
          </Link>
        }
        eyebrow="Featured hubs"
        lead="Deep-dive category pages with buying context, curated picks, and built-in compare."
        title={
          <>
            Where shoppers <em>start most</em>
          </>
        }
      />

      <div className="home-spotlight-grid">
        <Link className="home-spotlight-featured" href={`/categories/${featured.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            aria-hidden
            className="home-spotlight-featured-img"
            loading="lazy"
            src={getCategoryHeroImage(featured.slug)}
          />
          <div className="home-spotlight-featured-overlay" />
          <div className="home-spotlight-featured-body">
            <div className="home-spotlight-icon">{getCategoryIcon(featured.slug, 24)}</div>
            <p className="home-spotlight-eyebrow">{featured.title}</p>
            <h3>{featured.hero}</h3>
            <p>{featured.description}</p>
            <span className="home-spotlight-link">
              {featured.productCount > 0
                ? `${featured.productCount} curated pick${featured.productCount === 1 ? "" : "s"}`
                : "Explore category"}
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </div>
        </Link>

        <div className="home-spotlight-side">
          {rest.map((cat) => (
            <Link className="home-spotlight-card" href={`/categories/${cat.slug}`} key={cat.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden
                className="home-spotlight-card-img"
                loading="lazy"
                src={getCategoryHeroImage(cat.slug)}
              />
              <div className="home-spotlight-card-overlay" />
              <div className="home-spotlight-card-body">
                <div className="home-spotlight-icon home-spotlight-icon--sm">
                  {getCategoryIcon(cat.slug, 18)}
                </div>
                <h3>{cat.title}</h3>
                <span className="home-spotlight-card-meta">
                  {cat.productCount > 0
                    ? `${cat.productCount} pick${cat.productCount === 1 ? "" : "s"}`
                    : "Browse hub"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
