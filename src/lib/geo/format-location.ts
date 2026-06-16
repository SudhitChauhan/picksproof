function decodeHeader(value: string | null | undefined) {
  if (!value) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function getCountryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export function formatUserLocation(parts: {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}): string | null {
  const city = decodeHeader(parts.city);
  const region = decodeHeader(parts.region);
  const countryCode = decodeHeader(parts.country);
  const country = countryCode ? getCountryName(countryCode) : "";

  if (city && country && city.toLowerCase() !== country.toLowerCase()) {
    return `${city}, ${country}`;
  }
  if (city) return city;
  if (region && country) return `${region}, ${country}`;
  if (region) return region;
  if (country) return country;

  return null;
}
