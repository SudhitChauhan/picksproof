"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productFormToDbRow } from "@/lib/products/db-map";
import {
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

// ── Create ────────────────────────────────────────────────────────────────────
export type CreateResult = { ok: true; id: string } | { ok: false; message: string };

export async function createProductAction(values: ProductFormValues): Promise<CreateResult> {
  const parsed = productFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const input = parsed.data;

  try {
    const supabase = await assertAdmin();

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(productFormToDbRow(input))
      .select("id")
      .single<{ id: string }>();

    if (productError || !product) {
      return { ok: false, message: productError?.message ?? "Could not create product." };
    }

    const specRows = input.specs.map((spec, i) => ({
      product_id: product.id,
      specification_title: spec.specificationTitle,
      title: spec.title,
      description: spec.description,
      sort_order: i
    }));

    const { error: specError } = await supabase.from("product_specifications").insert(specRows);

    if (specError) {
      await supabase.from("products").delete().eq("id", product.id);
      return { ok: false, message: `Specs could not be saved: ${specError.message}` };
    }

    revalidatePath("/products");
    revalidatePath(`/reviews/${input.slug}`);

    return { ok: true, id: product.id };
  } catch (error) {
    return { ok: false, message: errorMsg(error) };
  }
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

    const { error: productError } = await supabase
      .from("products")
      .update(productFormToDbRow(input))
      .eq("id", input.id);

    if (productError) {
      return { ok: false, message: productError.message };
    }

    // Replace all specs
    await supabase.from("product_specifications").delete().eq("product_id", input.id);

    const specRows = input.specs.map((spec, i) => ({
      product_id: input.id,
      specification_title: spec.specificationTitle,
      title: spec.title,
      description: spec.description,
      sort_order: i
    }));

    const { error: specError } = await supabase.from("product_specifications").insert(specRows);

    if (specError) {
      return { ok: false, message: `Specs could not be updated: ${specError.message}` };
    }

    revalidatePath("/products");
    revalidatePath(`/reviews/${input.slug}`);

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
    revalidatePath("/products");
  } catch {
    // swallow; client shows optimistic UI or reloads
  }

  redirect("/products");
}
