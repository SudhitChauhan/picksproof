import { ExternalLink } from "lucide-react";
import { formatInr } from "@/lib/products/format";
import type { ProductDetails } from "@/lib/products/product-details-types";

type Props = {
  pricing: ProductDetails["pricing"];
};

export function PricingCard({ pricing }: Props) {
  const hasPrice = pricing.currentPrice > 0;

  return (
    <section aria-label="Pricing" className="product-pricing-card">
      {hasPrice ? (
        <div className="product-pricing-card__price-row">
          <p className="product-pricing-card__price">{formatInr(pricing.currentPrice)}</p>
          {pricing.originalPrice ? (
            <p className="product-pricing-card__original">{formatInr(pricing.originalPrice)}</p>
          ) : null}
          {pricing.discountPercent ? (
            <p className="product-pricing-card__discount">{pricing.discountPercent}% off</p>
          ) : null}
        </div>
      ) : (
        <p className="product-pricing-card__lead">Check the latest price on Amazon.in</p>
      )}
      <p className="product-pricing-card__note">Price on Amazon.in · updated daily</p>
      <a
        className="btn-affiliate product-pricing-card__cta"
        href={pricing.affiliateUrl}
        rel="noopener noreferrer sponsored"
        target="_blank"
      >
        See price on Amazon.in <ExternalLink aria-hidden size={16} />
      </a>
      <p className="product-pricing-card__disclaimer">
        Affiliate link — we may earn a commission. Price and availability are set by Amazon.in.
      </p>
    </section>
  );
}
