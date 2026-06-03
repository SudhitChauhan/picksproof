import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Wishlist — PickProof" };
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <section className="pp-section">
      <p className="eyebrow">Saved Products</p>
      <h1 style={{ fontSize: "2.4rem", fontWeight: 500, letterSpacing: "-0.02em", margin: "12px 0 16px" }}>
        Your Wishlist
      </h1>
      <p style={{ color: "var(--slate)", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
        Wishlist functionality is coming soon. Browse and bookmark products to save them here.
      </p>
      <Link className="btn-outline" href="/">Browse products</Link>
    </section>
  );
}
