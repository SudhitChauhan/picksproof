import Link from "next/link";
import { Pencil } from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

type Props = {
  percent: number;
  completeCount: number;
  totalProducts: number;
};

export function CatalogHealthCard({ percent, completeCount, totalProducts }: Props) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <article className="admin-widget admin-widget--stats">
      <div className="admin-widget-head">
        <h2>Catalog Health</h2>
        <p>Products with image, affiliate link, copy, and features.</p>
      </div>

      <div className="admin-gauge-wrap">
        <svg aria-hidden className="admin-gauge" viewBox="0 0 120 120">
          <circle
            className="admin-gauge-track"
            cx="60"
            cy="60"
            fill="none"
            r={radius}
            strokeWidth="10"
          />
          <circle
            className="admin-gauge-progress"
            cx="60"
            cy="60"
            fill="none"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="10"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="admin-gauge-center">
          <strong>{percent}%</strong>
          <span>Complete</span>
        </div>
        <div className="admin-gauge-meta">
          <strong>{completeCount}</strong>
          <span>of {totalProducts}</span>
        </div>
      </div>

      <Link className="admin-inline-action" href={ADMIN_ROUTES.catalog}>
        <Pencil className="size-4" />
        Review incomplete
      </Link>
    </article>
  );
}
