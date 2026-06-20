import Link from "next/link";
import { PackageOpen } from "lucide-react";

type Props = {
  slug?: string;
};

export function ProductDetailEmpty({ slug }: Props) {
  return (
    <section className="pp-section">
      <div className="product-detail-state">
        <PackageOpen aria-hidden className="product-detail-state__icon" size={28} />
        <h1 className="product-detail-state__title">Product not found</h1>
        <p className="product-detail-state__copy">
          {slug
            ? `We don't have a detailed review for "${slug}" yet.`
            : "We couldn't find the product you're looking for."}
        </p>
        <div className="product-detail-state__actions">
          <Link className="btn-primary" href="/search">
            Browse products
          </Link>
          <Link className="btn-outline" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
