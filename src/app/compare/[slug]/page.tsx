import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonAuthPrompt } from "@/components/ComparisonAuthPrompt";
import { ComparisonBoard } from "@/components/compare/ComparisonBoard";
import { buildCompareHref, parseCompareIds } from "@/lib/compare/types";
import { getCategory } from "@/lib/data";
import { PRODUCT_LIST_COLUMNS, type ProductRow } from "@/lib/products/types";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ids?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  return {
    title: category ? `Compare ${category.title} — PickProof` : "Compare — PickProof"
  };
}

export const dynamic = "force-dynamic";

export default async function ComparePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { ids: idsParam } = await searchParams;
  const category = getCategory(slug);
  if (!category) notFound();

  const requestedIds = parseCompareIds(idsParam);
  const compareHref = buildCompareHref(slug, requestedIds);

  let isAuthenticated = false;
  let products: ProductRow[] = [];
  let specs: {
    product_id: string;
    specification_title: string;
    title: string;
    description: string;
  }[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    isAuthenticated = !!user;

    if (requestedIds.length >= 2) {
      const { data } = await supabase
        .from("products")
        .select(PRODUCT_LIST_COLUMNS)
        .eq("category", slug)
        .in("id", requestedIds);

      const rows = (data ?? []) as ProductRow[];
      products = requestedIds
        .map((id) => rows.find((row) => row.id === id))
        .filter((row): row is ProductRow => Boolean(row));

      if (products.length >= 2) {
        const { data: specData } = await supabase
          .from("product_specifications")
          .select("product_id, specification_title, title, description")
          .in(
            "product_id",
            products.map((product) => product.id)
          );
        specs = specData ?? [];
      }
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
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] mb-4">Compare {category.title}</h1>
      <p className="text-slate max-w-[620px] leading-relaxed mb-10">
        Spec-by-spec comparison for up to three products. Prices are not shown here — use each
        product&apos;s Amazon.in link for current pricing.
      </p>

      {!isAuthenticated ? (
        <ComparisonAuthPrompt categoryTitle={category.title} returnTo={compareHref} />
      ) : requestedIds.length < 2 ? (
        <div className="rounded-[28px] border border-line bg-lifted px-8 py-10 text-center">
          <h3 className="text-[1.3rem] mb-3 text-ink">Select products to compare</h3>
          <p className="text-slate mb-6 max-w-[460px] mx-auto">
            Choose at least two products from the category page using the compare checkboxes.
          </p>
          <Link className="btn-primary" href={`/categories/${slug}`}>
            Browse {category.title}
          </Link>
        </div>
      ) : products.length < 2 ? (
        <div className="rounded-[28px] border border-line bg-lifted px-8 py-10 text-center">
          <h3 className="text-[1.3rem] mb-3 text-ink">Could not load comparison</h3>
          <p className="text-slate mb-6 max-w-[460px] mx-auto">
            One or more selected products are unavailable. Pick products again from the category page.
          </p>
          <Link className="btn-primary" href={`/categories/${slug}`}>
            Back to {category.title}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-slate text-sm mb-6 m-0">
            Comparing {products.length} product{products.length !== 1 ? "s" : ""} in {category.title}.
          </p>
          <ComparisonBoard products={products} specs={specs} />
        </>
      )}

      <Link className="btn-outline mt-10 inline-flex" href={`/categories/${slug}`}>
        ← Back to {category.title}
      </Link>
    </section>
  );
}
