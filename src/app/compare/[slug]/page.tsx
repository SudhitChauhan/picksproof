import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonAuthPrompt } from "@/components/ComparisonAuthPrompt";
import { ComparisonTable } from "@/components/ComparisonTable";
import { getCategory } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  return {
    title: category ? `Compare ${category.title} — PickProof` : "Compare — PickProof"
  };
}

export const dynamic = "force-dynamic";

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const compareHref = `/compare/${slug}`;
  let isAuthenticated = false;
  let products: ProductRow[] = [];
  let specs: { product_id: string; specification_title: string; title: string; description: string }[] =
    [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    isAuthenticated = !!user;

    const { data } = await supabase
      .from("products")
      .select(PRODUCT_LIST_COLUMNS)
      .eq("category", slug)
      .order("created_at", { ascending: false })
      .limit(2);
    products = (data ?? []) as ProductRow[];

    if (products.length >= 2) {
      const { data: specData } = await supabase
        .from("product_specifications")
        .select("product_id, specification_title, title, description")
        .in(
          "product_id",
          products.map((p) => p.id)
        );
      specs = specData ?? [];
    }
  }

  return (
    <section className="pp-section">
      <nav aria-label="Breadcrumb" className="breadcrumb mb-8">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/categories/${slug}`}>{category.title}</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Compare</span>
      </nav>

      <p className="eyebrow">Comparison</p>
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] mb-4">
        Compare {category.title}
      </h1>
      <p className="text-slate max-w-[560px] leading-relaxed mb-10">
        Spec-by-spec comparison using curated product data. Prices are not shown here — use each
        product&apos;s Amazon.in link for current pricing.
      </p>

      {!isAuthenticated ? (
        <ComparisonAuthPrompt categoryTitle={category.title} returnTo={compareHref} />
      ) : products.length >= 2 ? (
        <>
          <p className="text-slate text-sm mb-6 m-0">
            Comparing the first two products in {category.title}.
          </p>
          <ComparisonTable products={products} specs={specs} />
        </>
      ) : (
        <p className="text-slate mb-8">
          Add at least two products in this category to enable comparison.
        </p>
      )}

      <Link className="btn-outline mt-10 inline-flex" href={`/categories/${slug}`}>
        ← Back to {category.title}
      </Link>
    </section>
  );
}
