import type { PersonaScore } from "@/lib/products/product-details-types";
import { scoreBarTone } from "@/lib/products/format";

type Props = {
  personas: PersonaScore[];
};

export function PersonaFitCards({ personas }: Props) {
  if (personas.length === 0) return null;

  return (
    <section aria-labelledby="personas-heading" className="product-personas">
      <h2 className="eyebrow" id="personas-heading">
        Who this fits
      </h2>
      <ul className="product-personas__grid" role="list">
        {personas.map((persona) => {
          const pct = Math.min(100, Math.max(0, (persona.score / 10) * 100));
          const tone = scoreBarTone(persona.score);

          return (
            <li key={persona.persona} className="product-persona-card">
              <div className="product-persona-card__head">
                <h3 className="product-persona-card__title">{persona.persona}</h3>
                <span className="product-persona-card__score">
                  <span className="sr-only">Fit score </span>
                  {persona.score.toFixed(1)}
                </span>
              </div>
              <div
                aria-label={`${persona.persona} fit score: ${persona.score.toFixed(1)} out of 10`}
                aria-valuemax={10}
                aria-valuemin={0}
                aria-valuenow={persona.score}
                className="product-score-item__track product-persona-card__track"
                role="progressbar"
              >
                <span
                  className={`product-score-item__fill product-score-item__fill--${tone}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="product-persona-card__description">{persona.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
