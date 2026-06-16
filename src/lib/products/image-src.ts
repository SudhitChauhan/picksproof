import { isCloudinaryImageUrl } from "@/lib/cloudinary/urls";
import { isValidHttpsImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/products/sitestripe";

export function isProductImageMissing(src?: string | null): boolean {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) return true;
  return !(isCloudinaryImageUrl(trimmed) || isValidHttpsImageUrl(trimmed));
}

export function getProductImageSrc(src?: string | null): string {
  if (isProductImageMissing(src)) return PRODUCT_IMAGE_PLACEHOLDER;
  return src!.trim();
}
