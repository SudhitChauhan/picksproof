"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { createProductAction } from "@/app/admin/products/new/actions";
import { categories } from "@/lib/data";
import {
  defaultProductFormValues,
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues
} from "@/lib/products/schema";

const inputClass =
  "mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
const labelClass = "text-sm font-bold text-admin-ink dark:text-slate-100";
const errorClass = "mt-1 text-sm font-semibold text-red-600 dark:text-red-400";
const sectionClass =
  "rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900";

export function ProductForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultProductFormValues
  });

  const linkFields = useFieldArray({ control, name: "links" });
  const specFields = useFieldArray({ control, name: "specs" });
  const proFields = useFieldArray({ control, name: "review.pros" });
  const conFields = useFieldArray({ control, name: "review.cons" });
  const score = useWatch({ control, name: "globalScore" });

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
      setMessage(`Product saved with ID ${result.id}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    }
  }

  return (
    <form className="mx-auto grid max-w-6xl gap-6" onSubmit={handleSubmit(onSubmit)}>
      {status !== "idle" ? (
        <div
          className={`rounded-3xl border px-5 py-4 text-sm font-bold ${
            status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      ) : null}

      <fieldset className={sectionClass}>
        <div className="mb-6 border-b border-admin-line pb-4 dark:border-slate-800">
          <legend className="text-2xl font-black tracking-tight text-admin-ink dark:text-white">
            Basic Info
          </legend>
          <p className="mt-2 text-sm text-admin-muted dark:text-slate-400">
            Core details used across comparison cards, review pages, and search.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Title
            <input className={inputClass} {...register("title")} placeholder="Aster Pro 14" />
            {errors.title ? <p className={errorClass}>{errors.title.message}</p> : null}
          </label>

          <label className={labelClass}>
            Brand
            <input className={inputClass} {...register("brand")} placeholder="Aster" />
            {errors.brand ? <p className={errorClass}>{errors.brand.message}</p> : null}
          </label>

          <label className={labelClass}>
            Category
            <select className={inputClass} {...register("category")}>
              {categories.map((category) => (
                <option key={category.slug} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.category ? <p className={errorClass}>{errors.category.message}</p> : null}
          </label>

          <label className={labelClass}>
            Main Image URL
            <input
              className={inputClass}
              {...register("mainImageUrl")}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.mainImageUrl ? (
              <p className={errorClass}>{errors.mainImageUrl.message}</p>
            ) : null}
          </label>

          <label className="md:col-span-2">
            <span className={labelClass}>Genuine Global Score: {Number(score).toFixed(1)}</span>
            <div className="mt-3 grid gap-3 rounded-2xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_120px]">
              <input
                className="accent-emerald-600"
                type="range"
                min="0"
                max="10"
                step="0.1"
                {...register("globalScore", { valueAsNumber: true })}
              />
              <input
                className="rounded-xl border border-admin-line bg-transparent px-3 py-2 text-admin-ink dark:border-slate-700 dark:text-slate-100"
                type="number"
                min="0"
                max="10"
                step="0.1"
                {...register("globalScore", { valueAsNumber: true })}
              />
            </div>
            {errors.globalScore ? (
              <p className={errorClass}>{errors.globalScore.message}</p>
            ) : null}
          </label>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <SectionHeader
          title="Affiliate Links"
          description="Add every retailer offer and mark the preferred primary button."
        />

        <div className="grid gap-4">
          {linkFields.fields.map((field, index) => (
            <div
              className="grid gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 lg:grid-cols-[1fr_1.5fr_140px_140px_auto]"
              key={field.id}
            >
              <label className={labelClass}>
                Retailer
                <input className={inputClass} {...register(`links.${index}.retailerName`)} />
                {errors.links?.[index]?.retailerName ? (
                  <p className={errorClass}>{errors.links[index]?.retailerName?.message}</p>
                ) : null}
              </label>

              <label className={labelClass}>
                Affiliate URL
                <input className={inputClass} {...register(`links.${index}.affiliateUrl`)} />
                {errors.links?.[index]?.affiliateUrl ? (
                  <p className={errorClass}>{errors.links[index]?.affiliateUrl?.message}</p>
                ) : null}
              </label>

              <label className={labelClass}>
                Price
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`links.${index}.price`, { valueAsNumber: true })}
                />
                {errors.links?.[index]?.price ? (
                  <p className={errorClass}>{errors.links[index]?.price?.message}</p>
                ) : null}
              </label>

              <label className="flex items-center gap-3 pt-8 text-sm font-bold text-admin-ink dark:text-slate-100">
                <input
                  className="size-5 accent-emerald-600"
                  type="checkbox"
                  {...register(`links.${index}.isPrimary`, {
                    onChange: (event) => {
                      if (event.target.checked) {
                        linkFields.fields.forEach((_, fieldIndex) => {
                          setValue(`links.${fieldIndex}.isPrimary`, fieldIndex === index);
                        });
                      }
                    }
                  })}
                />
                Primary Button
              </label>

              <button
                className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                disabled={linkFields.fields.length === 1}
                onClick={() => linkFields.remove(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {errors.links?.root ? <p className={errorClass}>{errors.links.root.message}</p> : null}

        <AddButton
          label="Add Retailer"
          onClick={() =>
            linkFields.append({
              retailerName: "",
              affiliateUrl: "",
              price: 0,
              isPrimary: false
            })
          }
        />
      </fieldset>

      <fieldset className={sectionClass}>
        <SectionHeader
          title="Specifications"
          description="Use normalized key-value rows for future comparison tables."
        />

        <div className="grid gap-4">
          {specFields.fields.map((field, index) => (
            <div
              className="grid gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_1fr_auto]"
              key={field.id}
            >
              <label className={labelClass}>
                Spec Name
                <input
                  className={inputClass}
                  {...register(`specs.${index}.specName`)}
                  placeholder="Battery Life"
                />
                {errors.specs?.[index]?.specName ? (
                  <p className={errorClass}>{errors.specs[index]?.specName?.message}</p>
                ) : null}
              </label>

              <label className={labelClass}>
                Spec Value
                <input
                  className={inputClass}
                  {...register(`specs.${index}.specValue`)}
                  placeholder="12 hours"
                />
                {errors.specs?.[index]?.specValue ? (
                  <p className={errorClass}>{errors.specs[index]?.specValue?.message}</p>
                ) : null}
              </label>

              <button
                className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950 md:self-end"
                disabled={specFields.fields.length === 1}
                onClick={() => specFields.remove(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {errors.specs?.root ? <p className={errorClass}>{errors.specs.root.message}</p> : null}

        <AddButton label="Add Specification" onClick={() => specFields.append({ specName: "", specValue: "" })} />
      </fieldset>

      <fieldset className={sectionClass}>
        <SectionHeader
          title="Editorial Insights"
          description="Capture the concise summary, pros/cons, and final editor verdict."
        />

        <div className="grid gap-5">
          <label className={labelClass}>
            Summary
            <textarea
              className={`${inputClass} min-h-28`}
              {...register("review.summary")}
              placeholder="Short review summary for cards and landing pages."
            />
            {errors.review?.summary ? (
              <p className={errorClass}>{errors.review.summary.message}</p>
            ) : null}
          </label>

          <div className="grid gap-5 lg:grid-cols-2">
            <ListEditor
              error={errors.review?.pros?.root?.message}
              fields={proFields.fields}
              label="Pros"
              onAdd={() => proFields.append({ value: "" })}
              onRemove={(index) => proFields.remove(index)}
              registerName="review.pros"
              register={register}
              itemErrorMessages={proFields.fields.map(
                (_, index) => errors.review?.pros?.[index]?.value?.message
              )}
            />

            <ListEditor
              error={errors.review?.cons?.root?.message}
              fields={conFields.fields}
              label="Cons"
              onAdd={() => conFields.append({ value: "" })}
              onRemove={(index) => conFields.remove(index)}
              registerName="review.cons"
              register={register}
              itemErrorMessages={conFields.fields.map(
                (_, index) => errors.review?.cons?.[index]?.value?.message
              )}
            />
          </div>

          <label className={labelClass}>
            Editor Verdict
            <textarea
              className={`${inputClass} min-h-36`}
              {...register("review.editorVerdict")}
              placeholder="Explain who should buy it, who should skip it, and why."
            />
            {errors.review?.editorVerdict ? (
              <p className={errorClass}>{errors.review.editorVerdict.message}</p>
            ) : null}
          </label>
        </div>
      </fieldset>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-3xl border border-admin-line bg-white/90 p-4 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-admin-muted dark:text-slate-400">
          Saves product data to Supabase with admin-only RLS checks.
        </p>
        <button
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 border-b border-admin-line pb-4 dark:border-slate-800">
      <legend className="text-2xl font-black tracking-tight text-admin-ink dark:text-white">
        {title}
      </legend>
      <p className="mt-2 text-sm text-admin-muted dark:text-slate-400">{description}</p>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="mt-5 rounded-full border border-admin-line px-5 py-3 text-sm font-black text-admin-ink transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

type ListEditorProps = {
  error?: string;
  fields: { id: string }[];
  itemErrorMessages: (string | undefined)[];
  label: "Pros" | "Cons";
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: UseFormRegister<ProductFormInput>;
  registerName: "review.pros" | "review.cons";
};

function ListEditor({
  error,
  fields,
  itemErrorMessages,
  label,
  onAdd,
  onRemove,
  register,
  registerName
}: ListEditorProps) {
  return (
    <div className="rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between gap-3">
        <strong className="text-admin-ink dark:text-white">{label}</strong>
        <button
          className="rounded-full border border-admin-line px-3 py-2 text-xs font-black text-admin-ink dark:border-slate-700 dark:text-slate-100"
          onClick={onAdd}
          type="button"
        >
          Add
        </button>
      </div>

      <div className="grid gap-3">
        {fields.map((field, index) => (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={field.id}>
            <input
              className={inputClass}
              {...register(`${registerName}.${index}.value`)}
              placeholder={label === "Pros" ? "Excellent battery life" : "Limited port selection"}
            />
            <button
              className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
              disabled={fields.length === 1}
              onClick={() => onRemove(index)}
              type="button"
            >
              Remove
            </button>
            {itemErrorMessages[index] ? (
              <p className={errorClass}>{itemErrorMessages[index]}</p>
            ) : null}
          </div>
        ))}
      </div>

      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  );
}
