"use client";

import { ProductDetailError } from "@/components/product/ProductDetailError";

type Props = {
  reset: () => void;
};

export default function ProductDetailsError({ reset }: Props) {
  return <ProductDetailError reset={reset} />;
}
