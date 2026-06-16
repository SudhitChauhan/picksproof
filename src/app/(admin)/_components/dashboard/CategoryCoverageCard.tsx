import type { DashboardStats } from "@/lib/admin/get-dashboard-stats";

type Props = Pick<DashboardStats, "categoriesWithProducts" | "totalCategories" | "categoryCounts">;

export function CategoryCoverageCard({
  categoriesWithProducts,
  totalCategories,
  categoryCounts
}: Props) {
  const percent =
    totalCategories === 0
      ? 0
      : Math.round((categoriesWithProducts / totalCategories) * 100);
  const topCategory = [...categoryCounts].sort((a, b) => b.count - a.count)[0];
  const label = topCategory?.count
    ? `${topCategory.title.split("&")[0]?.trim().split(" ")[0] ?? "Top"} · ${topCategory.count} products`
    : "No categories filled yet";
  const showPillOnBar = percent >= 18;

  return (
    <article className="admin-widget admin-widget--stats">
      <div className="admin-widget-head">
        <h2>Category Coverage</h2>
        <p>{percent}% of catalogue categories have at least one product.</p>
      </div>

      <div className="admin-progress-head">
        <strong>{percent}% covered</strong>
        <span>
          {categoriesWithProducts}/{totalCategories} categories
        </span>
      </div>

      <div className="admin-progress-track">
        <div className="admin-progress-fill" style={{ width: `${Math.max(percent, 4)}%` }} />
        {showPillOnBar ? (
          <span
            className="admin-progress-pill"
            style={{ left: `clamp(14%, ${percent}%, calc(100% - 14%))` }}
          >
            {label}
          </span>
        ) : null}
      </div>

      {!showPillOnBar ? <p className="admin-progress-caption">{label}</p> : null}

      <div className="admin-progress-scale">
        <span>0 categories</span>
        <span>{totalCategories} total</span>
      </div>
    </article>
  );
}
