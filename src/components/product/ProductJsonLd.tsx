import type { ProductDetails } from "@/lib/products/product-details-types";
import { getSiteUrl } from "@/lib/products/get-product-details";
import { getProductImageSrc } from "@/lib/products/image-src";

type Props = {
  product: ProductDetails;
};

export function ProductJsonLd({ product }: Props) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/products/${product.slug}`;
  const imageSrc = getProductImageSrc(product.image);
  const image = imageSrc.startsWith("http") ? imageSrc : `${siteUrl}${imageSrc}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image,
    description: product.about.split("\n")[0],
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    sku: product.model,
    url,
    ...(product.pricing.currentPrice > 0
      ? {
          offers: {
            "@type": "Offer",
            price: product.pricing.currentPrice,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: product.pricing.affiliateUrl
          }
        }
      : {
          offers: {
            "@type": "Offer",
            url: product.pricing.affiliateUrl,
            availability: "https://schema.org/InStock"
          }
        }),
    ...(product.recommendation.confidence > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.recommendation.confidence,
            bestRating: 10,
            ratingCount: product.recommendation.dataPoints || undefined
          }
        }
      : {})
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}
