import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProsConsList } from "@/components/ProsConsList";
import { ScoreBars } from "@/components/ScoreBars";
import { TrustBadge } from "@/components/TrustBadge";
import { getProduct, products } from "@/lib/data";

type ReviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const alternatives = products
    .filter((candidate) => candidate.categorySlug === product.categorySlug && candidate.slug !== product.slug)
    .slice(0, 2);

  return (
    <main>
      <section className="review-hero">
        <div>
          <span className="eyebrow">{product.categoryName}</span>
          <h1>{product.name} Review</h1>
          <p>{product.summary}</p>
          <div className="rating-lockup">
            <strong>{product.rating}/10</strong>
            <span>{product.badge}</span>
          </div>
          <a className="cta-button" href={product.affiliateUrl} rel="nofollow sponsored noopener" target="_blank">
            Check Current Price
          </a>
        </div>
        <Image src={product.image} alt={product.name} width={680} height={460} className="review-image" priority />
      </section>

      <section className="section">
        <div className="trust-grid compact">
          <TrustBadge label="Tested by Experts" detail="Benchmarks matched to real buyer use cases." />
          <TrustBadge label="Data-Backed" detail="Scores show why the rating landed where it did." />
          <TrustBadge label="Affiliate Transparent" detail="Retail links are sponsored and labeled." />
        </div>
      </section>

      <section className="two-column-section">
        <article className="review-panel">
          <h2>The Good &amp; The Bad</h2>
          <ProsConsList pros={product.pros} cons={product.cons} />
        </article>
        <article className="review-panel">
          <h2>Testing Results</h2>
          <ScoreBars scores={product.scores} />
          <ul className="testing-list">
            {product.testedNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Alternatives</span>
          <h2>If you want something different</h2>
        </div>
        <div className="alternative-grid">
          {alternatives.map((alternative) => (
            <Link className="alternative-card" href={`/reviews/${alternative.slug}`} key={alternative.slug}>
              <span>{alternative.badge}</span>
              <h3>{alternative.name}</h3>
              <p>{alternative.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
