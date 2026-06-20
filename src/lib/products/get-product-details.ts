import { getMockProductDetails } from "@/lib/products/mock-product-details";
import type { ProductDetails } from "@/lib/products/product-details-types";
import { getProductImageSrc } from "@/lib/products/image-src";
import {
  COMPLAINT_FREQUENCY_UI,
  linesToList,
  SHOULD_BUY_LABELS
} from "@/lib/products/intelligence-text";
import { loadProductFormRelations } from "@/lib/products/intelligence-db";
import { PRODUCT_DETAIL_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCategory } from "@/lib/data";

async function getProductRowBySlug(slug: string): Promise<ProductRow | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(PRODUCT_DETAIL_COLUMNS)
      .eq("slug", slug)
      .single();

    if (error || !product) return null;
    return product as ProductRow;
  } catch {
    return null;
  }
}

function discountPercent(current: number, mrp: number) {
  if (!mrp || mrp <= current) return undefined;
  return Math.round(((mrp - current) / mrp) * 100);
}

function mapToProductDetails(
  product: ProductRow,
  relations: Awaited<ReturnType<typeof loadProductFormRelations>>
): ProductDetails {
  const { intelligence, evidence, prosCons, complaints, personas, specs } = relations;
  const categoryTitle = getCategory(product.category)?.title ?? product.category.replace(/-/g, " ");
  const image = getProductImageSrc(product.image || product.main_image_url);
  const affiliateUrl = product.affiliate_url || product.amazon_affiliate_url;
  const model = product.model || product.model_number || product.model_name || "—";
  const price = product.price ?? 0;
  const mrp = product.mrp ?? undefined;

  const scores = [
    { title: "Performance", score: intelligence?.performance_score },
    { title: "Reliability", score: intelligence?.reliability_score },
    { title: "Value", score: intelligence?.value_score },
    { title: "Comfort", score: intelligence?.comfort_score },
    { title: "Maintenance", score: intelligence?.maintenance_score },
    { title: "Trust", score: intelligence?.trust_score }
  ].filter((item): item is { title: string; score: number } => item.score != null);

  const shouldBuyKey =
    intelligence?.should_buy === "buy" ||
    intelligence?.should_buy === "conditional" ||
    intelligence?.should_buy === "avoid"
      ? (intelligence.should_buy as "buy" | "conditional" | "avoid")
      : null;

  const dataPoints =
    evidence.reduce((sum, row) => sum + (row.review_count ?? 0), 0) ||
    product.amazon_review_count ||
    0;

  const specGroups = new Map<string, { label: string; value: string }[]>();
  for (const spec of specs) {
    const key = spec.specification_title || "General";
    if (!specGroups.has(key)) specGroups.set(key, []);
    specGroups.get(key)!.push({ label: spec.title, value: spec.description });
  }

  const pros = prosCons.filter((row) => row.type === "pro").map((row) => row.content);
  const cons = prosCons.filter((row) => row.type === "con").map((row) => row.content);

  return {
    id: product.id,
    slug: product.slug,
    categorySlug: product.category,
    name: product.name,
    category: (product.subcategory || categoryTitle).toUpperCase(),
    brand: product.brand,
    model,
    warranty: product.warranty || "—",
    image,
    recommendation: {
      label: shouldBuyKey ? SHOULD_BUY_LABELS[shouldBuyKey] : "See full review",
      confidence: intelligence?.confidence_score ?? product.amazon_rating ?? 0,
      dataPoints
    },
    pricing: {
      currentPrice: price,
      originalPrice: mrp,
      discountPercent: price && mrp ? discountPercent(price, mrp) : undefined,
      affiliateUrl
    },
    scores,
    whyBuy: linesToList(intelligence?.why_buy),
    whyAvoid: linesToList(intelligence?.why_avoid),
    bestFor: linesToList(intelligence?.best_for),
    notFor: linesToList(intelligence?.not_for),
    ownershipSummary: intelligence?.long_term_experience || product.description,
    hiddenIssues: linesToList(intelligence?.hidden_issues),
    pros: pros.length ? pros : (product.features ?? []).filter(Boolean).slice(0, 3),
    cons,
    complaints: complaints.map((row) => ({
      title: row.complaint,
      severity: COMPLAINT_FREQUENCY_UI[row.frequency as keyof typeof COMPLAINT_FREQUENCY_UI] ?? "Occasional"
    })),
    personas: personas.map((row) => ({
      persona: row.persona,
      score: row.score ?? 0,
      description: row.reason ?? ""
    })),
    specificationGroups: Array.from(specGroups.entries()).map(([category, groupSpecs]) => ({
      category,
      specs: groupSpecs
    })),
    about: product.description,
    sources: evidence.length
      ? evidence.map((row) => ({
          sourceName: row.source_name,
          count: row.review_count ?? undefined
        }))
      : product.amazon_review_count
        ? [{ sourceName: "Amazon.in verified reviews", count: product.amazon_review_count }]
        : []
  };
}

export async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  const product = await getProductRowBySlug(slug);
  if (!product) {
    return getMockProductDetails(slug);
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabaseClient();
  const relations = await loadProductFormRelations(supabase, product.id);
  return mapToProductDetails(product, relations);
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
