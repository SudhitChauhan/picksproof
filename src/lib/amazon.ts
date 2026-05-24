import crypto from "crypto";

type AmazonSearchItem = {
  ASIN: string;
  DetailPageURL?: string;
  Images?: {
    Primary?: {
      Medium?: {
        URL?: string;
      };
    };
  };
  ItemInfo?: {
    Title?: {
      DisplayValue?: string;
    };
    ByLineInfo?: {
      Brand?: {
        DisplayValue?: string;
      };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        DisplayAmount?: string;
      };
    }>;
  };
};

export type AmazonProductResult = {
  asin: string;
  title: string;
  brand: string;
  price: string;
  image: string;
  url: string;
};

const mockAmazonResults: AmazonProductResult[] = [
  {
    asin: "B0MOCKASTER",
    title: "Aster Pro 14 Laptop",
    brand: "Aster",
    price: "$1,399",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    url: "https://www.amazon.com/?tag=yourtag-20"
  },
  {
    asin: "B0MOCKNOVA",
    title: "Nova Lite 13 Laptop",
    brand: "Nova",
    price: "$749",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    url: "https://www.amazon.com/?tag=yourtag-20"
  }
];

function hmac(key: string | Buffer, value: string) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest();
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function getSignatureKey(secretKey: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  return hmac(kService, "aws4_request");
}

function toAmazonResult(item: AmazonSearchItem): AmazonProductResult {
  return {
    asin: item.ASIN,
    title: item.ItemInfo?.Title?.DisplayValue ?? "Amazon product",
    brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue ?? "Unknown",
    price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? "Check price",
    image: item.Images?.Primary?.Medium?.URL ?? "",
    url: item.DetailPageURL ?? "https://www.amazon.com"
  };
}

export async function searchAmazonProducts(keywords: string): Promise<AmazonProductResult[]> {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  const partnerType = process.env.AMAZON_PARTNER_TYPE ?? "Associates";
  const marketplace = process.env.AMAZON_MARKETPLACE ?? "www.amazon.com";
  const host = process.env.AMAZON_PAAPI_HOST ?? "webservices.amazon.com";
  const region = process.env.AMAZON_PAAPI_REGION ?? "us-east-1";

  if (!accessKey || !secretKey || !partnerTag) {
    return mockAmazonResults;
  }

  const service = "ProductAdvertisingAPI";
  const method = "POST";
  const path = "/paapi5/searchitems";
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const payload = JSON.stringify({
    Keywords: keywords,
    Marketplace: marketplace,
    PartnerTag: partnerTag,
    PartnerType: partnerType,
    Resources: [
      "Images.Primary.Medium",
      "ItemInfo.Title",
      "ItemInfo.ByLineInfo",
      "Offers.Listings.Price"
    ]
  });

  const canonicalHeaders = [
    `content-encoding:amz-1.0`,
    `content-type:application/json; charset=utf-8`,
    `host:${host}`,
    `x-amz-date:${amzDate}`,
    `x-amz-target:${target}`
  ].join("\n");
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const canonicalRequest = [
    method,
    path,
    "",
    `${canonicalHeaders}\n`,
    signedHeaders,
    hash(payload)
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hash(canonicalRequest)
  ].join("\n");
  const signature = crypto
    .createHmac("sha256", getSignatureKey(secretKey, dateStamp, region, service))
    .update(stringToSign, "utf8")
    .digest("hex");

  const response = await fetch(`https://${host}${path}`, {
    method,
    headers: {
      "Content-Encoding": "amz-1.0",
      "Content-Type": "application/json; charset=utf-8",
      Host: host,
      "X-Amz-Date": amzDate,
      "X-Amz-Target": target,
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    },
    body: payload,
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Amazon PA-API request failed: ${response.status}`);
  }

  const data = await response.json();
  const items = data.SearchResult?.Items ?? [];
  return items.map(toAmazonResult);
}
