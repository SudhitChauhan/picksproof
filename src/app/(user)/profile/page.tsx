import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Heart,
  LogOut,
  Mail,
  Package,
  Search,
  Shield,
  User
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { buildLoginHref } from "@/lib/auth/redirect";
import { formatAdminUsername } from "@/lib/admin/format-username";
import { categories } from "@/lib/data";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function logout() {
  "use server";
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const { redirect } = await import("next/navigation");
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export const metadata = { title: "Profile — PickProof" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) redirect(buildLoginHref("/profile"));

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect(buildLoginHref("/profile"));

  const isAdmin = isAdminUser(user);
  const name = (user.user_metadata?.name as string | undefined)?.trim() ?? "";
  const displayName = name || formatAdminUsername(user.email ?? "");
  const email = user.email ?? "";
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
    <div className="profile-page">
      <div className="profile-page-inner">
        <div className="profile-brand">
          <Logo href="/" variant="auth" />
        </div>

        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <h1>{displayName}</h1>
          <p>{email}</p>
          <span className={`profile-badge ${isAdmin ? "profile-badge--admin" : ""}`}>
            {isAdmin ? "Member + Administrator" : "Standard member"}
          </span>
        </div>

        <div className="profile-card">
          <h2>Account details</h2>
          <div className="profile-info-grid">
            <InfoRow icon={<User size={16} />} label="Display name" value={displayName} />
            <InfoRow icon={<Mail size={16} />} label="Email address" value={email} />
            <InfoRow icon={<CalendarDays size={16} />} label="Member since" value={joinedAt} />
            <InfoRow
              icon={<Package size={16} />}
              label="Account type"
              value={isAdmin ? "Public member profile" : "Shopping member"}
            />
          </div>
        </div>

        <div className="profile-card">
          <h2>Quick actions</h2>
          <div className="profile-actions">
            <Link className="btn-primary profile-action" href="/">
              <Search size={16} />
              Browse products
            </Link>
            <Link className="btn-outline profile-action" href="/wishlist">
              <Heart size={16} />
              My wishlist
            </Link>
            {isAdmin ? (
              <Link className="btn-outline profile-action" href={ADMIN_ROUTES.dashboard}>
                <Shield size={16} />
                Admin workspace
              </Link>
            ) : null}
            <form action={logout}>
              <button className="btn-outline profile-action profile-action--danger w-full" type="submit">
                <LogOut size={16} />
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="profile-card">
          <p className="eyebrow">Explore categories</p>
          <div className="profile-links">
            {categories.map((cat) => (
              <Link className="profile-link" href={`/categories/${cat.slug}`} key={cat.slug}>
                <span>{cat.title}</span>
                <ExternalLink size={14} />
              </Link>
            ))}
          </div>
        </div>

        {isAdmin ? (
          <p className="profile-footnote">
            Admin catalogue tools live in the{" "}
            <Link href={ADMIN_ROUTES.profile}>admin profile</Link>. This page is your public member
            account on PickProof.
          </p>
        ) : (
          <p className="profile-footnote">
            Save picks to your wishlist and browse verified affiliate recommendations across
            categories.
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="profile-info-row">
      <div className="profile-info-icon">{icon}</div>
      <div>
        <p className="profile-info-label">{label}</p>
        <p className="profile-info-value">{value}</p>
      </div>
    </div>
  );
}
