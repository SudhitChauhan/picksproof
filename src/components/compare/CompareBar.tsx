"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Scale, X } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { buildLoginHref } from "@/lib/auth/redirect";
import { buildCompareHref } from "@/lib/compare/types";
import { useCompare } from "./CompareContext";

type Props = {
  isAuthenticated: boolean;
};

export function CompareBar({ isAuthenticated }: Props) {
  const router = useRouter();
  const { categorySlug, selected, count, remove, clear } = useCompare();

  if (count === 0) return null;

  const canCompare = count >= 2;
  const compareHref = buildCompareHref(
    categorySlug,
    selected.map((item) => item.id)
  );

  function handleCompare() {
    if (!canCompare) return;
    if (!isAuthenticated) {
      router.push(buildLoginHref(compareHref));
      return;
    }
    router.push(compareHref);
  }

  return (
    <div className="compare-bar" role="region" aria-label="Product comparison">
      <div className="compare-bar-inner">
        <div className="compare-bar-copy">
          <span className="compare-bar-icon" aria-hidden>
            <Scale className="size-5" />
          </span>
          <div>
            <strong>{count} of 3 selected</strong>
            <p>{canCompare ? "Ready to compare side by side" : "Select one more product to compare"}</p>
          </div>
        </div>

        <div className="compare-bar-items">
          {selected.map((product) => (
            <div className="compare-bar-item" key={product.id}>
              <div className="compare-bar-thumb">
                <ProductImage alt="" className="compare-bar-thumb-img" src={product.main_image_url} />
              </div>
              <span className="compare-bar-item-name">{product.name}</span>
              <button
                aria-label={`Remove ${product.name} from comparison`}
                className="compare-bar-remove"
                onClick={() => remove(product.id)}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="compare-bar-actions">
          <button className="compare-bar-clear" onClick={clear} type="button">
            Clear all
          </button>
          <button
            className="compare-bar-cta"
            disabled={!canCompare}
            onClick={handleCompare}
            type="button"
          >
            Compare now
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
