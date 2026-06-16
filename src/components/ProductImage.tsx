"use client";

import { useState } from "react";
import { LOGO_ALT, LOGO_SRC } from "@/components/Logo";
import { getProductImageSrc, isProductImageMissing } from "@/lib/products/image-src";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const missing = failed || isProductImageMissing(src);

  if (missing) {
    return (
      <div
        aria-label={alt || LOGO_ALT}
        className={`product-img-placeholder ${className ?? ""}`.trim()}
        role="img"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="product-img-placeholder-logo" src={LOGO_SRC} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      src={getProductImageSrc(src)}
    />
  );
}
