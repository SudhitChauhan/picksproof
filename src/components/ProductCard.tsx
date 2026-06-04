import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { getCategory } from "@/lib/data";
import type { ProductRow } from "@/lib/products/types";

type CardProduct = Pick<
  ProductRow,
  | "name"
  | "description"
  | "category"
  | "slug"
  | "amazon_affiliate_url"
  | "brand"
  | "amazon_rating"
  | "amazon_review_count"
>;

type Props = {
  product: CardProduct;
  icon?: React.ReactNode;
};

export function ProductCard({ product: p, icon }: Props) {
  const categoryLabel =
    getCategory(p.category)?.title ?? p.category.replace(/-/g, " ");
  const metaLabel = [p.brand, categoryLabel].filter(Boolean).join(" · ");

  return (
    <article className="product-card">
      <div className="product-card-body">
        <div className="product-card-head">
          {icon ? <span className="product-card-icon">{icon}</span> : null}
          {metaLabel ? <p className="product-card-category">{metaLabel}</p> : null}
        </div>

        <h3 className="product-card-title">
          <Link href={`/reviews/${p.slug}`}>{p.name}</Link>
        </h3>

        {p.amazon_rating != null && (
          <p className="product-card-rating">
            <Star size={14} className="fill-signal text-signal shrink-0" />
            <span>{p.amazon_rating.toFixed(1)}</span>
            {p.amazon_review_count != null && (
              <span className="product-card-rating-meta">
                {formatCount(p.amazon_review_count)} reviews on Amazon
              </span>
            )}
          </p>
        )}

        {p.description ? <p className="product-card-desc">{p.description}</p> : null}

        <div className="product-card-actions">
          <Link
            className="btn-primary flex-1 justify-center text-[0.88rem] py-[9px] px-3.5"
            href={`/reviews/${p.slug}`}
          >
            View Details
          </Link>
          {p.amazon_affiliate_url ? (
            <a
              className="btn-affiliate text-[0.88rem] py-[9px] px-3.5"
              href={p.amazon_affiliate_url}
              rel="noopener noreferrer sponsored"
              target="_blank"
            >
              See Price <ExternalLink size={13} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function formatCount(n: number) {
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
}
