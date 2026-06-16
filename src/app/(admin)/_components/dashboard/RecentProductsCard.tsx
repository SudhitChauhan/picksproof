import Link from "next/link";
import { Edit3 } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import type { AdminProductRow } from "@/lib/admin/get-dashboard-stats";

type Props = {
  products: AdminProductRow[];
};

function completenessScore(product: AdminProductRow) {
  let score = 0;
  if (product.main_image_url) score += 1;
  if (product.amazon_affiliate_url) score += 1;
  if (product.description?.trim()) score += 1;
  if (product.features?.length) score += 1;
  return score;
}

export function RecentProductsCard({ products }: Props) {
  return (
    <article className="admin-widget admin-widget--wide">
      <div className="admin-widget-head admin-widget-head--row">
        <div>
          <h2>Recent Products</h2>
          <p>Latest additions to the catalogue.</p>
        </div>
        <Link className="admin-inline-action" href={ADMIN_ROUTES.catalog}>
          View all
        </Link>
      </div>

      {products.length > 0 ? (
        <ul className="admin-habit-list">
          {products.map((product) => {
            const score = completenessScore(product);
            return (
              <li key={product.id}>
                <div className="admin-habit-main">
                  <div className="admin-habit-thumb">
                    <ProductImage
                      alt=""
                      className="size-full object-contain p-1.5"
                      src={product.main_image_url}
                    />
                  </div>
                  <div className="admin-habit-copy">
                    <strong>{product.name}</strong>
                    <span>{product.category.replace(/-/g, " ")}</span>
                  </div>
                </div>
                <div className="admin-habit-progress">
                  <span>{score}/4 complete</span>
                  <div className="admin-mini-bars">
                    {Array.from({ length: 4 }, (_, index) => (
                      <span className={index < score ? "is-complete" : ""} key={index} />
                    ))}
                  </div>
                </div>
                <Link
                  className="admin-icon-btn"
                  href={ADMIN_ROUTES.editProduct(product.id)}
                  title={`Edit ${product.name}`}
                >
                  <Edit3 className="size-4" />
                  <span className="sr-only">Edit {product.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="admin-empty admin-empty--compact">
          <p>No products yet.</p>
        </div>
      )}
    </article>
  );
}
