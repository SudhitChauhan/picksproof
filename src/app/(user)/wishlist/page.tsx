import Link from "next/link";
import { redirect } from "next/navigation";
import { buildLoginHref } from "@/lib/auth/redirect";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Wishlist — PickProof" };
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  if (!isSupabaseConfigured()) redirect(buildLoginHref("/wishlist"));

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect(buildLoginHref("/wishlist"));

  return (
    <section className="pp-section">
      <p className="eyebrow">Saved Products</p>
      <h1 className="text-[2.4rem] my-3 mb-4 text-ink">Your Wishlist</h1>
      <p style={{ color: "var(--slate)", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
        Wishlist functionality is coming soon. Browse and bookmark products to save them here.
      </p>
      <Link className="btn-outline" href="/">Browse products</Link>
    </section>
  );
}
