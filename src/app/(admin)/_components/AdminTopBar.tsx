"use client";

import Link from "next/link";
import { ArrowLeft, Menu, Plus, Search, X } from "lucide-react";
import { useAdminUI } from "./AdminUIContext";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

type Props = {
  username: string;
  subtitle?: string;
  showSearch?: boolean;
  actionHref?: string;
  actionLabel?: string;
  searchQuery?: string;
  onSearch?: (value: string) => void;
};

export function AdminTopBar({
  username,
  subtitle = "Here's what's happening with your product catalogue today.",
  showSearch = true,
  actionHref = ADMIN_ROUTES.addProduct,
  actionLabel = "Add Product",
  searchQuery = "",
  onSearch
}: Props) {
  const { openMobileMenu } = useAdminUI();
  const ActionIcon =
    actionHref === ADMIN_ROUTES.dashboard || actionHref === ADMIN_ROUTES.catalog
      ? ArrowLeft
      : Plus;

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-intro">
        <button
          aria-label="Open menu"
          className="admin-topbar-menu"
          onClick={openMobileMenu}
          type="button"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <p className="admin-topbar-eyebrow">Admin dashboard</p>
          <h1 className="admin-topbar-title">Hi, {username}!</h1>
          <p className="admin-topbar-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="admin-topbar-actions">
        {showSearch ? (
          <label className="admin-search">
            <Search aria-hidden className="size-4 shrink-0 text-slate" />
            <input
              aria-label="Search products"
              onChange={(event) => onSearch?.(event.target.value)}
              placeholder="Search products, categories, or slugs"
              type="search"
              value={searchQuery}
            />
            {searchQuery ? (
              <button
                aria-label="Clear search"
                className="admin-search-clear"
                onClick={() => onSearch?.("")}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </label>
        ) : null}

        {actionHref ? (
          <Link className="btn-primary admin-topbar-cta" href={actionHref}>
            <ActionIcon className="size-4" />
            <span>{actionLabel}</span>
          </Link>
        ) : null}
      </div>
    </header>
  );
}
