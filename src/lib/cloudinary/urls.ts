export function isCloudinaryImageUrl(url: string): boolean {
  if (!url.trim()) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export function isHttpsImageSource(url: string): boolean {
  if (!url.trim()) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
