"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  ImageIcon,
  Link2,
  Loader2,
  Package,
  Plus,
  Save,
  Settings2,
  Trash2,
  Wand2
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateProductAction } from "@/app/admin/products/new/actions";
import { categories } from "@/lib/data";
import {
  editProductFormSchema,
  type EditProductFormInput,
  type EditProductFormValues
} from "@/lib/products/schema";

/* ── Style tokens ────────────────────────────────────────────────────────── */
const inputCls =
  "mt-1.5 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-[#141413] focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
const textareaCls = `${inputCls} min-h-24 resize-y`;
const labelCls = "block text-sm font-bold text-admin-ink dark:text-slate-100";
const errorCls = "mt-1 text-xs font-bold text-red-600 dark:text-red-400";
const cardCls =
  "rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.07)] dark:border-slate-800 dark:bg-slate-900";

/* ── SiteStripe parser ───────────────────────────────────────────────────── */
function parseSiteStripe(html: string): { imageUrl: string; affiliateUrl: string } {
  if (!html.trim()) return { imageUrl: "", affiliateUrl: "" };
  if (html.startsWith("http") && !html.includes("<")) return { imageUrl: "", affiliateUrl: html.trim() };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const link = doc.querySelector<HTMLAnchorElement>('a[href*="amazon"]');
    const affiliateUrl = link?.getAttribute("href") ?? "";
    const img =
      link?.querySelector<HTMLImageElement>("img") ??
      doc.querySelector<HTMLImageElement>('img:not([width="1"]):not([height="1"])');
    const imageUrl = img?.getAttribute("src") ?? "";
    return { affiliateUrl, imageUrl };
  } catch {
    return { imageUrl: "", affiliateUrl: "" };
  }
}

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

