/** Amazon Associates SiteStripe image hosts (regional adsystem endpoints). */
const SITESTRIPE_IMAGE_HOST_PATTERN = /amazon-adsystem\.com$/i;

/** Fallback when a product has no image — uses the site logo. */
export const PRODUCT_IMAGE_PLACEHOLDER = "/images/picksproof-logo.png";
/** Shared 16:9 marketing fallback for product detail (until per-product images are enabled). */
export const PRODUCT_DEFAULT_IMAGE = "/images/product-marketing.jpg";

export function isValidHttpsImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidSiteStripeImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && SITESTRIPE_IMAGE_HOST_PATTERN.test(hostname);
  } catch {
    return false;
  }
}

/** Keep only Associates SiteStripe image URLs; otherwise empty string. */
export function sanitizeSiteStripeImageUrl(url: string | null | undefined): string {
  const trimmed = url?.trim() ?? "";
  return isValidSiteStripeImageUrl(trimmed) ? trimmed : "";
}

/** Any https image URL suitable for Cloudinary remote fetch. */
export function sanitizeRemoteImageUrl(url: string | null | undefined): string {
  const trimmed = url?.trim() ?? "";
  return isValidHttpsImageUrl(trimmed) ? trimmed : "";
}

export function parseSiteStripe(html: string): { imageUrl: string; affiliateUrl: string } {
  if (!html.trim()) return { imageUrl: "", affiliateUrl: "" };

  if (html.startsWith("http") && !html.includes("<")) {
    return { imageUrl: "", affiliateUrl: html.trim() };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const link = doc.querySelector<HTMLAnchorElement>('a[href*="amazon"]');
    const affiliateUrl = link?.getAttribute("href") ?? "";
    const img =
      link?.querySelector<HTMLImageElement>("img") ??
      doc.querySelector<HTMLImageElement>('img:not([width="1"]):not([height="1"])');
    const rawImage = img?.getAttribute("src") ?? "";
    const imageUrl = sanitizeRemoteImageUrl(rawImage);
    return { affiliateUrl, imageUrl };
  } catch {
    return { imageUrl: "", affiliateUrl: "" };
  }
}
