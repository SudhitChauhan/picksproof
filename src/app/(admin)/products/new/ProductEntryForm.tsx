"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  createProductAction,
  importProductsFromJsonAction
} from "@/app/admin/products/new/actions";
import { ProductFormBody } from "@/app/(admin)/products/_components/ProductFormBody";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  defaultProductFormValues,
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues
} from "@/lib/products/schema";

export function ProductEntryForm() {
  const router = useRouter();
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
  const watchedImageUrl = watch("mainImageUrl");

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

      router.push(`${ADMIN_ROUTES.catalog}?added=1`);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    }
  }

  async function handleBulkImport(jsonText: string) {
    setStatus("idle");
    setMessage("");

    const result = await importProductsFromJsonAction(jsonText);

    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    const summary = `Imported ${result.created} product${result.created === 1 ? "" : "s"}.`;
    const detail =
      result.skipped > 0
        ? ` ${result.skipped} skipped.${result.errors.length ? ` ${result.errors[0]}` : ""}`
        : "";

    router.push(`${ADMIN_ROUTES.catalog}?imported=${result.created}`);
    router.refresh();

    setStatus("success");
    setMessage(summary + detail);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      {status !== "idle" && (
        <div className={`admin-form-alert admin-form-alert--${status}`}>{message}</div>
      )}

      <ProductFormBody
        control={control}
        errors={errors}
        mode="create"
        onBulkImport={handleBulkImport}
        onImportMessage={handleImportMessage}
        register={register}
        setValue={setValue}
        watchedImageUrl={watchedImageUrl ?? ""}
        watchedName={watchedName ?? ""}
      />

      <div className="admin-form-bar">
        <div className="admin-form-bar-inner">
          <p>Review all fields, then save to publish in the catalogue.</p>
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
