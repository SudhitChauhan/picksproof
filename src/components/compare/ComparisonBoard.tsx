import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import type { ProductRow } from "@/lib/products/types";

type Spec = {
  product_id: string;
  specification_title: string;
  title: string;
  description: string;
};

type Product = Pick<
  ProductRow,
  | "id"
  | "name"
  | "slug"
  | "brand"
  | "amazon_rating"
  | "amazon_review_count"
  | "main_image_url"
  | "amazon_affiliate_url"
>;

type Props = {
  products: Product[];
  specs: Spec[];
  maxRows?: number;
};

/** Side-by-side spec comparison for up to three products in the same category. */
export function ComparisonBoard({ products, specs, maxRows }: Props) {
  if (products.length < 2) return null;

  const specKeys = new Map<string, { group: string; title: string }>();
  for (const spec of specs) {
    const key = `${spec.specification_title}::${spec.title}`;
    specKeys.set(key, { group: spec.specification_title, title: spec.title });
  }

  const rowLimit = maxRows ?? 32;
  const rows = [...specKeys.entries()].slice(0, rowLimit);
  const columnCount = products.length;

  function valueFor(productId: string, rowKey: string) {
    const [group, title] = rowKey.split("::");
    const match = specs.find(
      (spec) =>
        spec.product_id === productId && spec.specification_title === group && spec.title === title
    );
    return match?.description ?? "—";
  }

  return (
    <div className="comparison-board">
      <div className="comparison-board-desktop">
        <div
          className="comparison-board-header"
          style={{
            gridTemplateColumns: `minmax(180px, 0.9fr) repeat(${columnCount}, minmax(0, 1fr))`
          }}
        >
          <div className="comparison-board-header-label">
            <p className="comparison-board-eyebrow">Side by side</p>
            <h2>Product comparison</h2>
          </div>

          {products.map((product, index) => (
            <ComparisonProductCard featured={index === 0} key={product.id} product={product} />
          ))}
        </div>

        <div className="comparison-board-body">
          {rows.map(([rowKey, meta]) => (
            <div
              className="comparison-board-row"
              key={rowKey}
              style={{
                gridTemplateColumns: `minmax(180px, 0.9fr) repeat(${columnCount}, minmax(0, 1fr))`
              }}
            >
              <div className="comparison-board-row-label">
                <span className="comparison-board-row-group">{meta.group}</span>
                <strong>{meta.title}</strong>
              </div>
              {products.map((product) => (
                <div className="comparison-board-cell" key={`${product.id}-${rowKey}`}>
                  {valueFor(product.id, rowKey)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="comparison-board-mobile">
        <div className="comparison-board-mobile-intro">
          <p className="comparison-board-eyebrow">Side by side</p>
          <h2>Product comparison</h2>
        </div>

        <div className="comparison-board-mobile-products">
          {products.map((product, index) => (
            <ComparisonProductCard featured={index === 0} key={product.id} product={product} />
          ))}
        </div>

        <div className="comparison-board-mobile-specs">
          {rows.map(([rowKey, meta]) => (
            <article className="comparison-board-mobile-spec" key={rowKey}>
              <header className="comparison-board-mobile-spec-head">
                <span className="comparison-board-row-group">{meta.group}</span>
                <strong>{meta.title}</strong>
              </header>
              <dl className="comparison-board-mobile-spec-values">
                {products.map((product) => (
                  <div className="comparison-board-mobile-spec-value" key={`${product.id}-${rowKey}`}>
                    <dt>{product.name}</dt>
                    <dd>{valueFor(product.id, rowKey)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonProductCard({
  product,
  featured = false
}: {
  product: Product;
  featured?: boolean;
}) {
  return (
    <article className={`comparison-board-product ${featured ? "is-featured" : ""}`}>
      <div className="comparison-board-product-media">
        <ProductImage
          alt={product.name}
          className="comparison-board-product-image"
          src={product.main_image_url}
        />
      </div>
      <div className="comparison-board-product-copy">
        {product.brand ? <p className="comparison-board-brand">{product.brand}</p> : null}
        <h3 className="comparison-board-product-name">
          <Link href={`/reviews/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.amazon_rating != null ? (
          <p className="comparison-board-rating">
            <Star aria-hidden className="comparison-board-rating-star" size={13} />
            <span>{product.amazon_rating.toFixed(1)}</span>
            {product.amazon_review_count != null ? (
              <span className="comparison-board-rating-count">
                ({formatCount(product.amazon_review_count)} reviews)
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
      <div className="comparison-board-product-actions">
        {product.amazon_affiliate_url ? (
          <a
            className="product-card-btn product-card-btn--accent comparison-board-btn"
            href={product.amazon_affiliate_url}
            rel="noopener noreferrer sponsored"
            target="_blank"
          >
            <span>See price</span>
            <ExternalLink aria-hidden className="product-card-btn-icon" size={14} />
          </a>
        ) : null}
        <Link
          className="product-card-btn product-card-btn--ghost comparison-board-btn"
          href={`/reviews/${product.slug}`}
        >
          <span>View review</span>
          <ArrowRight aria-hidden className="product-card-btn-icon" size={14} />
        </Link>
      </div>
    </article>
  );
}

function formatCount(n: number) {
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
}
