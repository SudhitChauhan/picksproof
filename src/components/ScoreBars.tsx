import type { Score } from "@/lib/products/product-details-types";
import { scoreBarTone } from "@/lib/products/format";

type Props = {
  scores: Score[];
  title?: string;
  subtitle?: string;
  columns?: 1 | 2;
};

export function ScoreBars({
  scores,
  title = "Product intelligence",
  subtitle = "Scored across six dimensions",
  columns = 2
}: Props) {
  if (scores.length === 0) return null;

  return (
    <section aria-labelledby="product-scores-heading" className="product-scores">
      <div className="product-scores__head">
        <p className="eyebrow" id="product-scores-heading">
          {title}
        </p>
        <h2 className="product-scores__title">{subtitle}</h2>
      </div>
      <ul
        className={`product-scores__grid ${columns === 2 ? "product-scores__grid--two" : ""}`}
        role="list"
      >
        {scores.map((item) => {
          const pct = Math.min(100, Math.max(0, (item.score / 10) * 100));
          const tone = scoreBarTone(item.score);

          return (
            <li key={item.title} className="product-score-item">
              <div className="product-score-item__head">
                <span className="product-score-item__label">{item.title}</span>
                <span className="product-score-item__value">
                  <span className="sr-only">{item.title} score </span>
                  {item.score.toFixed(1)}
                </span>
              </div>
              <div
                aria-label={`${item.title}: ${item.score.toFixed(1)} out of 10`}
                aria-valuemax={10}
                aria-valuemin={0}
                aria-valuenow={item.score}
                className="product-score-item__track"
                role="progressbar"
              >
                <span
                  className={`product-score-item__fill product-score-item__fill--${tone}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
