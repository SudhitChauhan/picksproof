"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, useForm } from "react-hook-form";
import { updateProductAction } from "@/app/admin/products/new/actions";
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
      setStatus("success");
      setMessage("Product updated successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not update product.");
    }
  }

  return (
    <form className="mx-auto max-w-7xl pb-28" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />

      {status !== "idle" && (
        <div
          className={`mb-6 rounded-3xl border px-5 py-4 text-sm font-bold ${
            status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-red-300 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <ProductFormBody
        control={control as unknown as Control<ProductFormInput>}
        errors={errors as unknown as FieldErrors<ProductFormInput>}
        initialFeaturesText={(product.features ?? []).join("\n")}
        initialImagePreview={product.main_image_url}
        onImportMessage={handleImportMessage}
        register={register as unknown as UseFormRegister<ProductFormInput>}
        setValue={setValue as unknown as UseFormSetValue<ProductFormInput>}
        watchedName={watchedName ?? ""}
      />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-admin-line bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="text-sm text-admin-muted dark:text-slate-400">Confirm all fields, then save changes.</p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-7 py-3 text-sm font-bold text-[#F3F0EE] hover:opacity-80 disabled:opacity-50 transition"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
