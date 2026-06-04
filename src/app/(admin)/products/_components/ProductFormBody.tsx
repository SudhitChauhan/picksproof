"use client";

import { useState } from "react";
import {
  FileJson,
  FileText,
  ImageIcon,
  Link2,
  Package,
  Plus,
  Settings2,
  Star,
  Trash2,
  Wand2
} from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  useFieldArray
} from "react-hook-form";
import { ProductImage } from "@/components/ProductImage";
import { amazonJsonToProductForm } from "@/lib/products/amazon-import";
import { categories } from "@/lib/data";
import type { ProductFormInput } from "@/lib/products/schema";
import { isValidSiteStripeImageUrl, parseSiteStripe } from "@/lib/products/sitestripe";

const inputCls =
  "mt-1.5 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-[#141413] focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
const textareaCls = `${inputCls} min-h-24 resize-y`;
const labelCls = "block text-sm font-bold text-admin-ink dark:text-slate-100";
const errorCls = "mt-1 text-xs font-bold text-red-600 dark:text-red-400";
const cardCls =
  "rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.07)] dark:border-slate-800 dark:bg-slate-900";

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Props = {
  register: UseFormRegister<ProductFormInput>;
  control: Control<ProductFormInput>;
  errors: FieldErrors<ProductFormInput>;
  setValue: UseFormSetValue<ProductFormInput>;
  watchedName: string;
  initialFeaturesText?: string;
  initialImagePreview?: string;
  onImportMessage?: (msg: string, type: "error" | "success") => void;
};

