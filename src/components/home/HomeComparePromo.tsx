import Link from "next/link";
import { ArrowRight, Check, GitCompare } from "lucide-react";
import { getCategory } from "@/lib/data";

type Props = {
  spotlightCategorySlug: string | null;
};

const COMPARE_POINTS = [
  "Grouped specification tables",
  "Highlight differences instantly",
  "Up to 3 products per category",
  "Free account to save comparisons"
];

export function HomeComparePromo({ spotlightCategorySlug }: Props) {
  const category = spotlightCategorySlug ? getCategory(spotlightCategorySlug) : null;
  const compareHref = spotlightCategorySlug
    ? `/categories/${spotlightCategorySlug}`
    : "/search";

  return (
    <section className="home-compare-promo">
      <div className="home-compare-promo-inner">
        <div className="home-compare-promo-copy">
          <p className="home-section-tag">
            <span className="home-section-tag-dot" aria-hidden />
            Compare with confidence
          </p>
          <h2>
            Stop tab-hopping between <span className="hero-text-gradient">Amazon listings</span>.
          </h2>
          <p>
            Stack products in a single comparison board — see battery life, warranty, build quality,
            and what&apos;s missing without opening ten browser tabs.
          </p>

          <ul className="home-compare-list">
            {COMPARE_POINTS.map((point) => (
              <li key={point}>
                <Check aria-hidden className="size-4 shrink-0" />
                {point}
              </li>
            ))}
          </ul>

          <Link className="btn-primary home-compare-cta" href={compareHref}>
            <GitCompare aria-hidden className="size-4" />
            {category ? `Compare in ${category.title.split(" ")[0]}…` : "Start comparing"}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div aria-hidden className="home-compare-mock">
          <div className="home-compare-mock-header">
            <span>Wireless Earbuds</span>
            <span className="home-compare-mock-badge">3 selected</span>
          </div>
          <div className="home-compare-mock-grid">
            {["Battery", "ANC", "Warranty", "Weight"].map((row) => (
              <div className="home-compare-mock-row" key={row}>
                <span className="home-compare-mock-label">{row}</span>
                <span>32 hrs</span>
                <span className="home-compare-mock-highlight">40 hrs</span>
                <span>28 hrs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
