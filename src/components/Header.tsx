import Link from "next/link";
import { categories } from "@/lib/data";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function getHeaderUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

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

export async function Header() {
  const user = await getHeaderUser();
  const isAdmin = isAdminUser(user);

  return (
    <header className="site-header">
      <Link className="logo" href="/">
        PickProof
      </Link>
      <nav aria-label="Primary navigation">
        {categories.slice(0, 3).map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.slug}>
            {category.title.replace("Best ", "")}
          </Link>
        ))}
        {user ? (
          <>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/profile">Profile</Link>
            {isAdmin ? <Link href="/products">Products</Link> : null}
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
