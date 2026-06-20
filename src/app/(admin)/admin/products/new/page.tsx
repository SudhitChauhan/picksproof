import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/app/(admin)/_components/AdminPageHeader";
import { ProductEntryForm } from "@/app/(admin)/products/new/ProductEntryForm";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Add Product — PickProof Admin" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <div className="admin-page-inner">
          <div className="admin-widget">
            <span className="eyebrow">Setup required</span>
            <h1 className="mt-3 text-3xl tracking-tight">Connect Supabase first</h1>
            <p className="mt-4 leading-7 text-slate">
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
    <div className="admin-page admin-page--form">
      <div className="admin-page-inner">
        <AdminPageHeader
          backHref={ADMIN_ROUTES.catalog}
          backLabel="Back to catalog"
          description="Import Amazon JSON, add intelligence scores, evidence, and attributes — then publish to the catalogue and product detail page."
          eyebrow="Product Manager"
          title="Add a New Product"
        />
        <ProductEntryForm />
      </div>
    </div>
  );
}
