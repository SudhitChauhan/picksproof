import Link from "next/link";
import { getCategoryIcon } from "@/lib/category-visuals";
import { truncateBreadcrumb } from "@/lib/products/format";

type Props = {
  categorySlug: string;
  categoryLabel: string;
  productName: string;
};

export function ProductBreadcrumb({ categorySlug, categoryLabel, productName }: Props) {
  const categoryIcon = getCategoryIcon(categorySlug, 18);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true" className="breadcrumb-sep">
        ›
      </span>
      <Link href={`/categories/${categorySlug}`}>
        {categoryIcon}
        {categoryLabel}
      </Link>
      <span aria-hidden="true" className="breadcrumb-sep">
        ›
      </span>
      <span className="breadcrumb-current" title={productName}>
        {truncateBreadcrumb(productName)}
      </span>
    </nav>
  );
}
