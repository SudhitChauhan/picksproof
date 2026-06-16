import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { getCategoryIcon } from "@/lib/category-visuals";
import type { Category } from "@/lib/data";
import type { ProductRow } from "@/lib/products/types";

const PREVIEW_LIMIT = 3;

type CategoryBrowseSectionProps = {
  category: Category;
  products: ProductRow[];
};

export function CategoryBrowseSection({ category, products }: CategoryBrowseSectionProps) {
  const previewProducts = products.slice(0, PREVIEW_LIMIT);
  const categoryHref = `/categories/${category.slug}`;

  return (
    <section className="border-b border-line pb-12 last:border-b-0 last:pb-0">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="eyebrow m-0">{category.title}</p>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
          href={categoryHref}
        >
          See more
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {previewProducts.map((product) => (
          <Link
            key={product.id}
            className="group flex items-center gap-3.5 rounded-[18px] border border-line bg-lifted p-3.5 transition-[border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--ink)_18%,var(--line))] hover:shadow-[var(--shadow-md)]"
            href={`/reviews/${product.slug}`}
          >
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas">
              <ProductImage
                alt={product.name}
                className="h-full w-full object-cover"
                src={product.main_image_url}
              />
            </div>

            <div className="min-w-0 flex-1">
              {product.brand ? (
                <p className="m-0 truncate text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-slate">
                  {product.brand}
                </p>
              ) : null}
              <h3 className="m-0 mt-1 line-clamp-2 text-[0.92rem] font-bold leading-snug text-ink group-hover:text-signal">
                {product.name}
              </h3>
              {product.amazon_rating != null ? (
                <p className="m-0 mt-1.5 flex items-center gap-1 text-[0.78rem] font-semibold text-ink">
                  <Star size={12} className="shrink-0 fill-signal text-signal" />
                  {product.amazon_rating.toFixed(1)}
                </p>
              ) : (
                <span className="mt-1.5 flex h-5 items-center text-slate">
                  {getCategoryIcon(category.slug, 14)}
                </span>
              )}
            </div>

            <ChevronRight
              size={16}
              className="shrink-0 text-dust transition-transform group-hover:translate-x-0.5 group-hover:text-signal"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
