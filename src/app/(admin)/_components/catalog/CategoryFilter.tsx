"use client";

import type { Category } from "@/lib/data";

type Props = {
  categories: Category[];
  counts: Record<string, number>;
  total: number;
  value: string;
  onChange: (slug: string) => void;
};

export function CategoryFilter({ categories, counts, total, value, onChange }: Props) {
  return (
    <div className="admin-category-filter" role="tablist" aria-label="Filter by category">
      <button
        className={`admin-category-chip ${value === "all" ? "is-active" : ""}`}
        onClick={() => onChange("all")}
        type="button"
      >
        All categories
        <span>{total}</span>
      </button>
      {categories.map((category) => {
        const count = counts[category.slug] ?? 0;
        return (
          <button
            className={`admin-category-chip ${value === category.slug ? "is-active" : ""}`}
            key={category.slug}
            onClick={() => onChange(category.slug)}
            type="button"
          >
            {category.title.split("&")[0]?.trim() ?? category.title}
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
