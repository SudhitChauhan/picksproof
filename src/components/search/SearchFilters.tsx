"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { getCategoryNavLabel } from "@/lib/category-visuals";
import type { Category } from "@/lib/data";
import { buildSearchHref, getSearchPlaceholder } from "@/lib/products/search-utils";

type Props = {
  categories: Category[];
  initialQuery: string;
  initialCategory?: string;
};

export function SearchFilters({ categories, initialQuery, initialCategory }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory ?? "all");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(
      buildSearchHref({
        q: query.trim() || undefined,
        category: category !== "all" ? category : undefined
      })
    );
  }

  const hasFilters = Boolean(initialQuery || initialCategory);

  return (
    <div className="search-filters">
      <form className="search-filters-form" onSubmit={handleSubmit}>
        <label className="search-filters-field search-filters-field--grow">
          <span className="search-filters-label">Search</span>
          <input
            aria-label="Search products"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={getSearchPlaceholder(category)}
            type="search"
            value={query}
          />
        </label>

        <label className="search-filters-field">
          <span className="search-filters-label">Category</span>
          <select
            aria-label="Filter by category"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {getCategoryNavLabel(cat.title)}
              </option>
            ))}
          </select>
        </label>

        <button className="btn-primary search-filters-submit" type="submit">
          <Search size={16} />
          Search
        </button>
      </form>

      {hasFilters ? (
        <div className="search-filters-active">
          {initialQuery ? (
            <span className="search-filters-pill">
              &ldquo;{initialQuery}&rdquo;
            </span>
          ) : null}
          {initialCategory ? (
            <span className="search-filters-pill">
              {getCategoryNavLabel(
                categories.find((cat) => cat.slug === initialCategory)?.title ?? ""
              )}
            </span>
          ) : null}
          <Link className="search-filters-clear" href="/search">
            <X size={14} />
            Clear filters
          </Link>
        </div>
      ) : null}
    </div>
  );
}
