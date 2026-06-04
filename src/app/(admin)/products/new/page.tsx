import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductEntryForm } from "@/app/(admin)/products/new/ProductEntryForm";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Add Product — PickProof Admin" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <div className="admin-page-inner">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <span className="eyebrow">Setup required</span>
            <h1 className="mt-3 text-3xl tracking-tight">Connect Supabase first</h1>
            <p className="mt-4 leading-7">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment before using the admin panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  return (
    <div className="admin-page">
      <div className="admin-page-inner mb-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-admin-muted transition hover:text-admin-ink dark:text-slate-400"
          href="/products"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>

        <div className="mt-6 mb-8">
          <span className="eyebrow">Product Manager</span>
          <h1 className="mt-3 text-4xl tracking-tight text-admin-ink dark:text-white md:text-5xl">
            Add a New Product
          </h1>
          <p className="mt-3 text-base leading-7 text-admin-muted dark:text-slate-400">
            Fill in the details below. Paste your SiteStripe Image HTML to extract the product image
            (amazon-adsystem.com only) and affiliate link.
            link, then save.
          </p>
        </div>

        <ProductEntryForm />
      </div>
    </div>
  );
}
