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
import { createProductAction } from "@/app/admin/products/new/actions";
import { categories } from "@/lib/data";
import {
  defaultProductFormValues,
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues
} from "@/lib/products/schema";

/* ── Shared style tokens ───────────────────────────────────────────────────── */
const inputCls =
  "mt-1.5 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-[#141413] focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
const textareaCls = `${inputCls} min-h-24 resize-y`;
const labelCls = "block text-sm font-bold text-admin-ink dark:text-slate-100";
const errorCls = "mt-1 text-xs font-bold text-red-600 dark:text-red-400";
const cardCls =
  "rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.07)] dark:border-slate-800 dark:bg-slate-900";

/* ── SiteStripe parser ─────────────────────────────────────────────────────── */
function parseSiteStripe(html: string): { imageUrl: string; affiliateUrl: string } {
  if (!html.trim()) return { imageUrl: "", affiliateUrl: "" };

  // If it's a plain URL, return it as affiliate URL directly
  if (html.startsWith("http") && !html.includes("<")) {
    return { imageUrl: "", affiliateUrl: html.trim() };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find the first <a> that contains amazon
    const link = doc.querySelector<HTMLAnchorElement>('a[href*="amazon"]');
    const affiliateUrl = link?.getAttribute("href") ?? "";

    // Find the image inside the <a> (not the 1x1 tracking pixel)
    const img =
      link?.querySelector<HTMLImageElement>("img") ??
      doc.querySelector<HTMLImageElement>('img:not([width="1"]):not([height="1"])');
    const imageUrl = img?.getAttribute("src") ?? "";

    return { affiliateUrl, imageUrl };
  } catch {
    return { imageUrl: "", affiliateUrl: "" };
  }
}