export function ProductFormBody({
  register,
  control,
  errors,
  setValue,
  watchedName,
  initialFeaturesText = "",
  initialImagePreview = "",
  onImportMessage
}: Props) {
  const [siteStripeHtml, setSiteStripeHtml] = useState("");
  const [imagePreview, setImagePreview] = useState(
    isValidSiteStripeImageUrl(initialImagePreview) ? initialImagePreview : ""
  );
  const [amazonJson, setAmazonJson] = useState("");

  const specFields = useFieldArray({ control, name: "specs" });
  const [featuresText, setFeaturesText] = useState(initialFeaturesText);

  function handleExtract() {
    const { imageUrl, affiliateUrl } = parseSiteStripe(siteStripeHtml);

    if (imageUrl) {
      setValue("mainImageUrl", imageUrl, { shouldValidate: true });
      setImagePreview(imageUrl);
    } else if (siteStripeHtml.trim()) {
      setValue("mainImageUrl", "", { shouldValidate: true });
      setImagePreview("");
      onImportMessage?.(
        "No valid SiteStripe image found. Use the Image widget in Associates — image must be from amazon-adsystem.com.",
        "error"
      );
    }

    if (affiliateUrl) {
      setValue("amazonAffiliateUrl", affiliateUrl, { shouldValidate: true });
    }

    if (!imageUrl && !affiliateUrl) {
      onImportMessage?.(
        "Could not extract from SiteStripe HTML. Paste the full Image embed code from Amazon Associates.",
        "error"
      );
    } else if (imageUrl) {
      onImportMessage?.("SiteStripe image and link extracted.", "success");
    }
  }

  function handleAmazonJsonImport() {
    try {
      const parsed = JSON.parse(amazonJson) as unknown;
      const mapped = amazonJsonToProductForm(parsed as Parameters<typeof amazonJsonToProductForm>[0]);

      (Object.entries(mapped) as [keyof ProductFormInput, ProductFormInput[keyof ProductFormInput]][]).forEach(
        ([key, value]) => {
          if (value === undefined || key === "mainImageUrl") return;
          setValue(key, value as never, { shouldValidate: key === "name" || key === "slug" });
        }
      );

      if (mapped.features?.length) {
        setFeaturesText(mapped.features.join("\n"));
      }

      onImportMessage?.(
        "JSON imported (no images). Paste SiteStripe HTML below for the product image, or save without one to use the site placeholder.",
        "success"
      );
    } catch {
      onImportMessage?.("Invalid JSON. Paste the full Apify/scraper product object.", "error");
    }
  }

  return (
    <div className="grid gap-6">
      <input type="hidden" {...register("mainImageUrl")} />

      <section className={cardCls}>
        <SectionTitle
          icon={<FileJson className="size-5" />}
          title="Import from Amazon JSON"
          desc="Fills name, brand, features, and specs only — not images. Use SiteStripe below for the product image."
        />
        <textarea
          className={`${textareaCls} min-h-40 font-mono text-xs`}
          onChange={(e) => setAmazonJson(e.target.value)}
          placeholder='{ "title": "...", "asin": "B0...", "features": [...] }'
          value={amazonJson}
        />
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-2.5 text-sm font-bold text-[#F3F0EE] transition hover:opacity-80"
          onClick={handleAmazonJsonImport}
          type="button"
        >
          <Wand2 className="size-4" />
          Import JSON
        </button>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Package className="size-5" />}
          title="Basic Info"
          desc="Shown on cards and the detail page."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelCls}>
            Product Name *
            <input className={inputCls} {...register("name")} placeholder="realme Buds T200 Lite" />
            {errors.name && <p className={errorCls}>{errors.name.message}</p>}
          </label>
          <label className={labelCls}>
            Brand
            <input className={inputCls} {...register("brand")} placeholder="realme" />
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
          <label className={labelCls}>
            ASIN
            <input className={inputCls} {...register("asin")} placeholder="B0DZCRYG7R" />
          </label>
          <div className="md:col-span-2">
            <label className={labelCls}>
              URL Slug *
              <div className="mt-1.5 flex gap-2">
                <input
                  className="flex-1 rounded-2xl border border-admin-line bg-white px-4 py-3 font-mono text-sm text-admin-ink outline-none transition focus:border-[#141413] focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  {...register("slug")}
                  placeholder="realme-buds-t200-lite"
                />
                <button
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-admin-line px-4 py-3 text-sm font-bold text-admin-muted transition hover:text-admin-ink dark:border-slate-700 dark:text-slate-400"
                  onClick={() => setValue("slug", toSlug(watchedName ?? ""), { shouldValidate: true })}
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
                placeholder="Short editorial summary — who this product is for."
              />
              {errors.description && <p className={errorCls}>{errors.description.message}</p>}
            </label>
          </div>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Star className="size-5" />}
          title="Trust & Compare Metadata"
          desc="Amazon rating is shown with an affiliate disclaimer — not a PickProof score."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelCls}>
            Amazon rating (0–5)
            <input className={inputCls} step="0.1" type="number" {...register("amazonRating")} placeholder="4.1" />
          </label>
          <label className={labelCls}>
            Amazon review count
            <input className={inputCls} type="number" {...register("amazonReviewCount")} placeholder="33114" />
          </label>
          <label className={labelCls}>
            Bestseller rank
            <input className={inputCls} type="number" {...register("bestsellerRank")} placeholder="26" />
          </label>
          <label className={labelCls}>
            Bestseller category
            <input className={inputCls} {...register("bestsellerCategory")} placeholder="In-Ear Headphones" />
          </label>
          <label className={labelCls}>
            Model number
            <input className={inputCls} {...register("modelNumber")} placeholder="RMA2415-A" />
          </label>
          <label className={labelCls}>
            Model name
            <input className={inputCls} {...register("modelName")} placeholder="BudsT" />
          </label>
          <label className={labelCls}>
            Warranty
            <input className={inputCls} {...register("warranty")} placeholder="1 Year Manufacturer Warranty" />
          </label>
          <label className={labelCls}>
            Country of origin
            <input className={inputCls} {...register("countryOfOrigin")} placeholder="China" />
          </label>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<FileText className="size-5" />}
          title="Key Features"
          desc="One feature per line — shown as bullets on the detail page."
        />
        <textarea
          className={`${textareaCls} min-h-36`}
          onChange={(e) => {
            setFeaturesText(e.target.value);
            const lines = e.target.value
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            setValue("features", lines, { shouldValidate: true });
          }}
          placeholder={"12.4mm Dynamic Bass Driver\n48 Hours Total Playback\nLow Latency"}
          value={featuresText}
        />
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Link2 className="size-5" />}
          title="Amazon affiliate link & SiteStripe image"
          desc="Affiliate URL is required. Paste SiteStripe Image HTML to extract the only allowed product image (amazon-adsystem.com)."
        />
        <label className={labelCls}>
          Amazon affiliate URL *
          <input
            className={inputCls}
            {...register("amazonAffiliateUrl")}
            placeholder="https://www.amazon.in/dp/ASIN?tag=yourtag-21"
          />
          {errors.amazonAffiliateUrl && <p className={errorCls}>{errors.amazonAffiliateUrl.message}</p>}
        </label>

        <label className={`${labelCls} mt-5 block`}>
          SiteStripe HTML (Image widget)
          <textarea
            className={`${textareaCls} min-h-32 font-mono text-xs`}
            onChange={(e) => setSiteStripeHtml(e.target.value)}
            placeholder='<a href="https://www.amazon.in/dp/...?tag=..."><img src="https://ws-in.amazon-adsystem.com/..." /></a>'
            value={siteStripeHtml}
          />
        </label>
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-2.5 text-sm font-bold text-[#F3F0EE]"
          onClick={handleExtract}
          type="button"
        >
          <Wand2 className="size-4" />
          Extract image & link
        </button>

        {errors.mainImageUrl && <p className={`${errorCls} mt-3`}>{errors.mainImageUrl.message}</p>}

        <div className="mt-5 flex items-center gap-4 rounded-3xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <ProductImage
            alt="Product preview"
            className="size-24 rounded-2xl object-contain"
            src={imagePreview || null}
          />
          <div className="text-sm text-admin-muted dark:text-slate-400">
            {imagePreview ? (
              <p>SiteStripe image ready. Save to store it.</p>
            ) : (
              <p>No SiteStripe image yet — the site placeholder will be used on publish.</p>
            )}
          </div>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Settings2 className="size-5" />}
          title="Product Specifications"
          desc="Grouped specs power the detail table and comparison views."
        />
        <div className="mb-3 hidden grid-cols-[1fr_1fr_1.2fr_auto] gap-3 md:grid">
          <span className="text-xs font-bold uppercase text-admin-muted">Group</span>
          <span className="text-xs font-bold uppercase text-admin-muted">Name</span>
          <span className="text-xs font-bold uppercase text-admin-muted">Value</span>
          <span />
        </div>
        <div className="grid gap-3">
          {specFields.fields.map((field, index) => (
            <div
              className="grid gap-3 rounded-2xl border border-admin-line bg-white p-4 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[1fr_1fr_1.2fr_auto]"
              key={field.id}
            >
              <input className={inputCls} {...register(`specs.${index}.specificationTitle`)} placeholder="Audio" />
              <input className={inputCls} {...register(`specs.${index}.title`)} placeholder="Driver Size" />
              <input className={inputCls} {...register(`specs.${index}.description`)} placeholder="12.4 mm" />
              <button
                className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-3 text-red-500 disabled:opacity-40"
                disabled={specFields.fields.length === 1}
                onClick={() => specFields.remove(index)}
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        {errors.specs?.root && <p className={errorCls}>{errors.specs.root.message}</p>}
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-admin-line px-5 py-2.5 text-sm font-bold"
          onClick={() =>
            specFields.append({
              specificationTitle: "",
              title: "",
              description: "",
              sortOrder: specFields.fields.length
            })
          }
          type="button"
        >
          <Plus className="size-4" />
          Add spec row
        </button>
      </section>

      <section className={cardCls}>
        <h2 className="text-base text-admin-ink dark:text-white">Checklist</h2>
        <ul className="mt-4 grid gap-2 text-sm text-admin-muted dark:text-slate-400">
          <li>✓ Affiliate URL uses your Associates tag</li>
          <li>✓ Image from SiteStripe only (or placeholder on site)</li>
          <li>✓ JSON import does not add Amazon CDN images</li>
        </ul>
        <div className="mt-4 rounded-2xl bg-[#F4F4F4] p-4 text-sm text-admin-muted dark:bg-slate-800">
          <ImageIcon className="mb-2 size-5" />
          <p>Gallery and scraper image URLs are not stored. Only amazon-adsystem.com from SiteStripe is allowed.</p>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="mb-5 flex gap-4 border-b border-admin-line pb-4 dark:border-slate-800">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F4F4] dark:bg-slate-800">
        {icon}
      </div>
      <div>
        <h2 className="text-lg text-admin-ink dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-admin-muted dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
