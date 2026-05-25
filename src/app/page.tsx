import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadge } from "@/components/TrustBadge";
import { categories, products } from "@/lib/data";

export default function Home() {
  const topProducts = products.slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Data-backed affiliate recommendations</span>
          <h1>Find the best products without the fake-review noise.</h1>
          <p>
            PickProof combines hands-on testing notes, user consensus, and clear comparison tables so shoppers can
            decide faster and click through with confidence.
          </p>
          <form className="search-bar" action="/search">
            <input name="q" placeholder="Search laptops, earbuds, home gear..." aria-label="Search products" />
            <button type="submit">Search Amazon</button>
          </form>
        </div>
        <div className="hero-panel">
          <h2>Admin-ready catalog</h2>
          <strong>{topProducts.length}</strong>
          <p>Add real products from the admin dashboard to publish recommendations here.</p>
          <Link href="/products">Manage products</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Start with a hub</span>
          <h2>Top Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Curated picks</span>
          <h2>Today&apos;s Top Recommendations</h2>
        </div>
        {topProducts.length > 0 ? (
          <div className="product-grid">
            {topProducts.map((product, index) => (
              <ProductCard product={product} topPick={index === 0} key={product.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No recommendations published yet</h3>
            <p>Add real products in the admin dashboard to populate this section.</p>
          </div>
        )}
      </section>

      <section className="trust-section">
        <div>
          <span className="eyebrow">Why trust us</span>
          <h2>Designed for proof, not pop-ups.</h2>
          <p>
            Every recommendation explains the scoring system, links to a deeper review, and uses clear affiliate CTAs
            like &quot;Check Current Price&quot; instead of pressure-heavy copy.
          </p>
        </div>
        <div className="trust-grid">
          <TrustBadge label="Tested by Experts" detail="Hands-on benchmarks and practical use cases." />
          <TrustBadge label="Data-Backed" detail="Scores combine specs, testing, and owner feedback." />
          <TrustBadge label="User Consensus" detail="Common praise and complaints are surfaced clearly." />
        </div>
      </section>
    </main>
  );
}
