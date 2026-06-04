import Link from "next/link";
import { categories } from "@/lib/data";
import { redirect } from "next/navigation";
import { CalendarDays, ExternalLink, LogOut, Mail, Package, Search, User } from "lucide-react";
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
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (user.user_metadata?.name as string | undefined) ?? "";
  const email = user.email ?? "";
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? "U";

  const joinedAt = new Date(user.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-start justify-center px-6 pb-20 pt-16">
      <div className="w-full max-w-[520px]">

        {/* Avatar + name */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-22 w-22 items-center justify-center rounded-full bg-ink text-canvas text-[1.8rem] font-bold tracking-[-0.04em] shadow-[var(--shadow-md)] h-[88px] w-[88px]">
            {initials}
          </div>
          <h1 className="text-[1.6rem] mb-1 text-ink">
            {name || "Welcome back"}
          </h1>
          <p className="text-slate text-[0.9rem] m-0">{email}</p>
        </div>

        {/* Info card */}
        <div className="auth-card mb-4">
          <div className="grid gap-5">
            <InfoRow icon={<User size={16} />} label="Full name" value={name || "—"} />
            <InfoRow icon={<Mail size={16} />} label="Email address" value={email} />
            <InfoRow icon={<CalendarDays size={16} />} label="Member since" value={joinedAt} />
            <InfoRow icon={<Package size={16} />} label="Account type" value="Standard user" />
          </div>

          <div className="mt-6 pt-6 border-t border-line grid gap-2.5">
            <Link className="btn-outline justify-center" href="/">
              <Search size={15} /> Browse products
            </Link>
            <form action={logout}>
              <button className="btn-primary w-full justify-center" type="submit">
                <LogOut size={15} /> Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-[20px] border border-line bg-lifted p-5">
          <p className="eyebrow mb-3.5">Quick links</p>
          <div className="grid gap-2.5">
            {categories.map((cat) => ({
              href: `/categories/${cat.slug}`,
              label: cat.title
            })).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between text-[0.9rem] text-ink font-normal py-1"
              >
                {label}
                <ExternalLink size={13} className="text-dust" />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[0.78rem] text-dust">
          Admin access is managed via Supabase app metadata.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-line bg-canvas text-slate">
        {icon}
      </div>
      <div>
        <p className="text-[0.75rem] font-bold text-slate mb-0.5 uppercase tracking-[0.04em]">{label}</p>
        <p className="text-[0.95rem] text-ink m-0 font-normal">{value}</p>
      </div>
    </div>
  );
}
