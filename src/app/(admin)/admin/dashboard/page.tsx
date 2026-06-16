import { AdminDashboardView } from "@/app/(admin)/_components/AdminDashboardView";
import { formatAdminUsername } from "@/lib/admin/format-username";
import { getDashboardStats } from "@/lib/admin/get-dashboard-stats";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard — PickProof Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, supabase] = await Promise.all([getDashboardStats(), createServerSupabaseClient()]);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const username = formatAdminUsername(user?.email ?? "admin");
  const now = new Date();
  const monthLabel = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <AdminDashboardView
      monthLabel={monthLabel}
      stats={stats}
      today={now.getDate()}
      username={username}
    />
  );
}
