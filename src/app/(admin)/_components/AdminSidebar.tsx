"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  User,
  X
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { formatAdminUsername } from "@/lib/admin/format-username";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: ADMIN_ROUTES.dashboard,
    label: "Dashboard",
    icon: <LayoutDashboard className="size-5" strokeWidth={2} />,
    isActive: (pathname) => pathname === ADMIN_ROUTES.dashboard
  },
  {
    href: ADMIN_ROUTES.catalog,
    label: "Catalog",
    icon: <Package className="size-5" strokeWidth={2} />,
    isActive: (pathname) =>
      pathname === ADMIN_ROUTES.catalog ||
      (pathname.startsWith("/admin/products/") && pathname.endsWith("/edit"))
  },
  {
    href: ADMIN_ROUTES.addProduct,
    label: "Add Product",
    icon: <Plus className="size-5" strokeWidth={2} />,
    isActive: (pathname) => pathname === ADMIN_ROUTES.addProduct
  }
];

type Props = {
  email: string;
  logoutAction: () => Promise<void>;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function AdminSidebar({ email, logoutAction, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const username = formatAdminUsername(email);
  const initial = username[0]?.toUpperCase() ?? "A";

  return (
    <>
      <button
        aria-label="Close navigation"
        className={`admin-sidebar-backdrop ${mobileOpen ? "is-open" : ""}`}
        onClick={onMobileClose}
        tabIndex={mobileOpen ? 0 : -1}
        type="button"
      />

      <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-stack">
          <div className="admin-sidebar-panel admin-sidebar-panel--logo">
            <Logo href="/" variant="admin" />
            <button
              aria-label="Close menu"
              className="admin-sidebar-close"
              onClick={onMobileClose}
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Admin navigation" className="admin-sidebar-panel">
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  className={`admin-nav-item ${active ? "is-active" : ""}`}
                  href={item.href}
                  key={item.href}
                  onClick={onMobileClose}
                  title={item.label}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-panel">
            <Link
              className="admin-nav-item"
              href="/"
              onClick={onMobileClose}
              rel="noopener noreferrer"
              target="_blank"
              title="View site"
            >
              <span className="admin-nav-icon">
                <ExternalLink className="size-5" strokeWidth={2} />
              </span>
              <span className="admin-nav-label">View Site</span>
            </Link>
            <Link
              className={`admin-nav-item ${pathname === ADMIN_ROUTES.profile ? "is-active" : ""}`}
              href={ADMIN_ROUTES.profile}
              onClick={onMobileClose}
              title="Admin profile"
            >
              <span className="admin-nav-icon">
                <User className="size-5" strokeWidth={2} />
              </span>
              <span className="admin-nav-label">Profile</span>
            </Link>
          </div>
        </div>

        <div className="admin-sidebar-panel admin-sidebar-panel--user">
          <Link className="admin-user-chip" href={ADMIN_ROUTES.profile} onClick={onMobileClose}>
            <span className="admin-user-avatar">{initial}</span>
            <div className="admin-user-meta">
              <strong title={username}>{username}</strong>
              <span title={email}>{email}</span>
            </div>
          </Link>
          <form action={logoutAction}>
            <button className="admin-nav-item admin-nav-item--logout" type="submit">
              <span className="admin-nav-icon">
                <LogOut className="size-5" strokeWidth={2} />
              </span>
              <span className="admin-nav-label">Sign out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
