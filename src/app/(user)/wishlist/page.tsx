import { redirect } from "next/navigation";
import { Bookmark, Lock } from "lucide-react";
import { WishlistGrid } from "@/app/(user)/wishlist/WishlistGrid";
import { products } from "@/lib/data";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Wishlist - PickProof"
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <Lock className="size-8" />
          <h1 className="mt-3 text-4xl font-black tracking-tight">Connect Supabase first</h1>
          <p className="mt-4 leading-7">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your local environment before viewing
            saved products.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const savedProducts = products.slice(0, 3);

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_32rem)] px-4 py-10 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              <Bookmark className="size-4" />
              Saved Products
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
              Your Wishlist
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-admin-muted dark:text-slate-400">
              Keep a shortlist of products you want to revisit, compare, or buy later.
            </p>
          </div>
          <div className="rounded-3xl border border-admin-line bg-white p-5 text-sm text-admin-muted shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Showing mock saved products until the wishlist database table is added.
          </div>
        </div>

        <WishlistGrid initialProducts={savedProducts} />
      </section>
    </main>
  );
}
