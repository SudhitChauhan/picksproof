import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/app/(admin)/_components/AdminPageHeader";
import { EditProductForm } from "@/app/(admin)/products/[id]/edit/EditProductForm";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { loadProductFormRelations } from "@/lib/products/intelligence-db";
import { dbProductToFormInput, type EditProductFormInput } from "@/lib/products/schema";
import type { ProductRow } from "@/lib/products/types";
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

  const relations = await loadProductFormRelations(supabase, id);
  const formDefaults = {
    ...dbProductToFormInput(
      product,
      relations.specs,
      relations.intelligence,
      relations.evidence,
      relations.prosCons,
      relations.complaints,
      relations.personas
    ),
    id: product.id
  } satisfies EditProductFormInput;

  return (
    <div className="admin-page admin-page--form">
      <div className="admin-page-inner">
        <AdminPageHeader
          backHref={ADMIN_ROUTES.catalog}
          backLabel="Back to catalog"
          description="Update product details, intelligence scores, evidence, and attributes. Changes save to Supabase on submit."
          eyebrow="Edit Product"
          title={product.name}
        />
        <EditProductForm formDefaults={formDefaults} product={product as ProductRow} />
      </div>
    </div>
  );
}
