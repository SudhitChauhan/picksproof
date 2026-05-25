"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  CheckCircle2,
  FileText,
  Link2,
  ListPlus,
  Package,
  Plus,
  Save,
  Settings2,
  Trash2
} from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
const textareaClass = `${inputClass} min-h-28 resize-y`;
const labelClass = "text-sm font-bold text-admin-ink dark:text-slate-100";
const errorClass = "mt-1 text-sm font-semibold text-red-600 dark:text-red-400";
const cardClass =
  "rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900";

export function ProductEntryForm() {
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
    <form className="mx-auto max-w-7xl pb-28" onSubmit={handleSubmit(onSubmit)}>
      {status !== "idle" ? (
        <div
          className={`mb-6 rounded-3xl border px-5 py-4 text-sm font-bold ${
            status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <section className={cardClass}>
            <SectionTitle
              description="The core product information shown across cards, reviews, and lists."
              icon={<Package className="size-5" />}
              title="Basic Info"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Title
                <input className={inputClass} {...register("title")} placeholder="Product name" />
                {errors.title ? <p className={errorClass}>{errors.title.message}</p> : null}
              </label>

              <label className={labelClass}>
                Brand
                <input className={inputClass} {...register("brand")} placeholder="Brand name" />
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
                Image URL
                <input
                  className={inputClass}
                  {...register("mainImageUrl")}
                  placeholder="https://images.unsplash.com/..."
                />
                {errors.mainImageUrl ? (
                  <p className={errorClass}>{errors.mainImageUrl.message}</p>
                ) : null}
              </label>
            </div>
          </section>

          <section className={cardClass}>
            <SectionTitle
              description="Add every retailer offer and mark the main button destination."
              icon={<Link2 className="size-5" />}
              title="Retailer Links"
            />

            <div className="grid gap-4">
              {linkFields.fields.map((field, index) => (
                <div
                  className="grid gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 xl:grid-cols-[1fr_1.4fr_120px_120px_auto]"
                  key={field.id}
                >
                  <label className={labelClass}>
                    Retailer Name
                    <input className={inputClass} {...register(`links.${index}.retailerName`)} />
                    {errors.links?.[index]?.retailerName ? (
                      <p className={errorClass}>{errors.links[index]?.retailerName?.message}</p>
                    ) : null}
                  </label>

                  <label className={labelClass}>
                    URL
                    <input className={inputClass} {...register(`links.${index}.affiliateUrl`)} />
                    {errors.links?.[index]?.affiliateUrl ? (
                      <p className={errorClass}>{errors.links[index]?.affiliateUrl?.message}</p>
                    ) : null}
                  </label>

                  <label className={labelClass}>
                    Price
                    <input
                      className={inputClass}
                      min="0"
                      step="0.01"
                      type="number"
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
                    Primary
                  </label>

                  <RemoveButton
                    disabled={linkFields.fields.length === 1}
                    label="Remove retailer link"
                    onClick={() => linkFields.remove(index)}
                  />
                </div>
              ))}
            </div>

            {errors.links?.root ? <p className={errorClass}>{errors.links.root.message}</p> : null}

            <AddButton
              label="Add Retailer Link"
              onClick={() =>
                linkFields.append({
                  retailerName: "",
                  affiliateUrl: "",
                  price: 0,
                  isPrimary: false
                })
              }
            />
          </section>

          <section className={cardClass}>
            <SectionTitle
              description="Structured key/value details for comparison tables."
              icon={<Settings2 className="size-5" />}
              title="Specifications"
            />

            <div className="grid gap-4">
              {specFields.fields.map((field, index) => (
                <div
                  className="grid gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_1fr_auto]"
                  key={field.id}
                >
                  <label className={labelClass}>
                    Key
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
                    Value
                    <input
                      className={inputClass}
                      {...register(`specs.${index}.specValue`)}
                      placeholder="12 hours"
                    />
                    {errors.specs?.[index]?.specValue ? (
                      <p className={errorClass}>{errors.specs[index]?.specValue?.message}</p>
                    ) : null}
                  </label>

                  <RemoveButton
                    disabled={specFields.fields.length === 1}
                    label="Remove specification"
                    onClick={() => specFields.remove(index)}
                  />
                </div>
              ))}
            </div>

            {errors.specs?.root ? <p className={errorClass}>{errors.specs.root.message}</p> : null}

            <AddButton label="Add Spec" onClick={() => specFields.append({ specName: "", specValue: "" })} />
          </section>

          <section className={cardClass}>
            <SectionTitle
              description="Summarize the buying recommendation with balanced pros and cons."
              icon={<FileText className="size-5" />}
              title="Review Details"
            />

            <div className="grid gap-5">
              <label className={labelClass}>
                Review Summary
                <textarea
                  className={textareaClass}
                  {...register("review.summary")}
                  placeholder="Short review summary for cards and landing pages."
                />
                {errors.review?.summary ? (
                  <p className={errorClass}>{errors.review.summary.message}</p>
                ) : null}
              </label>

              <div className="grid gap-5 lg:grid-cols-2">
                <DynamicTextareaList
                  errors={proFields.fields.map(
                    (_, index) => errors.review?.pros?.[index]?.value?.message
                  )}
                  fields={proFields.fields}
                  label="Pros"
                  onAdd={() => proFields.append({ value: "" })}
                  onRemove={(index) => proFields.remove(index)}
                  register={register}
                  registerName="review.pros"
                />
                <DynamicTextareaList
                  errors={conFields.fields.map(
                    (_, index) => errors.review?.cons?.[index]?.value?.message
                  )}
                  fields={conFields.fields}
                  label="Cons"
                  onAdd={() => conFields.append({ value: "" })}
                  onRemove={(index) => conFields.remove(index)}
                  register={register}
                  registerName="review.cons"
                />
              </div>

              <label className={labelClass}>
                Editor Verdict
                <textarea
                  className={`${textareaClass} min-h-40`}
                  {...register("review.editorVerdict")}
                  placeholder="Explain who should buy it, who should skip it, and why."
                />
                {errors.review?.editorVerdict ? (
                  <p className={errorClass}>{errors.review.editorVerdict.message}</p>
                ) : null}
              </label>
            </div>
          </section>
        </div>

        <aside className="grid gap-6 self-start lg:sticky lg:top-6">
          <section className={cardClass}>
            <SectionTitle
              description="Tune how prominently this product appears across the site."
              icon={<Award className="size-5" />}
              title="Score & Publishing"
            />

            <label className={labelClass}>
              Global Score: {Number(score).toFixed(1)}
              <div className="mt-3 grid gap-3 rounded-2xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <input
                  className="accent-emerald-600"
                  max="10"
                  min="0"
                  step="0.1"
                  type="range"
                  {...register("globalScore", { valueAsNumber: true })}
                />
                <input
                  className="rounded-xl border border-admin-line bg-transparent px-3 py-2 text-admin-ink dark:border-slate-700 dark:text-slate-100"
                  max="10"
                  min="0"
                  step="0.1"
                  type="number"
                  {...register("globalScore", { valueAsNumber: true })}
                />
              </div>
              {errors.globalScore ? (
                <p className={errorClass}>{errors.globalScore.message}</p>
              ) : null}
            </label>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-800">
              <CheckCircle2 className="mb-2 size-5" />
              Products are saved as published records and protected by admin-only Supabase RLS.
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-black text-admin-ink dark:text-white">Checklist</h2>
            <ul className="mt-4 grid gap-3 text-sm font-semibold text-admin-muted dark:text-slate-400">
              <li>Basic info is customer-facing and should be concise.</li>
              <li>Mark one retailer as primary for strongest conversion.</li>
              <li>Use specs that shoppers actually compare.</li>
              <li>Pros and cons should be short, scannable, and specific.</li>
            </ul>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-admin-line bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-admin-muted dark:text-slate-400">
            Review the product data, then save it to Supabase.
          </p>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            <Save className="size-4" />
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionTitle({
  description,
  icon,
  title
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-6 flex gap-4 border-b border-admin-line pb-4 dark:border-slate-800">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-admin-ink dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-admin-muted dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="mt-5 inline-flex items-center gap-2 rounded-full border border-admin-line px-5 py-3 text-sm font-black text-admin-ink transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-100"
      onClick={onClick}
      type="button"
    >
      <Plus className="size-4" />
      {label}
    </button>
  );
}

function RemoveButton({
  disabled,
  label,
  onClick
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950 md:self-end"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Trash2 className="size-4" />
      Remove
      <span className="sr-only"> {label}</span>
    </button>
  );
}

type DynamicTextareaListProps = {
  errors: (string | undefined)[];
  fields: { id: string }[];
  label: "Pros" | "Cons";
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: ReturnType<typeof useForm<ProductFormInput, unknown, ProductFormValues>>["register"];
  registerName: "review.pros" | "review.cons";
};

function DynamicTextareaList({
  errors,
  fields,
  label,
  onAdd,
  onRemove,
  register,
  registerName
}: DynamicTextareaListProps) {
  return (
    <div className="rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between gap-3">
        <strong className="text-admin-ink dark:text-white">{label}</strong>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-admin-line px-3 py-2 text-xs font-black text-admin-ink dark:border-slate-700 dark:text-slate-100"
          onClick={onAdd}
          type="button"
        >
          <ListPlus className="size-3.5" />
          Add
        </button>
      </div>

      <div className="grid gap-3">
        {fields.map((field, index) => (
          <div className="grid gap-2" key={field.id}>
            <textarea
              className={`${textareaClass} min-h-24`}
              {...register(`${registerName}.${index}.value`)}
              placeholder={label === "Pros" ? "Excellent battery life" : "Limited port selection"}
            />
            <RemoveButton
              disabled={fields.length === 1}
              label={`Remove ${label.toLowerCase()} item`}
              onClick={() => onRemove(index)}
            />
            {errors[index] ? <p className={errorClass}>{errors[index]}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
