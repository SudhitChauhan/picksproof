/** Amazon Associates SiteStripe image hosts (regional adsystem endpoints). */
const SITESTRIPE_IMAGE_HOST_PATTERN = /amazon-adsystem\.com$/i;

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/product-placeholder.svg";
/** Shared 16:9 marketing fallback for product detail (until per-product images are enabled). */
export const PRODUCT_DEFAULT_IMAGE = "/images/product-marketing.jpg";

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
    const imageUrl = sanitizeSiteStripeImageUrl(rawImage);
    return { affiliateUrl, imageUrl };
  } catch {
    return { imageUrl: "", affiliateUrl: "" };
  }
}
