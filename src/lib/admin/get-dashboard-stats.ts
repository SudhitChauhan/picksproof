import { redirect } from "next/navigation";
import { categories } from "@/lib/data";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminProductRow = {
  id: string;
  name: string;
  category: string;
  main_image_url: string;
  slug: string;
  created_at: string;
  amazon_affiliate_url: string;
  description: string;
  features: string[];
};

export type DashboardStats = {
  totalProducts: number;
  categoryCounts: { slug: string; title: string; count: number }[];
  recentProducts: AdminProductRow[];
  addedByDay: number[];
  completenessPercent: number;
  completeCount: number;
  categoriesWithProducts: number;
  totalCategories: number;
  productsThisMonth: number;
};

function isProductComplete(product: AdminProductRow) {
  return Boolean(
    product.main_image_url &&
      product.amazon_affiliate_url &&
      product.description?.trim() &&
      Array.isArray(product.features) &&
      product.features.length > 0
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    return {
      totalProducts: 0,
      categoryCounts: categories.map((cat) => ({ slug: cat.slug, title: cat.title, count: 0 })),
      recentProducts: [],
      addedByDay: Array.from({ length: 31 }, () => 0),
      completenessPercent: 0,
      completeCount: 0,
      categoriesWithProducts: 0,
      totalCategories: categories.length,
      productsThisMonth: 0
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) redirect("/unauthorized");

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, category, main_image_url, slug, created_at, amazon_affiliate_url, description, features"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const products = (data ?? []) as AdminProductRow[];
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const addedByDay = Array.from({ length: daysInMonth }, () => 0);

  const categoryMap = new Map(categories.map((cat) => [cat.slug, 0]));

  let completeCount = 0;
  let productsThisMonth = 0;

  for (const product of products) {
    if (isProductComplete(product)) completeCount += 1;

    const created = new Date(product.created_at);
    if (created.getMonth() === month && created.getFullYear() === year) {
      productsThisMonth += 1;
      const dayIndex = created.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < addedByDay.length) {
        addedByDay[dayIndex] += 1;
      }
    }

    const current = categoryMap.get(product.category) ?? 0;
    categoryMap.set(product.category, current + 1);
  }

  const categoryCounts = categories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    count: categoryMap.get(cat.slug) ?? 0
  }));

  const categoriesWithProducts = categoryCounts.filter((cat) => cat.count > 0).length;
  const totalProducts = products.length;
  const completenessPercent =
    totalProducts === 0 ? 0 : Math.round((completeCount / totalProducts) * 100);

  return {
    totalProducts,
    categoryCounts,
    recentProducts: products.slice(0, 6),
    addedByDay,
    completenessPercent,
    completeCount,
    categoriesWithProducts,
    totalCategories: categories.length,
    productsThisMonth
  };
}
