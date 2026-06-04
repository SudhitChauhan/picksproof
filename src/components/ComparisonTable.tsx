import Link from "next/link";
import type { ProductRow } from "@/lib/products/types";

type Spec = {
  product_id: string;
  specification_title: string;
  title: string;
  description: string;
};

type Props = {
  products: Pick<ProductRow, "id" | "name" | "slug" | "brand" | "amazon_rating">[];
  specs: Spec[];
  /** When set, only the first N spec rows are shown (category preview). */
  maxRows?: number;
};

/** Side-by-side spec comparison for products in the same category. */
export function ComparisonTable({ products, specs, maxRows }: Props) {
  if (products.length < 2) return null;

  const specKeys = new Map<string, string>();
  for (const s of specs) {
    const key = `${s.specification_title}::${s.title}`;
    specKeys.set(key, s.title);
  }

  const rowLimit = maxRows ?? 24;
  const rows = [...specKeys.entries()].slice(0, rowLimit);

  function valueFor(productId: string, rowKey: string) {
    const [group, title] = rowKey.split("::");
    const match = specs.find(
      (s) => s.product_id === productId && s.specification_title === group && s.title === title
    );
    return match?.description ?? "—";
  }

  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">Spec</th>
            {products.map((p) => (
              <th key={p.id} scope="col">
                <Link href={`/reviews/${p.slug}`}>{p.name}</Link>
                {p.brand && <small>{p.brand}</small>}
                {p.amazon_rating != null && <small>{p.amazon_rating.toFixed(1)} ★ on Amazon</small>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([rowKey, title]) => (
            <tr key={rowKey}>
              <th scope="row">{title}</th>
              {products.map((p) => (
                <td key={p.id}>{valueFor(p.id, rowKey)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
