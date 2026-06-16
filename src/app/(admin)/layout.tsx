import { redirect } from "next/navigation";
import { AdminBodyClass } from "@/app/(admin)/_components/AdminBodyClass";
import { AdminShell } from "@/app/(admin)/_components/AdminShell";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function logout() {
  "use server";
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <AdminBodyClass />
        <div className="admin-shell admin-shell--setup">
          <main className="admin-main">{children}</main>
        </div>
      </>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  return (
    <>
      <AdminBodyClass />
      <AdminShell email={user.email ?? "admin"} logoutAction={logout}>
        {children}
      </AdminShell>
    </>
  );
}
