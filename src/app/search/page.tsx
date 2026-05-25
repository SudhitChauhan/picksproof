import Image from "next/image";
import { searchAmazonProducts } from "@/lib/amazon";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "best laptop";
  const results = await searchAmazonProducts(query);

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Amazon product search</span>
        <h1>Results for &quot;{query}&quot;</h1>
        <p>
          These results come from Amazon Product Advertising API when credentials are configured.
        </p>
        <form className="search-bar" action="/search">
          <input name="q" defaultValue={query} aria-label="Search products" />
          <button type="submit">Search Again</button>
        </form>
      </section>

      <section className="section">
        {results.length > 0 ? (
          <div className="amazon-grid">
            {results.map((result) => (
              <article className="amazon-card" key={result.asin}>
                {result.image ? (
                  <Image src={result.image} alt={result.title} width={320} height={220} className="amazon-image" />
                ) : (
                  <div className="image-placeholder">No image</div>
                )}
                <div>
                  <span className="eyebrow">{result.brand}</span>
                  <h2>{result.title}</h2>
                  <strong>{result.price}</strong>
                  <a className="cta-button wide" href={result.url} rel="nofollow sponsored noopener" target="_blank">
                    View on Amazon
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No Amazon results available</h2>
            <p>Add Amazon Product Advertising API credentials to show live product results.</p>
          </div>
        )}
      </section>
    </main>
  );
}
