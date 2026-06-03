import Link from "next/link";
import { redirect } from "next/navigation";
import { Edit3, ImageIcon, PackageOpen, Plus, Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/products/new/actions";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  main_image_url: string;
  slug: string;
  created_at: string;
};

async function getProducts(): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, main_image_url, slug, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export const metadata = { title: "Products — PickProof Admin" };
export const dynamic = "force-dynamic";

const card =
  "rounded-[2rem] border border-admin-line bg-admin-surface shadow-[0_24px_70px_rgba(16,42,67,0.08)] dark:border-slate-800 dark:bg-slate-900";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="admin-page">
      <div className="admin-page-inner">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span className="eyebrow" style={{ color: "var(--signal-light)" }}>Admin Dashboard</span>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-admin-ink dark:text-white">
              Products
            </h1>
            <p className="mt-3 text-base leading-7 text-admin-muted dark:text-slate-400">
              Full control over the product catalogue — add, edit, and delete.
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-3 text-sm font-bold text-[#F3F0EE] transition hover:opacity-80"
            href="/products/new"
          >
            <Plus className="size-4" />
            Add Product
          </Link>
        </div>

        {/* Table */}
        <div className={card}>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr className="border-b border-admin-line text-left text-xs font-black uppercase tracking-[0.12em] text-admin-muted dark:border-slate-800 dark:text-slate-400">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      className="border-b border-admin-line last:border-b-0 dark:border-slate-800"
                      key={product.id}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-admin-line bg-[#F4F4F4] dark:border-slate-700">
                            {product.main_image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                alt=""
                                className="size-full object-contain p-2"
                                src={product.main_image_url}
                              />
                            ) : (
                              <ImageIcon className="size-5 text-admin-muted" />
                            )}
                          </div>
                          <div>
                            <strong className="block text-sm text-admin-ink dark:text-white">
                              {product.name}
                            </strong>
                            <span className="text-xs text-admin-muted dark:text-slate-400">
                              ID: {product.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold capitalize text-admin-muted dark:text-slate-300">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-admin-muted dark:text-slate-400 font-mono">
                        {product.slug}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            className="inline-flex size-10 items-center justify-center rounded-full border border-admin-line text-admin-muted transition hover:border-[#141413] hover:text-[#141413] dark:border-slate-700 dark:text-slate-400"
                            href={`/products/${product.id}/edit`}
                            title="Edit product"
                          >
                            <Edit3 className="size-4" />
                            <span className="sr-only">Edit {product.name}</span>
                          </Link>

                          <form
                            action={async () => {
                              "use server";
                              await deleteProductAction(product.id);
                            }}
                          >
                            <button
                              className="inline-flex size-10 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                              title={`Delete ${product.name}`}
                              type="submit"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Delete {product.name}</span>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid place-items-center px-6 py-24 text-center">
              <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-[#F4F4F4] text-admin-muted dark:bg-slate-800">
                <PackageOpen className="size-9" />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-admin-ink dark:text-white">
                No products yet
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-admin-muted dark:text-slate-400">
                Add your first product and it will appear here and on the public site.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-3 text-sm font-bold text-[#F3F0EE] transition hover:opacity-80"
                href="/products/new"
              >
                <Plus className="size-4" />
                Add Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
