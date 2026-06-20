import { ExternalLink } from "lucide-react";
import { formatCount } from "@/lib/products/format";

type Props = {
  label: string;
  confidence: number;
  dataPoints: number;
  ctaUrl: string;
};

export function RecommendationBanner({ label, confidence, dataPoints, ctaUrl }: Props) {
  return (
    <section
      aria-label="AI recommendation"
      className="product-recommendation"
    >
      <div className="product-recommendation__content">
        <div className="product-recommendation__status" role="status">
          <span aria-hidden="true" className="product-recommendation__dot" />
          <span className="product-recommendation__label">{label}</span>
        </div>
        <p className="product-recommendation__confidence">
          Confidence{" "}
          <strong>
            <span className="sr-only">score </span>
            {confidence.toFixed(1)}/10
          </strong>
        </p>
        <p className="product-recommendation__points">
          Based on {formatCount(dataPoints)} data points
        </p>
      </div>
      <a
        className="btn-affiliate product-recommendation__cta"
        href={ctaUrl}
        rel="noopener noreferrer sponsored"
        target="_blank"
      >
        See price on Amazon.in <ExternalLink aria-hidden size={16} />
      </a>
    </section>
  );
}
