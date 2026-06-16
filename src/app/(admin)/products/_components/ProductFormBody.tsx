"use client";

import { useEffect, useState } from "react";
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
  Upload,
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
import { uploadProductImageToCloudinary } from "@/lib/cloudinary/client-upload";
import { isCloudinaryImageUrl } from "@/lib/cloudinary/urls";
import { amazonJsonToProductForm, parseAmazonJsonInput } from "@/lib/products/amazon-import";
import { categories } from "@/lib/data";
import type { ProductFormInput } from "@/lib/products/schema";
import { isValidHttpsImageUrl, parseSiteStripe, sanitizeRemoteImageUrl } from "@/lib/products/sitestripe";

const inputCls = "admin-form-input";
const textareaCls = "admin-form-input admin-form-textarea";
const labelCls = "admin-form-label";
const errorCls = "admin-form-error";
const cardCls = "admin-form-card";
const hintCls = "admin-form-hint";

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
  watchedImageUrl?: string;
  initialFeaturesText?: string;
  initialImagePreview?: string;
  mode?: "create" | "edit";
  onImportMessage?: (msg: string, type: "error" | "success") => void;
  onBulkImport?: (jsonText: string) => Promise<void>;
};

export function ProductFormBody({
  register,
  control,
  errors,
  setValue,
  watchedName,
  watchedImageUrl = "",
  initialFeaturesText = "",
  initialImagePreview = "",
  mode = "create",
  onImportMessage,
  onBulkImport
}: Props) {
  const [siteStripeHtml, setSiteStripeHtml] = useState("");
  const [amazonJson, setAmazonJson] = useState("");
  const [parsedCount, setParsedCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(
    sanitizeRemoteImageUrl(initialImagePreview) || initialImagePreview.trim() || ""
  );
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);

  const specFields = useFieldArray({ control, name: "specs" });
  const [featuresText, setFeaturesText] = useState(initialFeaturesText);

  useEffect(() => {
    const clean = watchedImageUrl.trim();
    if (clean) {
      setImagePreview(clean);
      if (!isCloudinaryImageUrl(clean)) {
        setPendingImageUrl(clean);
      } else {
        setPendingImageUrl("");
      }
    }
  }, [watchedImageUrl]);

  useEffect(() => {
    setParsedCount(parseAmazonJsonInput(amazonJson).length);
  }, [amazonJson]);

  function applyMappedProduct(mapped: ReturnType<typeof amazonJsonToProductForm>, message: string) {
    (Object.entries(mapped) as [keyof ProductFormInput, ProductFormInput[keyof ProductFormInput]][]).forEach(
      ([key, value]) => {
        if (value === undefined || key === "mainImageUrl") return;
        setValue(key, value as never, { shouldValidate: key === "name" || key === "slug" });
      }
    );

    if (mapped.features?.length) {
      setFeaturesText(mapped.features.join("\n"));
    }

    onImportMessage?.(message, "success");
  }

  async function uploadImageSource(source: { file?: File; url?: string }) {
    setImageUploading(true);

    try {
      const result = await uploadProductImageToCloudinary(source);

      if (!result.ok) {
        onImportMessage?.(result.message, "error");
        return false;
      }

      setValue("mainImageUrl", result.url, { shouldValidate: true });
      setImagePreview(result.url);
      setPendingImageUrl("");
      onImportMessage?.("Image saved to Cloudinary.", "success");
      return true;
    } finally {
      setImageUploading(false);
    }
  }

  async function handleExtract() {
    const { imageUrl, affiliateUrl } = parseSiteStripe(siteStripeHtml);

    if (imageUrl) {
      setPendingImageUrl(imageUrl);
      setImagePreview(imageUrl);
      await uploadImageSource({ url: imageUrl });
    } else if (siteStripeHtml.trim()) {
      setValue("mainImageUrl", "", { shouldValidate: true });
      setImagePreview("");
      setPendingImageUrl("");
      onImportMessage?.(
        "No image found in the embed code. Paste SiteStripe HTML with an image, or upload a file below.",
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
    } else if (affiliateUrl && !imageUrl) {
      onImportMessage?.("Affiliate link extracted. Add an image URL or upload a file.", "success");
    }
  }

  function handleImageUrlChange(url: string) {
    const clean = sanitizeRemoteImageUrl(url);
    setPendingImageUrl(clean || url.trim());
    setValue("mainImageUrl", clean || url.trim(), { shouldValidate: true });
    setImagePreview(clean || url.trim());
  }

  async function handleSaveImageToCloudinary() {
    const source = pendingImageUrl.trim() || watchedImageUrl.trim();
    if (!source) {
      onImportMessage?.("Enter an image URL or choose a file first.", "error");
      return;
    }

    if (isCloudinaryImageUrl(source)) {
      onImportMessage?.("This image is already hosted on Cloudinary.", "success");
      return;
    }

    if (!isValidHttpsImageUrl(source)) {
      onImportMessage?.("Image URL must start with https://", "error");
      return;
    }

    await uploadImageSource({ url: source });
  }

  async function handleImageFileChange(file: File | null) {
    if (!file) return;
    await uploadImageSource({ file });
  }

  function handleAmazonJsonImport() {
    const items = parseAmazonJsonInput(amazonJson);
    if (!items.length) {
      onImportMessage?.(
        "No valid JSON found. Paste one object, an array like [{...}, {...}], or multiple objects separated by blank lines.",
        "error"
      );
      return;
    }

    applyMappedProduct(
      amazonJsonToProductForm(items[0]),
      items.length > 1
        ? `Imported first of ${items.length} products into the form. Use “Import all” to publish every valid item.`
        : "JSON imported into the form. Add an image URL, upload a file, or extract from SiteStripe HTML."
    );
  }

  async function handleBulkImport() {
    if (!onBulkImport || !amazonJson.trim()) return;
    setBulkImporting(true);
    try {
      await onBulkImport(amazonJson);
    } finally {
      setBulkImporting(false);
    }
  }

  return (
    <div className="admin-form-sections">
      <section className={cardCls}>
        <SectionTitle
          icon={<FileJson className="size-5" />}
          step="1"
          title="Import from Amazon JSON"
          desc="Paste one product, an array of products, or multiple objects separated by blank lines."
        />
        <textarea
          className={`${textareaCls} min-h-44 font-mono text-xs`}
          onChange={(e) => setAmazonJson(e.target.value)}
          placeholder={`[\n  { "title": "Product A", "asin": "B0...", "url": "https://...", "features": [] },\n  { "title": "Product B", ... }\n]`}
          value={amazonJson}
        />
        <div className="admin-form-actions-row">
          <button className="btn-primary" onClick={handleAmazonJsonImport} type="button">
            <Wand2 className="size-4" />
            Fill form from first item
          </button>
          {mode === "create" && onBulkImport ? (
            <button
              className="admin-form-secondary-btn"
              disabled={bulkImporting || parsedCount === 0}
              onClick={handleBulkImport}
              type="button"
            >
              <Upload className="size-4" />
              {bulkImporting ? "Importing…" : `Import all${parsedCount ? ` (${parsedCount})` : ""}`}
            </button>
          ) : null}
        </div>
        {parsedCount > 0 ? (
          <p className={hintCls}>
            Detected {parsedCount} product{parsedCount === 1 ? "" : "s"} in JSON.
            {parsedCount > 1 && mode === "create"
              ? " “Import all” creates every valid product and sends you to the catalogue."
              : null}
          </p>
        ) : null}
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Package className="size-5" />}
          step="2"
          title="Basic Info"
          desc="Shown on product cards, category pages, and the review detail page."
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
              <div className="admin-form-slug-row">
                <input
                  className="admin-form-input admin-form-input--mono flex-1"
                  {...register("slug")}
                  placeholder="realme-buds-t200-lite"
                />
                <button
                  className="admin-form-secondary-btn"
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
                placeholder="Short editorial summary — who this product is for and why it stands out."
              />
              {errors.description && <p className={errorCls}>{errors.description.message}</p>}
            </label>
          </div>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<ImageIcon className="size-5" />}
          step="3"
          title="Product Image"
          desc="Paste an image URL, upload a file, or extract from SiteStripe HTML. Images are stored on Cloudinary."
        />
        <label className={labelCls}>
          Image URL
          <input
            className={`${inputCls} font-mono text-xs`}
            disabled={imageUploading}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://ws-in.amazon-adsystem.com/widgets/q?... or any https image link"
            value={watchedImageUrl}
          />
          {errors.mainImageUrl && <p className={errorCls}>{errors.mainImageUrl.message}</p>}
          <p className={hintCls}>
            Paste a remote image link, then click Save to Cloudinary. Leave empty to use the site placeholder.
          </p>
        </label>

        <div className="admin-form-actions-row mt-4">
          <label className="admin-form-secondary-btn cursor-pointer">
            <Upload className="size-4" />
            {imageUploading ? "Uploading…" : "Upload image file"}
            <input
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              disabled={imageUploading}
              onChange={(e) => void handleImageFileChange(e.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <button
            className="btn-primary"
            disabled={
              imageUploading ||
              !pendingImageUrl.trim() ||
              isCloudinaryImageUrl(pendingImageUrl) ||
              !isValidHttpsImageUrl(pendingImageUrl)
            }
            onClick={() => void handleSaveImageToCloudinary()}
            type="button"
          >
            <Upload className="size-4" />
            {imageUploading ? "Saving…" : "Save to Cloudinary"}
          </button>
        </div>

        <label className={`${labelCls} mt-5 block`}>
          Or paste SiteStripe HTML
          <textarea
            className={`${textareaCls} min-h-28 font-mono text-xs`}
            disabled={imageUploading}
            onChange={(e) => setSiteStripeHtml(e.target.value)}
            placeholder='<a href="https://www.amazon.in/dp/...?tag=..."><img src="https://ws-in.amazon-adsystem.com/..." /></a>'
            value={siteStripeHtml}
          />
        </label>
        <button
          className="btn-primary mt-3"
          disabled={imageUploading}
          onClick={() => void handleExtract()}
          type="button"
        >
          <Wand2 className="size-4" />
          Extract image &amp; affiliate link
        </button>

        <div className="admin-form-preview mt-5">
          <ProductImage
            alt="Product preview"
            className="size-28 rounded-2xl object-contain bg-bone"
            src={imagePreview || null}
          />
          <div className="text-sm text-slate">
            {imagePreview && isCloudinaryImageUrl(imagePreview) ? (
              <p>Image is on Cloudinary and will appear on cards and the review page after saving.</p>
            ) : imagePreview && isValidHttpsImageUrl(imagePreview) ? (
              <p>Preview loaded. Click “Save to Cloudinary” before publishing, or it will upload automatically when you save the product.</p>
            ) : (
              <p>No image yet — the catalogue placeholder will be used until you add one.</p>
            )}
          </div>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Link2 className="size-5" />}
          step="4"
          title="Amazon Affiliate Link"
          desc="Required for every product. Must include your Associates tag."
        />
        <label className={labelCls}>
          Affiliate URL *
          <input
            className={inputCls}
            {...register("amazonAffiliateUrl")}
            placeholder="https://www.amazon.in/dp/ASIN?tag=yourtag-21"
          />
          {errors.amazonAffiliateUrl && <p className={errorCls}>{errors.amazonAffiliateUrl.message}</p>}
        </label>
      </section>

      <section className={cardCls}>
        <SectionTitle
          icon={<Star className="size-5" />}
          step="5"
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
          step="6"
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
          icon={<Settings2 className="size-5" />}
          step="7"
          title="Product Specifications"
          desc="Grouped specs power the detail table and comparison views."
        />
        <div className="mb-3 hidden grid-cols-[1fr_1fr_1.2fr_auto] gap-3 md:grid">
          <span className="admin-form-table-head">Group</span>
          <span className="admin-form-table-head">Name</span>
          <span className="admin-form-table-head">Value</span>
          <span />
        </div>
        <div className="grid gap-3">
          {specFields.fields.map((field, index) => (
            <div className="admin-form-spec-row" key={field.id}>
              <input className={inputCls} {...register(`specs.${index}.specificationTitle`)} placeholder="Audio" />
              <input className={inputCls} {...register(`specs.${index}.title`)} placeholder="Driver Size" />
              <input className={inputCls} {...register(`specs.${index}.description`)} placeholder="12.4 mm" />
              <button
                className="admin-icon-btn admin-icon-btn--danger"
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
          className="admin-inline-action mt-4"
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
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  desc,
  step
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  step: string;
}) {
  return (
    <div className="admin-form-section-title">
      <div className="admin-form-section-icon">{icon}</div>
      <div>
        <p className="admin-form-step">Step {step}</p>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
}
