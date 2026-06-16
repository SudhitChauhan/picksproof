"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, useForm } from "react-hook-form";
import { updateProductAction } from "@/app/admin/products/new/actions";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { ProductFormBody } from "@/app/(admin)/products/_components/ProductFormBody";
import {
  dbProductToFormInput,
  editProductFormSchema,
  type EditProductFormInput,
  type EditProductFormValues,
  type ProductFormInput
} from "@/lib/products/schema";
export type EditProductFormProps = {
  product: Parameters<typeof dbProductToFormInput>[0] & { id: string };
  specs: {
    specification_title: string;
    title: string;
    description: string;
    sort_order: number;
  }[];
};

export function EditProductForm({ product, specs }: EditProductFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EditProductFormInput, unknown, EditProductFormValues>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: dbProductToFormInput(product, specs) as EditProductFormInput
  });

  const watchedName = watch("name");
  const watchedImageUrl = watch("mainImageUrl");

  function handleImportMessage(msg: string, type: "error" | "success") {
    setMessage(msg);
    setStatus(type);
  }

  async function onSubmit(values: EditProductFormValues) {
    setStatus("idle");
    setMessage("");
    try {
      const result = await updateProductAction(values);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.message);
        return;
      }
      router.push(`${ADMIN_ROUTES.catalog}?updated=1`);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not update product.");
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />

      {status !== "idle" && (
        <div className={`admin-form-alert admin-form-alert--${status}`}>{message}</div>
      )}

      <ProductFormBody
        control={control as unknown as Control<ProductFormInput>}
        errors={errors as unknown as FieldErrors<ProductFormInput>}
        initialFeaturesText={(product.features ?? []).join("\n")}
        initialImagePreview={product.main_image_url}
        mode="edit"
        onImportMessage={handleImportMessage}
        register={register as unknown as UseFormRegister<ProductFormInput>}
        setValue={setValue as unknown as UseFormSetValue<ProductFormInput>}
        watchedImageUrl={watchedImageUrl ?? ""}
        watchedName={watchedName ?? ""}
      />

      <div className="admin-form-bar">
        <div className="admin-form-bar-inner">
          <p>Confirm all fields, then save changes.</p>
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
