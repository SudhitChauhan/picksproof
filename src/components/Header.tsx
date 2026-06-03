import Link from "next/link";
import { categories } from "@/lib/data";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { UserDropdown } from "./UserDropdown";

async function getHeaderUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user ?? null;
  } catch {
    return null;
  }
}

async function logout() {
  "use server";
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const { redirect } = await import("next/navigation");
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function Header() {
  const user = await getHeaderUser();
  const isAdmin = isAdminUser(user);

  return (
    <div className="site-nav">
      {/* Logo */}
      <Link className="logo" href="/">
        PickProof
      </Link>

      {/* Category links — public */}
      <nav aria-label="Primary navigation">
        {categories.slice(0, 4).map((cat) => (
          <Link href={`/categories/${cat.slug}`} key={cat.slug}>
            {cat.title.replace("Best ", "")}
          </Link>
        ))}
      </nav>

      {/* Right-side actions */}
      <div className="nav-actions">
        {user ? (
          <UserDropdown
            email={user.email ?? "user"}
            isAdmin={isAdmin}
            logoutAction={logout}
          />
        ) : (
          <Link className="btn-primary" href="/login" style={{ padding: "8px 22px", fontSize: "0.88rem" }}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
