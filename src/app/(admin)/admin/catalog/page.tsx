import { Suspense } from "react";
import { AdminCatalogView } from "@/app/(admin)/_components/AdminCatalogView";
import { CatalogSuccessBanner } from "@/app/(admin)/_components/catalog/CatalogSuccessBanner";
import { deleteProductAction } from "@/app/admin/products/new/actions";
import { formatAdminUsername } from "@/lib/admin/format-username";
import { getAllProducts } from "@/lib/admin/get-all-products";
import { categories } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Catalog — PickProof Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const [products, supabase] = await Promise.all([getAllProducts(), createServerSupabaseClient()]);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const username = formatAdminUsername(user?.email ?? "admin");

  return (
    <>
      <Suspense fallback={null}>
        <CatalogSuccessBanner />
      </Suspense>
      <AdminCatalogView
      categories={categories}
      deleteProductAction={deleteProductAction}
      products={products}
      username={username}
    />
    </>
  );
}
