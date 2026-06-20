import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutProductSection } from "@/components/product/AboutProductSection";
import { InsightCard } from "@/components/product/InsightCard";
import { LongTermOwnership } from "@/components/product/LongTermOwnership";
import { PersonaFitCards } from "@/components/product/PersonaFitCards";
import { PricingCard } from "@/components/product/PricingCard";
import { ProductBottomCta } from "@/components/product/ProductBottomCta";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductDetailHeader } from "@/components/product/ProductDetailHeader";
import { ProductDetailImage } from "@/components/product/ProductDetailImage";
import { ProductJsonLd } from "@/components/product/ProductJsonLd";
import { RecommendationBanner } from "@/components/product/RecommendationBanner";
import { RecurringComplaints } from "@/components/product/RecurringComplaints";
import { SourcesBehindScore } from "@/components/product/SourcesBehindScore";
import { SpecificationGroups } from "@/components/product/SpecificationGroups";
import { ProsConsList } from "@/components/ProsConsList";
import { ScoreBars } from "@/components/ScoreBars";
import { getCategory } from "@/lib/data";
import { getProductDetails, getSiteUrl } from "@/lib/products/get-product-details";
import { getProductImageSrc } from "@/lib/products/image-src";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params;
  const product = await getProductDetails(slug);
  const siteUrl = getSiteUrl();

  if (!product) {
    return {
      title: "Product not found — PicksProof",
      robots: { index: false, follow: false }
    };
  }

  const description = product.about.split("\n")[0].slice(0, 160);
  const canonical = `${siteUrl}/products/${product.slug}`;
  const imageSrc = getProductImageSrc(product.image);
  const image = imageSrc.startsWith("http") ? imageSrc : `${siteUrl}${imageSrc}`;

  return {
    title: `${product.name} — PicksProof`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      siteName: "PicksProof",
      images: [{ url: image, alt: product.name }]
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image]
    }
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id: slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) notFound();

  const categoryLabel = getCategory(product.categorySlug)?.title ?? product.categorySlug.replace(/-/g, " ");

  return (
    <>
      <ProductJsonLd product={product} />

      <div className="pp-section pb-0! pt-9 product-detail-page">
        <ProductBreadcrumb
          categoryLabel={categoryLabel}
          categorySlug={product.categorySlug}
          productName={product.name}
        />
      </div>

      <article className="pp-section product-detail-page">
        <div className="product-detail-layout">
          <div className="product-detail-layout__main">
            <div className="product-detail-order-header">
              <ProductDetailHeader
                brand={product.brand}
                category={product.category}
                model={product.model}
                name={product.name}
                warranty={product.warranty}
              />
            </div>

            <div className="product-detail-order-banner">
              <RecommendationBanner
                confidence={product.recommendation.confidence}
                ctaUrl={product.pricing.affiliateUrl}
                dataPoints={product.recommendation.dataPoints}
                label={product.recommendation.label}
              />
            </div>

            <div className="product-detail-order-scores">
              <ScoreBars scores={product.scores} />
            </div>

            <div className="product-detail-order-specs">
              <SpecificationGroups groups={product.specificationGroups} />
            </div>

            <div className="product-detail-insights product-detail-order-insights">
              <div className="product-detail-order-why-buy">
                <InsightCard items={product.whyBuy} title="Why buy" variant="buy" />
              </div>
              <div className="product-detail-order-why-avoid">
                <InsightCard items={product.whyAvoid} title="Why avoid" variant="avoid" />
              </div>
            </div>

            <div className="product-detail-order-sources">
              <SourcesBehindScore sources={product.sources} />
            </div>

            <div className="product-detail-order-ownership">
              <LongTermOwnership hiddenIssues={product.hiddenIssues} summary={product.ownershipSummary} />
            </div>

            <ProsConsList cons={product.cons} pros={product.pros} />
            <RecurringComplaints complaints={product.complaints} />
            <PersonaFitCards personas={product.personas} />

            <AboutProductSection content={product.about} />

            <div className="product-detail-audience product-detail-order-audience">
              <InsightCard items={product.bestFor} title="Best for" variant="best" />
              <InsightCard items={product.notFor} title="Not for" variant="not" />
            </div>
          </div>

          <aside aria-label="Product image and pricing" className="product-detail-sidebar">
            <div className="product-detail-order-image">
              <ProductDetailImage alt={product.name} src={product.image} />
            </div>
            <div className="product-detail-order-pricing">
              <PricingCard pricing={product.pricing} />
            </div>
          </aside>
        </div>
      </article>

      <section className="pp-section pt-0 product-detail-order-bottom-cta">
        <ProductBottomCta affiliateUrl={product.pricing.affiliateUrl} productName={product.name} />
      </section>
    </>
  );
}
