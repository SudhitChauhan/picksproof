import { Minus, Plus } from "lucide-react";

type Props = {
  pros: string[];
  cons: string[];
};

export function ProsConsList({ pros, cons }: Props) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <section aria-labelledby="pros-cons-heading" className="product-pros-cons">
      <h2 className="eyebrow" id="pros-cons-heading">
        Pros &amp; cons
      </h2>
      <div className="product-pros-cons__grid">
        {pros.length > 0 ? (
          <div className="product-pros-cons__column">
            <h3 className="sr-only">Pros</h3>
            <ul role="list">
              {pros.map((item) => (
                <li key={item}>
                  <Plus aria-hidden className="product-pros-cons__icon product-pros-cons__icon--pro" size={16} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {cons.length > 0 ? (
          <div className="product-pros-cons__column">
            <h3 className="sr-only">Cons</h3>
            <ul role="list">
              {cons.map((item) => (
                <li key={item}>
                  <Minus aria-hidden className="product-pros-cons__icon product-pros-cons__icon--con" size={16} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
