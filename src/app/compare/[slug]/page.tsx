import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  return (
    <section className="pp-section">
      <p className="eyebrow">Comparison</p>
      <h1 style={{ fontSize: "2.4rem", fontWeight: 500, letterSpacing: "-0.02em", margin: "12px 0 20px" }}>
        Product comparisons coming soon
      </h1>
      <p style={{ color: "var(--slate)", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
        Side-by-side product comparisons will be available once we build out the comparison engine.
        Browse individual product details in the meantime.
      </p>
      <Link className="btn-outline" href="/">Back to home</Link>
    </section>
  );
}
