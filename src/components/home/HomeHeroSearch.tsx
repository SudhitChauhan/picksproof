import Link from "next/link";
import { ChevronDown, Layers, Search } from "lucide-react";
import { getCategoryNavLabel } from "@/lib/category-visuals";
import type { Category } from "@/lib/data";
import { QUICK_SEARCHES, buildSearchHref } from "@/lib/products/search-utils";

type Props = {
  categories: Category[];
};

export function HomeHeroSearch({ categories }: Props) {
  return (
    <form action="/search" className="hero-search-widget" method="get">
      <div className="hero-search-fields">
        <label className="hero-search-field hero-search-field--grow">
          <span className="hero-search-field-label">
            <Search aria-hidden className="size-4" />
            What are you looking for?
          </span>
          <input
            aria-label="Search products"
            autoComplete="off"
            name="q"
            placeholder="Wireless earbuds, air fryer, whey protein…"
            type="search"
          />
        </label>

        <label className="hero-search-field">
          <span className="hero-search-field-label">
            <Layers aria-hidden className="size-4" />
            Category
          </span>
          <span className="hero-search-select-wrap">
            <select aria-label="Filter by category" className="hero-search-select" name="category">
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {getCategoryNavLabel(cat.title)}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="hero-search-select-icon size-4" />
          </span>
        </label>

        <button className="hero-search-submit" type="submit">
          <Search aria-hidden className="size-5" />
          <span>Search</span>
        </button>
      </div>

      <div className="hero-search-quick">
        <span className="hero-search-quick-label">Popular:</span>
        <div className="hero-search-quick-list">
          {QUICK_SEARCHES.map((item) => (
            <Link
              className="hero-search-quick-chip"
              href={buildSearchHref({ q: item.q })}
              key={item.q}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </form>
  );
}
