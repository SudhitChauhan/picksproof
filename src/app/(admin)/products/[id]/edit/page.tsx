import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EditProductForm } from "@/app/(admin)/products/[id]/edit/EditProductForm";
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
    .select("id, name, description, category, slug, main_image_url, amazon_affiliate_url")
    .eq("id", id)
    .single();

  if (productError || !product) notFound();

  const { data: specs } = await supabase
    .from("product_specifications")
    .select("specification_title, title, description, sort_order")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

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
          <span className="eyebrow">Edit Product</span>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-admin-ink dark:text-white md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-admin-muted dark:text-slate-400">
            Update the product details below. Changes are saved to Supabase immediately.
          </p>
        </div>

        <EditProductForm
          product={product as {
            id: string;
            name: string;
            description: string;
            category: string;
            slug: string;
            main_image_url: string;
            amazon_affiliate_url: string;
          }}
          specs={
            (specs ?? []) as {
              specification_title: string;
              title: string;
              description: string;
              sort_order: number;
            }[]
          }
        />
      </div>
    </div>
  );
}
