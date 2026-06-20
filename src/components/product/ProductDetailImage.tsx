import { ProductImage } from "@/components/ProductImage";

type Props = {
  src: string;
  alt: string;
};

export function ProductDetailImage({ src, alt }: Props) {
  return (
    <figure className="product-detail-image">
      <ProductImage alt={alt} className="product-detail-image__img" src={src} />
    </figure>
  );
}
