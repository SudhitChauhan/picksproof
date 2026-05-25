import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductEntryForm } from "@/app/(admin)/products/new/ProductEntryForm";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Add Product - PickProof Admin"
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <span className="text-sm font-black uppercase tracking-[0.18em]">Setup required</span>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Connect Supabase first</h1>
          <p className="mt-4 leading-7">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your local environment before using the
            admin product form.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_32rem)] px-4 py-10 dark:bg-slate-950">
      <section className="mx-auto mb-8 max-w-7xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300"
          href="/products"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Product Manager
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
              Add a New Product
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-admin-muted dark:text-slate-400">
              Create a complete product record with retailer links, specs, pros, cons, and an
              editorial verdict.
            </p>
          </div>
          <div className="rounded-3xl border border-admin-line bg-white p-5 text-sm text-admin-muted shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Signed in as <strong className="text-admin-ink dark:text-white">{user.email}</strong>.
            This page is protected by admin metadata and Supabase RLS.
          </div>
        </div>
      </section>

      <ProductEntryForm />
    </main>
  );
}
