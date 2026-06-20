"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

type Props = {
  reset?: () => void;
};

export function ProductDetailError({ reset }: Props) {
  return (
    <section className="pp-section">
      <div className="product-detail-state">
        <AlertTriangle aria-hidden className="product-detail-state__icon" size={28} />
        <h1 className="product-detail-state__title">Something went wrong</h1>
        <p className="product-detail-state__copy">
          We couldn&apos;t load this product right now. Please try again in a moment.
        </p>
        <div className="product-detail-state__actions">
          {reset ? (
            <button className="btn-primary" onClick={reset} type="button">
              Try again
            </button>
          ) : null}
          <Link className="btn-outline" href="/search">
            Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}
