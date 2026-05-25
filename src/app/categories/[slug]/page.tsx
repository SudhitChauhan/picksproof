import Link from "next/link";
import { notFound } from "next/navigation";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import { ScoreBars } from "@/components/ScoreBars";
import { categories, getCategory, getProductsByCategory } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(slug);
  const [bestOverall, bestBudget, premium] = categoryProducts;
  const topThreeProducts = [bestOverall, bestBudget, premium].filter(
    (product): product is NonNullable<typeof product> => Boolean(product)
  );

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Category guide</span>
        <h1>{category.title}</h1>
        <p>{category.hero}</p>
      </section>

      <section className="hub-layout">
        <FilterPanel category={category} />
        <div className="hub-content">
          <div className="top-three">
            {topThreeProducts.map((product, index) => (
              <article className="pick-summary" key={product.slug}>
                <span>{index === 0 ? "Best Overall" : index === 1 ? "Best Budget" : "Premium Pick"}</span>
                <h3>{product.name}</h3>
                <p>{product.tagline}</p>
                <strong>{product.rating}/10</strong>
              </article>
            ))}
          </div>

          {categoryProducts.length > 0 ? (
            <div className="product-feed">
              {categoryProducts.map((product) => (
                <div className="feed-item" key={product.slug}>
                  <ProductCard product={product} />
                  <div className="feed-score">
                    <h3>Genuine Scoring System</h3>
                    <ScoreBars scores={product.scores} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products published yet</h2>
              <p>Add real products in the admin dashboard to populate this category.</p>
            </div>
          )}

          <section className="buying-guide">
            <span className="eyebrow">Buying guide</span>
            <h2>How to choose from this category</h2>
            <p>
              Start with your real workload, then compare the specs that affect daily use: performance headroom,
              battery life, support, and long-term value. The best product is rarely the one with every premium feature;
              it is the one that solves your main need without expensive compromises.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
