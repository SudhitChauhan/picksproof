"use client";

import { useMemo, useState } from "react";
import { AdminTopBar } from "@/app/(admin)/_components/AdminTopBar";
import { CategoryFilter } from "@/app/(admin)/_components/catalog/CategoryFilter";
import { ProductCatalogTable } from "@/app/(admin)/_components/dashboard/ProductCatalogTable";
import type { AdminProductRow } from "@/lib/admin/get-dashboard-stats";
import type { Category } from "@/lib/data";

type Props = {
  username: string;
  products: AdminProductRow[];
  categories: Category[];
  deleteProductAction: (id: string) => Promise<void>;
};

export function AdminCatalogView({
  username,
  products,
  categories,
  deleteProductAction
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      if (!matchesCategory) return false;
      if (!normalized) return true;

      return [product.name, product.category, product.slug, product.id]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [products, query, category]);

  return (
    <div className="admin-page">
      <div className="admin-page-inner">
        <AdminTopBar
          onSearch={setQuery}
          searchQuery={query}
          subtitle="Browse, filter, and manage every product in your affiliate catalogue."
          username={username}
        />

        <CategoryFilter
          categories={categories}
          counts={categoryCounts}
          onChange={setCategory}
          total={products.length}
          value={category}
        />

        <ProductCatalogTable
          deleteProductAction={deleteProductAction}
          emptyMessage={
            products.length === 0
              ? "No products yet. Add your first pick to get started."
              : "No products match your filters."
          }
          products={filteredProducts}
          query=""
          showFiltersApplied={category !== "all" || query.trim().length > 0}
          totalProducts={products.length}
        />
      </div>
    </div>
  );
}
