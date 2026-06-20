import { Check, Minus } from "lucide-react";

type Props = {
  title: string;
  items: string[];
  variant: "buy" | "avoid" | "best" | "not";
};

const variantClass: Record<Props["variant"], string> = {
  buy: "product-insight-card--buy",
  avoid: "product-insight-card--avoid",
  best: "product-insight-card--best",
  not: "product-insight-card--not"
};

export function InsightCard({ title, items, variant }: Props) {
  if (items.length === 0) return null;

  const isList = variant === "buy" || variant === "avoid";

  return (
    <section className={`product-insight-card h-full ${variantClass[variant]}`}>
      <h3 className="product-insight-card__title">{title}</h3>
      {isList ? (
        <ul className="product-insight-card__list" role="list">
          {items.map((item) => (
            <li key={item}>
              {variant === "buy" ? (
                <Check aria-hidden className="product-insight-card__icon product-insight-card__icon--buy" size={16} strokeWidth={2.5} />
              ) : (
                <Minus aria-hidden className="product-insight-card__icon product-insight-card__icon--avoid" size={16} strokeWidth={2.5} />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="product-insight-card__chips" role="list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
