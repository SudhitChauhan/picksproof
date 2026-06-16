import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Plus,
  Shield,
  User
} from "lucide-react";
import { AdminPageHeader } from "@/app/(admin)/_components/AdminPageHeader";
import { formatAdminUsername } from "@/lib/admin/format-username";
import { getDashboardStats } from "@/lib/admin/get-dashboard-stats";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function logout() {
  "use server";
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export const metadata = { title: "Admin Profile — PickProof" };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  const stats = await getDashboardStats();
  const email = user.email ?? "";
  const displayName = formatAdminUsername(email);
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedAt = new Date(user.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="admin-page">
      <div className="admin-page-inner admin-profile-page">
        <AdminPageHeader
          backHref={ADMIN_ROUTES.dashboard}
          backLabel="Back to dashboard"
          description="Your administrator workspace on PickProof — separate from the public account profile."
          eyebrow="Admin Profile"
          title={displayName}
        />

        <div className="admin-profile-grid">
          <section className="admin-widget admin-profile-card">
            <div className="admin-profile-hero">
              <span className="admin-profile-avatar">{initials}</span>
              <div>
                <h2>{displayName}</h2>
                <p>{email}</p>
                <span className="admin-profile-badge">
                  <Shield className="size-3.5" />
                  Administrator
                </span>
              </div>
            </div>

            <dl className="admin-profile-meta">
              <div>
                <dt>
                  <Mail className="size-4" />
                  Email
                </dt>
                <dd>{email}</dd>
              </div>
              <div>
                <dt>
                  <CalendarDays className="size-4" />
                  Admin since
                </dt>
                <dd>{joinedAt}</dd>
              </div>
              <div>
                <dt>
                  <Package className="size-4" />
                  Catalogue size
                </dt>
                <dd>{stats.totalProducts} products</dd>
              </div>
            </dl>

            <form action={logout}>
              <button className="btn-primary admin-profile-signout" type="submit">
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </section>

          <section className="admin-widget admin-profile-card">
            <h2>Admin shortcuts</h2>
            <p className="admin-profile-copy">Jump straight to the tools you use most.</p>
            <div className="admin-profile-links">
              <Link className="admin-profile-link" href={ADMIN_ROUTES.dashboard}>
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <Link className="admin-profile-link" href={ADMIN_ROUTES.catalog}>
                <Package className="size-4" />
                Catalog
              </Link>
              <Link className="admin-profile-link" href={ADMIN_ROUTES.addProduct}>
                <Plus className="size-4" />
                Add product
              </Link>
              <Link className="admin-profile-link" href="/" rel="noopener noreferrer" target="_blank">
                <ExternalLink className="size-4" />
                View public site
              </Link>
            </div>
          </section>

          <section className="admin-widget admin-profile-card">
            <h2>Public account profile</h2>
            <p className="admin-profile-copy">
              Your member profile for browsing, wishlist, and public account settings lives outside the
              admin workspace.
            </p>
            <Link className="admin-inline-action" href="/profile">
              <User className="size-4" />
              Open public profile
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
