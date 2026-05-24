import { notFound } from "next/navigation";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProsConsList } from "@/components/ProsConsList";
import { ScoreBars } from "@/components/ScoreBars";
import { comparisons, getComparison, getProduct } from "@/lib/data";

type ComparePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  const comparisonProducts = comparison.productSlugs.map(getProduct).filter((product) => product !== undefined);

  if (comparisonProducts.length < 2) {
    notFound();
  }

  const winner = getProduct(comparison.winnerSlug);

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Product comparison</span>
        <h1>{comparison.title}</h1>
        <p>Spec-by-spec breakdown, testing scores, and a clear recommendation for different buyers.</p>
      </section>

      <section className="section">
        <ComparisonTable products={comparisonProducts} winnerSlug={comparison.winnerSlug} />
      </section>

      <section className="two-column-section">
        {comparisonProducts.map((product) => (
          <article className="review-panel" key={product.slug}>
            <span className="eyebrow">{product.badge}</span>
            <h2>{product.name}</h2>
            <p>{product.summary}</p>
            <ScoreBars scores={product.scores} />
            <ProsConsList pros={product.pros} cons={product.cons} />
            <a className="cta-button wide" href={product.affiliateUrl} rel="nofollow sponsored noopener" target="_blank">
              Check Price on Amazon
            </a>
          </article>
        ))}
      </section>

      <section className="verdict">
        <span className="eyebrow">Clear verdict</span>
        <h2>{winner ? `${winner.name} wins for most shoppers` : "The winner depends on your priorities"}</h2>
        <p>{comparison.verdict}</p>
      </section>
    </main>
  );
}
