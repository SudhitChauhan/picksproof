"use server";

import { productFormSchema, type ProductFormValues } from "@/lib/products/schema";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ProductInsertResult = {
  id: string;
};

type CreateProductResult =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      message: string;
    };

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Could not save product details.";
}

export async function createProductAction(values: ProductFormValues): Promise<CreateProductResult> {
  const parsed = productFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the product form and try again."
    };
  }

  const input = parsed.data;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        ok: false,
        message: "You must be signed in to create products."
      };
    }

    if (!isAdminUser(user)) {
      return {
        ok: false,
        message: "Your account does not have admin access."
      };
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        title: input.title,
        brand: input.brand,
        category: input.category,
        main_image_url: input.mainImageUrl,
        global_score: input.globalScore
      })
      .select("id")
      .single<ProductInsertResult>();

    if (productError || !product) {
      return {
        ok: false,
        message: productError?.message ?? "Could not create product."
      };
    }

    const linkRows = input.links.map((link) => ({
      product_id: product.id,
      retailer_name: link.retailerName,
      affiliate_url: link.affiliateUrl,
      price: link.price,
      is_primary: link.isPrimary
    }));

    const specRows = input.specs.map((spec) => ({
      product_id: product.id,
      spec_name: spec.specName,
      spec_value: spec.specValue
    }));

    const reviewRow = {
      product_id: product.id,
      summary: input.review.summary,
      pros: input.review.pros.map((pro) => pro.value),
      cons: input.review.cons.map((con) => con.value),
      editor_verdict: input.review.editorVerdict
    };

    const [linksResult, specsResult, reviewResult] = await Promise.all([
      supabase.from("product_links").insert(linkRows),
      supabase.from("product_specs").insert(specRows),
      supabase.from("product_reviews").insert(reviewRow)
    ]);

    const relationError = linksResult.error ?? specsResult.error ?? reviewResult.error;

    if (relationError) {
      await supabase.from("products").delete().eq("id", product.id);

      return {
        ok: false,
        message: `Product was not saved completely: ${relationError.message}`
      };
    }

    return {
      ok: true,
      id: product.id
    };
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(error)
    };
  }
}
