"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminTopBar } from "@/app/(admin)/_components/AdminTopBar";
import { ActivityCalendarCard } from "@/app/(admin)/_components/dashboard/ActivityCalendarCard";
import { CatalogHealthCard } from "@/app/(admin)/_components/dashboard/CatalogHealthCard";
import { CatalogOverviewCard } from "@/app/(admin)/_components/dashboard/CatalogOverviewCard";
import { CategoryCoverageCard } from "@/app/(admin)/_components/dashboard/CategoryCoverageCard";
import { RecentProductsCard } from "@/app/(admin)/_components/dashboard/RecentProductsCard";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import type { DashboardStats } from "@/lib/admin/get-dashboard-stats";

type Props = {
  username: string;
  stats: DashboardStats;
  monthLabel: string;
  today: number;
};

export function AdminDashboardView({ username, stats, monthLabel, today }: Props) {
  return (
    <div className="admin-page">
      <div className="admin-page-inner">
        <AdminTopBar
          actionHref={ADMIN_ROUTES.addProduct}
          showSearch={false}
          subtitle="Overview of your catalogue health, publishing activity, and recent picks."
          username={username}
        />

        <div className="admin-grid">
          <CatalogOverviewCard
            completeCount={stats.completeCount}
            productsThisMonth={stats.productsThisMonth}
            totalProducts={stats.totalProducts}
          />
          <ActivityCalendarCard addedByDay={stats.addedByDay} monthLabel={monthLabel} today={today} />
          <CatalogHealthCard
            completeCount={stats.completeCount}
            percent={stats.completenessPercent}
            totalProducts={stats.totalProducts}
          />
          <CategoryCoverageCard
            categoriesWithProducts={stats.categoriesWithProducts}
            categoryCounts={stats.categoryCounts}
            totalCategories={stats.totalCategories}
          />
          <RecentProductsCard products={stats.recentProducts} />
        </div>
      </div>
    </div>
  );
}
