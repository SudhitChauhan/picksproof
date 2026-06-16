import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/app/(admin)/_components/AdminPageHeader";
import { EditProductForm } from "@/app/(admin)/products/[id]/edit/EditProductForm";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { PRODUCT_DETAIL_COLUMNS } from "@/lib/products/types";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Edit Product ${id.slice(0, 8)} — PickProof Admin` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq("id", id)
    .single();

  if (productError || !product) notFound();

  const { data: specs } = await supabase
    .from("product_specifications")
    .select("specification_title, title, description, sort_order")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="admin-page admin-page--form">
      <div className="admin-page-inner">
        <AdminPageHeader
          backHref={ADMIN_ROUTES.catalog}
          backLabel="Back to catalog"
          description="Update product details, specs, and affiliate links. Changes save to Supabase on submit."
          eyebrow="Edit Product"
          title={product.name}
        />
        <EditProductForm product={product} specs={specs ?? []} />
      </div>
    </div>
  );
}
