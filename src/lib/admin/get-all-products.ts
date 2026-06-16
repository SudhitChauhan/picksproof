import { redirect } from "next/navigation";
import type { AdminProductRow } from "@/lib/admin/get-dashboard-stats";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getAllProducts(): Promise<AdminProductRow[]> {
  if (!isSupabaseConfigured()) return [];

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
  return (data ?? []) as AdminProductRow[];
}
