import { FolderOpen, GitCompare, Package, Star } from "lucide-react";
import { categories } from "@/lib/data";

type Props = {
  totalProducts: number;
  activeCategories: number;
};

export function HomeStatsStrip({ totalProducts, activeCategories }: Props) {
  const stats = [
    {
      icon: Package,
      value: totalProducts > 0 ? `${totalProducts}+` : "Growing",
      label: "Curated products",
      detail: totalProducts > 0 ? "Hand-picked with full specs" : "New picks added regularly"
    },
    {
      icon: FolderOpen,
      value: String(categories.length),
      label: "Shopping categories",
      detail:
        activeCategories > 0
          ? `${activeCategories} with live reviews`
          : "From tech to fitness gear"
    },
    {
      icon: GitCompare,
      value: "3-way",
      label: "Side-by-side compare",
      detail: "Stack specs in one view"
    },
    {
      icon: Star,
      value: "Honest",
      label: "Amazon.in links",
      detail: "No fake urgency or pop-ups"
    }
  ];

  return (
    <section aria-label="Site highlights" className="home-stats-strip">
      <div className="home-stats-strip-inner">
        {stats.map(({ icon: Icon, value, label, detail }) => (
          <div className="home-stat" key={label}>
            <span aria-hidden className="home-stat-icon">
              <Icon className="size-5" />
            </span>
            <div>
              <strong className="home-stat-value">{value}</strong>
              <span className="home-stat-label">{label}</span>
              <small className="home-stat-detail">{detail}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
