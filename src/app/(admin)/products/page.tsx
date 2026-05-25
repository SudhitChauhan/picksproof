import Link from "next/link";
import { redirect } from "next/navigation";
import { Edit3, ImageIcon, PackageOpen, Plus, Trash2 } from "lucide-react";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  [key: string]: unknown;
};

function getTextField(product: ProductRow, keys: string[], fallback = "Untitled product") {
  for (const key of keys) {
    const value = product[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function getScore(product: ProductRow) {
  const value = product.global_score ?? product.score ?? product.rating;
  const score = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;

  return Number.isFinite(score) ? score.toFixed(1) : "N/A";
}

async function getProducts() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect("/unauthorized");
  }

  let productsResult = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productsResult.error?.message.includes("created_at")) {
    productsResult = await supabase.from("products").select("*");
  }

  const { data, error } = productsResult;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProductRow[];
}

export const metadata = {
  title: "Products - PickProof Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_32rem)] px-4 py-10 dark:bg-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Admin Dashboard
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
              Products
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-admin-muted dark:text-slate-400">
              Manage review hub products, editorial scores, and affiliate inventory from one clean
              workspace.
            </p>
          </div>

          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700"
            href="/products/new"
          >
            <Plus className="size-4" />
            Add New Product
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-admin-line bg-admin-surface shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-admin-line bg-white/70 text-left text-xs font-black uppercase tracking-[0.14em] text-admin-muted dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Global Score</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const title = getTextField(product, ["title", "name"]);
                    const category = getTextField(
                      product,
                      ["category", "category_name", "categoryName"],
                      "Uncategorized"
                    );
                    const imageUrl = getTextField(
                      product,
                      ["main_image_url", "image_url", "image", "thumbnail_url"],
                      ""
                    );

                    return (
                      <tr
                        className="border-b border-admin-line last:border-b-0 dark:border-slate-800"
                        key={product.id}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-admin-line bg-white dark:border-slate-700 dark:bg-slate-950">
                              {imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img alt="" className="size-full object-cover" src={imageUrl} />
                              ) : (
                                <ImageIcon className="size-6 text-admin-muted" />
                              )}
                            </div>
                            <div>
                              <strong className="block text-base text-admin-ink dark:text-white">
                                {title}
                              </strong>
                              <span className="text-sm text-admin-muted dark:text-slate-400">
                                ID: {product.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-admin-muted dark:text-slate-300">
                          {category}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                            {getScore(product)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              className="inline-flex size-10 items-center justify-center rounded-full border border-admin-line text-admin-muted transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-400"
                              type="button"
                            >
                              <Edit3 className="size-4" />
                              <span className="sr-only">Edit {title}</span>
                            </button>
                            <button
                              className="inline-flex size-10 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                              type="button"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Delete {title}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid place-items-center px-6 py-20 text-center">
              <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                <PackageOpen className="size-9" />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-admin-ink dark:text-white">
                No products yet
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-admin-muted dark:text-slate-400">
                Start by adding your first product with retailer links, specs, pros, cons, and an
                editor verdict.
              </p>
              <Link
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                href="/products/new"
              >
                <Plus className="size-4" />
                Add New Product
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
