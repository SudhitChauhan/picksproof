import type { Product } from "@/lib/data";

type ComparisonTableProps = {
  products: Product[];
  winnerSlug: string;
};

export function ComparisonTable({ products, winnerSlug }: ComparisonTableProps) {
  const specKeys = Array.from(new Set(products.flatMap((product) => Object.keys(product.specs))));

  return (
    <div className="comparison-scroll">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Spec</th>
            {products.map((product) => (
              <th className={product.slug === winnerSlug ? "winner-cell" : ""} key={product.slug}>
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Overall Score</td>
            {products.map((product) => (
              <td className={product.slug === winnerSlug ? "winner-cell" : ""} key={product.slug}>
                <strong>{product.rating}/10</strong>
              </td>
            ))}
          </tr>
          {specKeys.map((spec) => (
            <tr key={spec}>
              <td>{spec}</td>
              {products.map((product) => (
                <td className={product.slug === winnerSlug ? "winner-cell" : ""} key={product.slug}>
                  {product.specs[spec] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
