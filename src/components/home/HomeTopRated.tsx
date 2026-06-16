import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { ProductRow } from "@/lib/products/types";
import { HomeSectionHead } from "./HomeSectionHead";

type Props = {
  products: ProductRow[];
};

export function HomeTopRated({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="pp-section home-top-rated home-band-muted">
      <HomeSectionHead
        action={
          <Link className="btn-outline text-[0.9rem]" href="/search">
            <Star aria-hidden className="size-4" />
            See all
          </Link>
        }
        eyebrow="Highly rated on Amazon"
        lead="Products with strong Amazon ratings and enough reviews to trust — still broken down by us."
        title={
          <>
            Top-Rated <em>Picks</em>
          </>
        }
      />

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
