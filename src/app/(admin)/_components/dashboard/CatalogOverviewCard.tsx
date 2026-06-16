import type { DashboardStats } from "@/lib/admin/get-dashboard-stats";

type Props = Pick<DashboardStats, "totalProducts" | "productsThisMonth" | "completeCount">;

export function CatalogOverviewCard({ totalProducts, productsThisMonth, completeCount }: Props) {
  const incomplete = Math.max(totalProducts - completeCount, 0);

  return (
    <article className="admin-widget admin-widget--lifted admin-widget--stats">
      <div className="admin-widget-head">
        <h2>Catalog Overview</h2>
        <p>Live snapshot of your affiliate catalogue.</p>
      </div>

      <div className="admin-venn">
        <div className="admin-venn-circle admin-venn-circle--ink">
          <strong>{totalProducts}</strong>
          <span>Total products</span>
        </div>
        <div className="admin-venn-circle admin-venn-circle--signal">
          <strong>{productsThisMonth}</strong>
          <span>Added this month</span>
        </div>
        <div className="admin-venn-circle admin-venn-circle--clay">
          <strong>{completeCount}</strong>
          <span>Fully detailed</span>
        </div>
      </div>

      <ul className="admin-legend">
        <li>
          <span className="admin-legend-dot admin-legend-dot--ink" />
          Catalogue size
        </li>
        <li>
          <span className="admin-legend-dot admin-legend-dot--signal" />
          New this month
        </li>
        <li>
          <span className="admin-legend-dot admin-legend-dot--clay" />
          Fully detailed
        </li>
        {incomplete > 0 ? (
          <li className="admin-legend-note">{incomplete} need more detail</li>
        ) : null}
      </ul>
    </article>
  );
}
