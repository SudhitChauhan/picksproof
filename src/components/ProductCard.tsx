import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

type ProductCardProps = {
  product: Product;
  topPick?: boolean;
};

export function ProductCard({ product, topPick = false }: ProductCardProps) {
  return (
    <article className={topPick ? "product-card top-pick-card" : "product-card"}>
      <div className="product-image-wrap">
        {topPick ? <span className="ribbon">{product.badge}</span> : null}
        <Image
          src={product.image}
          alt={product.name}
          width={420}
          height={280}
          className="product-image"
        />
      </div>
      <div className="product-card-body">
        <div className="card-kicker">
          <span>{product.badge}</span>
          <strong>{product.rating}/10</strong>
        </div>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
        <div className="mini-pros">
          {product.pros.slice(0, 2).map((pro) => (
            <span key={pro}>✓ {pro}</span>
          ))}
        </div>
        <div className="card-actions">
          <Link className="secondary-link" href={`/reviews/${product.slug}`}>
            Read review
          </Link>
          <a className="cta-button" href={product.affiliateUrl} rel="nofollow sponsored noopener" target="_blank">
            Check Current Price
          </a>
        </div>
      </div>
    </article>
  );
}
