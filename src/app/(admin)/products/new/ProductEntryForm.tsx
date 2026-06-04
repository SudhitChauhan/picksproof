"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { createProductAction } from "@/app/admin/products/new/actions";
import { ProductFormBody } from "@/app/(admin)/products/_components/ProductFormBody";
import {
  defaultProductFormValues,
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues
} from "@/lib/products/schema";

export function ProductEntryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultProductFormValues
  });

  const watchedName = watch("name");

  function handleImportMessage(msg: string, type: "error" | "success") {
    setMessage(msg);
    setStatus(type);
  }

  async function onSubmit(values: ProductFormValues) {
    setStatus("idle");
    setMessage("");

    try {
      const result = await createProductAction(values);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.message);
        return;
      }

      reset(defaultProductFormValues);
      setStatus("success");
      setMessage(`Product saved! ID: ${result.id}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    }
  }

  return (
    <form className="mx-auto max-w-7xl pb-28" onSubmit={handleSubmit(onSubmit)}>
      {status !== "idle" && (
        <div
          className={`mb-6 rounded-3xl border px-5 py-4 text-sm font-bold ${
            status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <ProductFormBody
        control={control}
        errors={errors}
        onImportMessage={handleImportMessage}
        register={register}
        setValue={setValue}
        watchedName={watchedName ?? ""}
      />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-admin-line bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="text-sm text-admin-muted dark:text-slate-400">Review all fields, then save to Supabase.</p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-7 py-3 text-sm font-bold text-[#F3F0EE] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