/* ── Props ───────────────────────────────────────────────────────────────── */
export type EditProductFormProps = {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    slug: string;
    main_image_url: string;
    amazon_affiliate_url: string;
  };
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
  const [siteStripeHtml, setSiteStripeHtml] = useState("");
  const [imagePreview, setImagePreview] = useState(product.main_image_url);

  const defaultValues: EditProductFormInput = {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    slug: product.slug,
    mainImageUrl: product.main_image_url,
    amazonAffiliateUrl: product.amazon_affiliate_url,
    specs:
      specs.length > 0
        ? specs.map((s) => ({
            specificationTitle: s.specification_title,
            title: s.title,
            description: s.description,
            sortOrder: s.sort_order
          }))
        : [{ specificationTitle: "", title: "", description: "", sortOrder: 0 }]
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EditProductFormInput, unknown, EditProductFormValues>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues
  });

  const specFields = useFieldArray({ control, name: "specs" });
  const watchedName = watch("name");

  function handleExtract() {
    const { imageUrl, affiliateUrl } = parseSiteStripe(siteStripeHtml);
    if (imageUrl) {
      setValue("mainImageUrl", imageUrl, { shouldValidate: true });
      setImagePreview(imageUrl);
    }
    if (affiliateUrl) setValue("amazonAffiliateUrl", affiliateUrl, { shouldValidate: true });
    if (!imageUrl && !affiliateUrl) {
      setMessage("Could not extract URLs from the pasted code.");
      setStatus("error");
    }
  }

  function handleAutoSlug() {
    setValue("slug", toSlug(watchedName ?? ""), { shouldValidate: true });
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6">
          {/* Basic Info */}
          <section className={cardCls}>
            <SectionTitle icon={<Package className="size-5" />} title="Basic Info" desc="Core product information." />
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelCls}>
                Product Name *
                <input className={inputCls} {...register("name")} placeholder="Product name" />
                {errors.name && <p className={errorCls}>{errors.name.message}</p>}
              </label>
              <label className={labelCls}>
                Category *
                <select className={inputCls} {...register("category")}>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                  ))}
                </select>
                {errors.category && <p className={errorCls}>{errors.category.message}</p>}
              </label>
              <div className="md:col-span-2">
                <label className={labelCls}>
                  URL Slug *
                  <div className="flex gap-2 mt-1.5">
                    <input
                      className="flex-1 rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm font-mono text-admin-ink outline-none transition focus:border-[#141413] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      {...register("slug")}
                      placeholder="product-slug"
                    />
                    <button
                      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-2xl border border-admin-line px-4 py-3 text-sm font-bold text-admin-muted hover:text-admin-ink transition dark:border-slate-700 dark:text-slate-400"
                      onClick={handleAutoSlug}
                      type="button"
                    >
                      <Wand2 className="size-4" />
                      Auto
                    </button>
                  </div>
                  {errors.slug && <p className={errorCls}>{errors.slug.message}</p>}
                </label>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>
                  Description *
                  <textarea className={textareaCls} {...register("description")} placeholder="Product description…" />
                  {errors.description && <p className={errorCls}>{errors.description.message}</p>}
                </label>
              </div>
            </div>
          </section>

          {/* SiteStripe */}
          <section className={cardCls}>
            <SectionTitle icon={<Link2 className="size-5" />} title="Image & Affiliate Link" desc="Update via SiteStripe or edit URLs directly." />
            <div className="grid gap-4">
              <label className={labelCls}>
                SiteStripe HTML (optional update)
                <textarea
                  className={`${textareaCls} min-h-24 font-mono text-xs`}
                  onChange={(e) => setSiteStripeHtml(e.target.value)}
                  placeholder="Paste new SiteStripe code here to update…"
                  value={siteStripeHtml}
                />
              </label>
              <button
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#141413] px-5 py-2.5 text-sm font-bold text-[#F3F0EE] hover:opacity-80 transition"
                onClick={handleExtract}
                type="button"
              >
                <Wand2 className="size-4" />
                Extract
              </button>
              {imagePreview && (
                <div className="flex items-center gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="size-20 rounded-2xl object-contain" src={imagePreview} />
                  <p className="text-sm text-admin-muted">Current image preview</p>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelCls}>
                  Product Image URL *
                  <input className={inputCls} {...register("mainImageUrl")} placeholder="https://…" />
                  {errors.mainImageUrl && <p className={errorCls}>{errors.mainImageUrl.message}</p>}
                </label>
                <label className={labelCls}>
                  Amazon Affiliate URL * (See Price)
                  <input className={inputCls} {...register("amazonAffiliateUrl")} placeholder="https://www.amazon.in/…" />
                  {errors.amazonAffiliateUrl && <p className={errorCls}>{errors.amazonAffiliateUrl.message}</p>}
                </label>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className={cardCls}>
            <SectionTitle icon={<Settings2 className="size-5" />} title="Product Specifications" desc="Spec Group → Spec Name → Value/Description" />
            <div className="mb-3 hidden grid-cols-[1fr_1fr_1.2fr_auto] gap-3 md:grid">
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted">Group Title</span>
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted">Spec Name</span>
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted">Value</span>
              <span />
            </div>
            <div className="grid gap-3">
              {specFields.fields.map((field, index) => (
                <div
                  className="grid gap-3 rounded-2xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_1fr_1.2fr_auto]"
                  key={field.id}
                >
                  <input className={inputCls} {...register(`specs.${index}.specificationTitle`)} placeholder="Display" />
                  <input className={inputCls} {...register(`specs.${index}.title`)} placeholder="Screen Size" />
                  <input className={inputCls} {...register(`specs.${index}.description`)} placeholder="6.2 inches" />
                  <button
                    className="inline-flex items-center justify-center gap-1.5 self-center rounded-2xl border border-red-200 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-40 transition"
                    disabled={specFields.fields.length === 1}
                    onClick={() => specFields.remove(index)}
                    type="button"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-admin-line px-5 py-2.5 text-sm font-bold text-admin-ink hover:border-[#141413] transition dark:border-slate-700 dark:text-slate-100"
              onClick={() => specFields.append({ specificationTitle: "", title: "", description: "", sortOrder: specFields.fields.length })}
              type="button"
            >
              <Plus className="size-4" />
              Add Spec Row
            </button>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="self-start lg:sticky lg:top-6">
          <section className={cardCls}>
            <SectionTitle icon={<FileText className="size-5" />} title="Editing" desc="Changes are saved immediately to Supabase." />
            <div className="rounded-2xl bg-[#F4F4F4] p-4 text-sm text-admin-muted dark:bg-slate-800 dark:text-slate-400">
              <ImageIcon className="mb-2 size-5" />
              You&apos;re editing an existing product. All changes overwrite the current data.
            </div>
          </section>
        </aside>
      </div>

      {/* Sticky save bar */}
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

function SectionTitle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="mb-5 flex gap-4 border-b border-admin-line pb-4 dark:border-slate-800">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F4F4] text-admin-muted dark:bg-slate-800 dark:text-slate-400">{icon}</div>
      <div>
        <h2 className="text-lg font-black text-admin-ink dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-admin-muted dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
