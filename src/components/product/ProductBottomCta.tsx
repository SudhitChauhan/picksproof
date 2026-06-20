import { ExternalLink } from "lucide-react";

type Props = {
  affiliateUrl: string;
  productName: string;
};

export function ProductBottomCta({ affiliateUrl, productName }: Props) {
  return (
    <section aria-labelledby="bottom-cta-heading" className="product-bottom-cta">
      <div className="product-bottom-cta__inner">
        <div>
          <p className="eyebrow product-bottom-cta__eyebrow">Ready to buy?</p>
          <h2 className="product-bottom-cta__title" id="bottom-cta-heading">
            {productName}
          </h2>
          <p className="product-bottom-cta__copy">
            Check the latest price on Amazon.in — link opens in a new tab.
          </p>
        </div>
        <a
          className="btn-affiliate product-bottom-cta__button"
          href={affiliateUrl}
          rel="noopener noreferrer sponsored"
          target="_blank"
        >
          See price on Amazon.in <ExternalLink aria-hidden size={16} />
        </a>
      </div>
    </section>
  );
}
