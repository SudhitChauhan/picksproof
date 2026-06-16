import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { getCategory } from "@/lib/data";
import type { ProductRow } from "@/lib/products/types";

type CardProduct = Pick<
  ProductRow,
  | "id"
  | "name"
  | "description"
  | "category"
  | "slug"
  | "main_image_url"
  | "amazon_affiliate_url"
  | "brand"
  | "amazon_rating"
  | "amazon_review_count"
>;

type Props = {
  product: CardProduct;
  compareMode?: boolean;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  onCompareToggle?: () => void;
};

export function ProductCard({
  product: p,
  compareMode = false,
  compareSelected = false,
  compareDisabled = false,
  onCompareToggle
}: Props) {
  const categoryLabel =
    getCategory(p.category)?.title ?? p.category.replace(/-/g, " ");

  return (
    <article className={`product-card ${compareSelected ? "is-compare-selected" : ""}`}>
      <div className="product-card-media-wrap">
        {compareMode ? (
          <label className="product-card-compare">
            <input
              checked={compareSelected}
              disabled={compareDisabled}
              onChange={onCompareToggle}
              type="checkbox"
            />
            <span>Compare</span>
          </label>
        ) : null}

        <Link className="product-card-media" href={`/reviews/${p.slug}`}>
          <ProductImage
            alt={p.name}
            className="product-card-image"
            src={p.main_image_url}
          />
        </Link>
      </div>

      <div className="product-card-body">
        {categoryLabel ? <p className="product-card-eyebrow">{categoryLabel}</p> : null}

        <h3 className="product-card-title">
          <Link href={`/reviews/${p.slug}`}>{p.name}</Link>
        </h3>

        <div className="product-card-meta">
          {p.brand ? <span className="product-card-brand">{p.brand}</span> : null}
          {p.amazon_rating != null ? (
            <span className="product-card-rating">
              <Star aria-hidden className="product-card-rating-star" size={13} />
              <span>{p.amazon_rating.toFixed(1)}</span>
              {p.amazon_review_count != null ? (
                <span className="product-card-rating-count">
                  ({formatCount(p.amazon_review_count)})
                </span>
              ) : null}
            </span>
          ) : null}
        </div>

        <div className="product-card-actions">
          {p.amazon_affiliate_url ? (
            <a
              className="product-card-btn product-card-btn--accent"
              href={p.amazon_affiliate_url}
              rel="noopener noreferrer sponsored"
              target="_blank"
            >
              <span>See price</span>
              <ExternalLink aria-hidden className="product-card-btn-icon" size={14} />
            </a>
          ) : null}
          <Link className="product-card-btn product-card-btn--ghost" href={`/reviews/${p.slug}`}>
            <span>View review</span>
            <ArrowRight aria-hidden className="product-card-btn-icon" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatCount(n: number) {
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
}
