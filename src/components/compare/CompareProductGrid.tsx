"use client";

import { ProductCard } from "@/components/ProductCard";
import { getCategoryIcon } from "@/lib/category-visuals";
import type { CompareProduct } from "@/lib/compare/types";
import type { ProductRow } from "@/lib/products/types";
import { useCompare } from "./CompareContext";

type Props = {
  products: ProductRow[];
};

function toCompareProduct(product: ProductRow): CompareProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    main_image_url: product.main_image_url,
    brand: product.brand,
    amazon_rating: product.amazon_rating
  };
}

export function CompareProductGrid({ products }: Props) {
  const { isSelected, isFull, toggle } = useCompare();

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          compareDisabled={!isSelected(product.id) && isFull}
          compareMode
          compareSelected={isSelected(product.id)}
          icon={getCategoryIcon(product.category, 32)}
          key={product.id}
          onCompareToggle={() => toggle(toCompareProduct(product))}
          product={product}
        />
      ))}
    </div>
  );
}
