import type { Source } from "@/lib/products/product-details-types";
import { formatCount } from "@/lib/products/format";

type Props = {
  sources: Source[];
};

export function SourcesBehindScore({ sources }: Props) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources-heading" className="product-sources-card">
      <h2 className="eyebrow" id="sources-heading">
        Sources behind this score
      </h2>
      <ul className="product-sources-card__list" role="list">
        {sources.map((source) => (
          <li key={source.sourceName} className="product-sources-card__item">
            <span>{source.sourceName}</span>
            {source.count != null ? (
              <span className="product-sources-card__count">{formatCount(source.count)}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
