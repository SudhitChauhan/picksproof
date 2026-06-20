"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { ensureProductImageUrl } from "@/lib/cloudinary/upload";
import { buildProductHref } from "@/lib/products/search-utils";
import { productFormToDbRow } from "@/lib/products/db-map";
import { saveProductRelatedData } from "@/lib/products/intelligence-db";
import { amazonJsonToProductForm, parseAmazonJsonInput } from "@/lib/products/amazon-import";
import {
  defaultProductFormValues,
  editProductFormSchema,
  productFormSchema,
  type EditProductFormValues,
  type ProductFormValues
} from "@/lib/products/schema";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function errorMsg(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error.";
}

async function assertAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    throw new Error("Admin access required.");
  }

  return supabase;
}

async function insertProduct(input: ProductFormValues) {
  const supabase = await assertAdmin();

  const mainImageUrl = await ensureProductImageUrl(input.mainImageUrl);
  const row = productFormToDbRow({ ...input, mainImageUrl });

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(row)
    .select("id")
    .single<{ id: string }>();

  if (productError || !product) {
    throw new Error(productError?.message ?? "Could not create product.");
  }

  try {
    await saveProductRelatedData(supabase, product.id, input);
  } catch (error) {
    await supabase.from("products").delete().eq("id", product.id);
    throw error;
  }

  revalidatePath(ADMIN_ROUTES.dashboard);
  revalidatePath(ADMIN_ROUTES.catalog);
  revalidatePath(buildProductHref(input.slug));

  return product.id;
}

// ── Create ────────────────────────────────────────────────────────────────────
export type CreateResult = { ok: true; id: string } | { ok: false; message: string };

export async function createProductAction(values: ProductFormValues): Promise<CreateResult> {
  const parsed = productFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  try {
    const id = await insertProduct(parsed.data);
    return { ok: true, id };
  } catch (error) {
    return { ok: false, message: errorMsg(error) };
  }
}

export type BulkImportResult =
  | { ok: true; created: number; skipped: number; errors: string[] }
  | { ok: false; message: string };

export async function importProductsFromJsonAction(jsonText: string): Promise<BulkImportResult> {
  const items = parseAmazonJsonInput(jsonText);

  if (!items.length) {
    return { ok: false, message: "No valid JSON products found. Paste an object, an array, or multiple objects separated by blank lines." };
  }

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const [index, item] of items.entries()) {
    const partial = amazonJsonToProductForm(item);
    const merged: ProductFormValues = {
      ...defaultProductFormValues,
      ...partial,
      name: partial.name || defaultProductFormValues.name,
      description: partial.description || defaultProductFormValues.description,
      slug: partial.slug || defaultProductFormValues.slug,
      category: partial.category || defaultProductFormValues.category,
      amazonAffiliateUrl: partial.amazonAffiliateUrl || "",
      mainImageUrl: "",
      features: partial.features ?? [],
      specs: partial.specs ?? defaultProductFormValues.specs
    } as ProductFormValues;

    const parsed = productFormSchema.safeParse(merged);
    if (!parsed.success) {
      skipped += 1;
      const label = partial.name || `Item ${index + 1}`;
      errors.push(`${label}: ${parsed.error.issues[0]?.message ?? "Invalid product data"}`);
      continue;
    }

    try {
      await insertProduct(parsed.data);
      created += 1;
    } catch (error) {
      skipped += 1;
      const label = partial.name || `Item ${index + 1}`;
      errors.push(`${label}: ${errorMsg(error)}`);
    }
  }

  if (created === 0) {
    return {
      ok: false,
      message: errors[0] ?? "No products could be imported. Check affiliate URLs and required fields."
    };
  }

  return { ok: true, created, skipped, errors };
}

// ── Update ────────────────────────────────────────────────────────────────────
export type UpdateResult = { ok: true } | { ok: false; message: string };

export async function updateProductAction(values: EditProductFormValues): Promise<UpdateResult> {
  const parsed = editProductFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const input = parsed.data;

  try {
    const supabase = await assertAdmin();

    const mainImageUrl = await ensureProductImageUrl(input.mainImageUrl);

    const { error: productError } = await supabase
      .from("products")
      .update(productFormToDbRow({ ...input, mainImageUrl }))
      .eq("id", input.id);

    if (productError) {
      return { ok: false, message: productError.message };
    }

    try {
      await saveProductRelatedData(supabase, input.id, input);
    } catch (error) {
      return { ok: false, message: errorMsg(error) };
    }

    revalidatePath(ADMIN_ROUTES.dashboard);
    revalidatePath(ADMIN_ROUTES.catalog);
    revalidatePath(buildProductHref(input.slug));

    return { ok: true };
  } catch (error) {
    return { ok: false, message: errorMsg(error) };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteProductAction(id: string): Promise<void> {
  try {
    const supabase = await assertAdmin();
    await supabase.from("products").delete().eq("id", id);
    revalidatePath(ADMIN_ROUTES.dashboard);
    revalidatePath(ADMIN_ROUTES.catalog);
  } catch {
    // swallow; client shows optimistic UI or reloads
  }

  redirect(ADMIN_ROUTES.catalog);
}
