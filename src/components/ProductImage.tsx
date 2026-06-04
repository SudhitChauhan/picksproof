"use client";

// import { useState } from "react";
// import {
//   isValidSiteStripeImageUrl,
//   PRODUCT_IMAGE_PLACEHOLDER
// } from "@/lib/products/sitestripe";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ src: _src, alt: _alt, className: _className }: Props) {
  // const [failed, setFailed] = useState(false);
  // const valid =
  //   !failed && typeof src === "string" && isValidSiteStripeImageUrl(src);
  // const displaySrc = valid ? src : PRODUCT_IMAGE_PLACEHOLDER;

  return null;

  // return (
  //   // eslint-disable-next-line @next/next/no-img-element
  //   <img
  //     alt={alt}
  //     className={className}
  //     onError={() => setFailed(true)}
  //     src={displaySrc}
  //   />
  // );
}
