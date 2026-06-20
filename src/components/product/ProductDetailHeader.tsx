type Props = {
  category: string;
  name: string;
  brand: string;
  model: string;
  warranty: string;
};

export function ProductDetailHeader({ category, name, brand, model, warranty }: Props) {
  return (
    <header className="product-detail-header">
      <p className="eyebrow product-detail-header__category">{category}</p>
      <h1 className="product-detail-header__title">{name}</h1>
      <p className="product-detail-header__meta">
        <span>{brand}</span>
        <span aria-hidden="true" className="product-detail-header__dot">
          •
        </span>
        <span>
          Model <span className="sr-only">number</span> {model}
        </span>
        <span aria-hidden="true" className="product-detail-header__dot">
          •
        </span>
        <span>{warranty}</span>
      </p>
    </header>
  );
}
