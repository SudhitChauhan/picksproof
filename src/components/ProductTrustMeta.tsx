import { Award, Star } from "lucide-react";

type Props = {
  brand?: string;
  amazonRating?: number | null;
  amazonReviewCount?: number | null;
  bestsellerRank?: number | null;
  bestsellerCategory?: string;
  modelNumber?: string;
  warranty?: string;
  countryOfOrigin?: string;
};

export function ProductTrustMeta({
  brand,
  amazonRating,
  amazonReviewCount,
  bestsellerRank,
  bestsellerCategory,
  modelNumber,
  warranty,
  countryOfOrigin
}: Props) {
  const chips: { label: string; icon?: React.ReactNode }[] = [];

  if (brand) chips.push({ label: brand });
  if (amazonRating != null && amazonReviewCount != null) {
    chips.push({
      label: `${amazonRating.toFixed(1)} on Amazon · ${formatCount(amazonReviewCount)} ratings`,
      icon: <Star size={14} className="fill-signal text-signal" />
    });
  }
  if (bestsellerRank != null && bestsellerCategory) {
    chips.push({
      label: `#${bestsellerRank} in ${bestsellerCategory}`,
      icon: <Award size={14} />
    });
  }
  if (modelNumber) chips.push({ label: `Model ${modelNumber}` });
  if (warranty) chips.push({ label: warranty });
  if (countryOfOrigin) chips.push({ label: `Made in ${countryOfOrigin}` });

  if (chips.length === 0) return null;

  return (
    <div className="product-trust-meta">
      <ul className="product-trust-chips">
        {chips.map(({ label, icon }) => (
          <li key={label} className="product-trust-chip">
            {icon}
            <span>{label}</span>
          </li>
        ))}
      </ul>
      {amazonRating != null && (
        <p className="product-trust-disclaimer">
          Rating and count reference Amazon.in — not a PickProof editorial score.
        </p>
      )}
    </div>
  );
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
