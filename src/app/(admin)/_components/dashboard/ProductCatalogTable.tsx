"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import type { AdminProductRow } from "@/lib/admin/get-dashboard-stats";

type Props = {
  products: AdminProductRow[];
  query: string;
  deleteProductAction: (id: string) => Promise<void>;
  emptyMessage?: string;
  showFiltersApplied?: boolean;
  totalProducts?: number;
};

function completenessScore(product: AdminProductRow) {
  let score = 0;
  if (product.main_image_url) score += 1;
  if (product.amazon_affiliate_url) score += 1;
  if (product.description?.trim()) score += 1;
  if (product.features?.length) score += 1;
  return score;
}

export function ProductCatalogTable({
  products,
  query,
  deleteProductAction,
  emptyMessage = "No products match your search.",
  showFiltersApplied = false,
  totalProducts = 0
}: Props) {
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) =>
      [product.name, product.category, product.slug, product.id]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [products, query]);

  return (
    <section className="admin-widget admin-widget--wide admin-catalog">
      <div className="admin-widget-head admin-widget-head--row">
        <div>
          <h2>Product Catalog</h2>
          <p>
            {showFiltersApplied
              ? `Showing ${filtered.length} of ${totalProducts} products`
              : "Manage listings shown across categories, reviews, and compare pages."}
          </p>
        </div>
        <Link className="admin-inline-action" href={ADMIN_ROUTES.addProduct}>
          <Plus className="size-4" />
          Add New
        </Link>
      </div>

      {filtered.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Completeness</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const score = completenessScore(product);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-table-product">
                        <div className="admin-table-thumb">
                          <ProductImage
                            alt=""
                            className="size-full object-contain p-2"
                            src={product.main_image_url}
                          />
                        </div>
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-table-pill">{product.category.replace(/-/g, " ")}</span>
                    </td>
                    <td>
                      <div aria-label={`${score} of 4 fields complete`} className="admin-mini-bars">
                        {Array.from({ length: 4 }, (_, index) => (
                          <span className={index < score ? "is-complete" : ""} key={index} />
                        ))}
                      </div>
                      <span className="admin-mini-bars-label">{score}/4 fields</span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          className="admin-icon-btn"
                          href={ADMIN_ROUTES.editProduct(product.id)}
                          title={`Edit ${product.name}`}
                        >
                          <Edit3 className="size-4" />
                          <span className="sr-only">Edit {product.name}</span>
                        </Link>
                        <form action={deleteProductAction.bind(null, product.id)}>
                          <button
                            className="admin-icon-btn admin-icon-btn--danger"
                            title={`Delete ${product.name}`}
                            type="submit"
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete {product.name}</span>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <p>{emptyMessage}</p>
          {totalProducts === 0 ? (
            <Link className="btn-primary" href={ADMIN_ROUTES.addProduct}>
              <Plus className="size-4" />
              Add Product
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