/* ── Slug generator ────────────────────────────────────────────────────────── */
function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ── Main form ─────────────────────────────────────────────────────────────── */
export function ProductEntryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [siteStripeHtml, setSiteStripeHtml] = useState("");
  const [imagePreview, setImagePreview] = useState("");

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

  const specFields = useFieldArray({ control, name: "specs" });
  const watchedName = watch("name");

  function handleExtract() {
    const { imageUrl, affiliateUrl } = parseSiteStripe(siteStripeHtml);
    if (imageUrl) {
      setValue("mainImageUrl", imageUrl, { shouldValidate: true });
      setImagePreview(imageUrl);
    }
    if (affiliateUrl) {
      setValue("amazonAffiliateUrl", affiliateUrl, { shouldValidate: true });
    }
    if (!imageUrl && !affiliateUrl) {
      setMessage("Could not extract URLs from the pasted code. Check the SiteStripe HTML and try again.");
      setStatus("error");
    }
  }

  function handleAutoSlug() {
    setValue("slug", toSlug(watchedName ?? ""), { shouldValidate: true });
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
      setSiteStripeHtml("");
      setImagePreview("");
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Left column ── */}
        <div className="grid gap-6">

          {/* Basic Info */}
          <section className={cardCls}>
            <SectionTitle icon={<Package className="size-5" />} title="Basic Info" desc="Core product information shown on cards and the detail page." />

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelCls}>
                Product Name *
                <input className={inputCls} {...register("name")} placeholder="Samsung Galaxy S24" />
                {errors.name && <p className={errorCls}>{errors.name.message}</p>}
              </label>

              <label className={labelCls}>
                Category *
                <select className={inputCls} {...register("category")}>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                {errors.category && <p className={errorCls}>{errors.category.message}</p>}
              </label>

              <div className="md:col-span-2">
                <label className={labelCls}>
                  URL Slug *
                  <div className="flex gap-2 mt-1.5">
                    <input
                      className="flex-1 rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-[#141413] focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 font-mono"
                      {...register("slug")}
                      placeholder="samsung-galaxy-s24"
                    />
                    <button
                      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-2xl border border-admin-line px-4 py-3 text-sm font-bold text-admin-muted hover:text-admin-ink dark:border-slate-700 dark:text-slate-400 transition"
                      onClick={handleAutoSlug}
                      title="Generate slug from product name"
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
                  <textarea
                    className={textareaCls}
                    {...register("description")}
                    placeholder="A brief, compelling description of the product — what it is and who it's for."
                  />
                  {errors.description && <p className={errorCls}>{errors.description.message}</p>}
                </label>
              </div>
            </div>
          </section>

          {/* SiteStripe Parser */}
          <section className={cardCls}>
            <SectionTitle
              icon={<Link2 className="size-5" />}
              title="SiteStripe — Image & Affiliate Link"
              desc="Paste the SiteStripe HTML (Image type) from Amazon Associates. We'll extract the product image and affiliate URL automatically."
            />

            <div className="grid gap-4">
              <label className={labelCls}>
                SiteStripe HTML Code
                <textarea
                  className={`${textareaCls} min-h-32 font-mono text-xs`}
                  onChange={(e) => setSiteStripeHtml(e.target.value)}
                  placeholder='<a href="https://www.amazon.in/dp/ASIN?tag=yourtag-21" target="_blank"><img border="0" src="https://ws-in.amazon-adsystem.com/..." /></a>'
                  value={siteStripeHtml}
                />
              </label>

              <button
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#141413] px-5 py-2.5 text-sm font-bold text-[#F3F0EE] transition hover:opacity-80"
                onClick={handleExtract}
                type="button"
              >
                <Wand2 className="size-4" />
                Extract Image & Link
              </button>

              {/* Image preview */}
              {imagePreview && (
                <div className="flex items-center gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Product preview" className="size-24 rounded-2xl object-contain" src={imagePreview} />
                  <div>
                    <p className="text-sm font-bold text-admin-ink dark:text-white">Image extracted</p>
                    <p className="text-xs text-admin-muted dark:text-slate-400 break-all max-w-xs">{imagePreview.slice(0, 80)}…</p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelCls}>
                  Product Image URL *
                  <input className={inputCls} {...register("mainImageUrl")} placeholder="https://ws-in.amazon-adsystem.com/..." />
                  {errors.mainImageUrl && <p className={errorCls}>{errors.mainImageUrl.message}</p>}
                </label>

                <label className={labelCls}>
                  Amazon Affiliate URL * (See Price CTA)
                  <input className={inputCls} {...register("amazonAffiliateUrl")} placeholder="https://www.amazon.in/dp/..." />
                  {errors.amazonAffiliateUrl && <p className={errorCls}>{errors.amazonAffiliateUrl.message}</p>}
                </label>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className={cardCls}>
            <SectionTitle
              icon={<Settings2 className="size-5" />}
              title="Product Specifications"
              desc="Each row is one spec. Group related specs under the same Specification Title (e.g. 'Display', 'Performance')."
            />

            {/* Column labels */}
            <div className="mb-3 hidden grid-cols-[1fr_1fr_1.2fr_auto] gap-3 md:grid">
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted dark:text-slate-400">Spec Group Title</span>
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted dark:text-slate-400">Spec Name</span>
              <span className="text-xs font-bold uppercase tracking-wide text-admin-muted dark:text-slate-400">Value / Description</span>
              <span />
            </div>

            <div className="grid gap-3">
              {specFields.fields.map((field, index) => (
                <div
                  className="grid gap-3 rounded-2xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_1fr_1.2fr_auto]"
                  key={field.id}
                >
                  <div>
                    <label className="text-xs font-bold text-admin-muted md:hidden dark:text-slate-400">Group Title</label>
                    <input
                      className={inputCls}
                      {...register(`specs.${index}.specificationTitle`)}
                      placeholder="Display"
                    />
                    {errors.specs?.[index]?.specificationTitle && (
                      <p className={errorCls}>{errors.specs[index]?.specificationTitle?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-admin-muted md:hidden dark:text-slate-400">Spec Name</label>
                    <input
                      className={inputCls}
                      {...register(`specs.${index}.title`)}
                      placeholder="Screen Size"
                    />
                    {errors.specs?.[index]?.title && (
                      <p className={errorCls}>{errors.specs[index]?.title?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-admin-muted md:hidden dark:text-slate-400">Value</label>
                    <input
                      className={inputCls}
                      {...register(`specs.${index}.description`)}
                      placeholder="6.2 inches, 2340×1080"
                    />
                    {errors.specs?.[index]?.description && (
                      <p className={errorCls}>{errors.specs[index]?.description?.message}</p>
                    )}
                  </div>

                  <button
                    className="inline-flex items-center justify-center gap-1.5 self-center rounded-2xl border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                    disabled={specFields.fields.length === 1}
                    onClick={() => specFields.remove(index)}
                    type="button"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="md:hidden">Remove</span>
                  </button>
                </div>
              ))}
            </div>

            {errors.specs?.root && <p className={errorCls}>{errors.specs.root.message}</p>}

            <button
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-admin-line px-5 py-2.5 text-sm font-bold text-admin-ink transition hover:border-[#141413] dark:border-slate-700 dark:text-slate-100"
              onClick={() =>
                specFields.append({ specificationTitle: "", title: "", description: "", sortOrder: specFields.fields.length })
              }
              type="button"
            >
              <Plus className="size-4" />
              Add Spec Row
            </button>
          </section>
        </div>

        {/* ── Right sidebar ── */}
        <aside className="grid gap-6 self-start lg:sticky lg:top-6">
          <section className={cardCls}>
            <SectionTitle
              icon={<FileText className="size-5" />}
              title="Publishing"
              desc="Products publish immediately and are protected by admin-only Supabase RLS."
            />
            <div className="rounded-2xl bg-[#F4F4F4] p-4 text-sm text-admin-muted dark:bg-slate-800 dark:text-slate-400">
              <ImageIcon className="mb-2 size-5" />
              <p className="leading-6">
                Paste the SiteStripe <strong>Image</strong> code from Amazon Associates India to extract both the product image and your affiliate link in one click.
              </p>
            </div>
          </section>

          <section className={cardCls}>
            <h2 className="text-base font-black text-admin-ink dark:text-white">Checklist</h2>
            <ul className="mt-4 grid gap-2 text-sm text-admin-muted dark:text-slate-400">
              <li className="flex gap-2">✓ Name is short and searchable</li>
              <li className="flex gap-2">✓ Description is 1–3 sentences</li>
              <li className="flex gap-2">✓ Image extracted from SiteStripe</li>
              <li className="flex gap-2">✓ Affiliate URL points to amazon.in</li>
              <li className="flex gap-2">✓ At least 3–5 specs added</li>
              <li className="flex gap-2">✓ Slug is URL-safe and unique</li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Sticky save bar */}
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

function SectionTitle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="mb-5 flex gap-4 border-b border-admin-line pb-4 dark:border-slate-800">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F4F4] text-admin-muted dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-black text-admin-ink dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-admin-muted dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
