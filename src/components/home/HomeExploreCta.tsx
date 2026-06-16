import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/lib/data";
import { QUICK_SEARCHES } from "@/lib/products/search-utils";
import { HomeSectionHead } from "./HomeSectionHead";

export function HomeExploreCta() {
  return (
    <section className="home-explore-cta">
      <div className="home-explore-cta-inner">
        <HomeSectionHead
          align="center"
          eyebrow="Ready to dig in?"
          lead="Browse every category, run a quick search, or learn how we research every recommendation."
          title={
            <>
              Find your next purchase with <em>proof</em>
            </>
          }
        />

        <div className="home-explore-actions">
          <Link className="btn-primary" href="/search">
            <Search aria-hidden className="size-4" />
            Search all picks
          </Link>
          <Link className="btn-outline home-explore-outline" href="/about">
            About PicksProof
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="home-explore-quick">
          <span>Popular searches:</span>
          <div className="home-explore-chips">
            {QUICK_SEARCHES.map((item) => (
              <Link
                className="home-explore-chip"
                href={`/search?q=${encodeURIComponent(item.q)}`}
                key={item.q}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="home-explore-categories">
          {categories.map((cat) => (
            <Link className="home-explore-category" href={`/categories/${cat.slug}`} key={cat.slug}>
              {cat.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
