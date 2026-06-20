"use client";

import { Plus, Trash2, Brain, ShieldAlert, Users, ListChecks, Database } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  useFieldArray
} from "react-hook-form";
import {
  COMPLAINT_FREQUENCIES,
  COMPLAINT_SEVERITIES,
  EVIDENCE_SOURCE_TYPES
} from "@/lib/products/intelligence-text";
import type { ProductFormInput } from "@/lib/products/schema";

const inputCls = "admin-form-input";
const textareaCls = "admin-form-input admin-form-textarea";
const labelCls = "admin-form-label";
const errorCls = "admin-form-error";
const cardCls = "admin-form-card";
const hintCls = "admin-form-hint";

type Props = {
  register: UseFormRegister<ProductFormInput>;
  control: Control<ProductFormInput>;
  errors: FieldErrors<ProductFormInput>;
};

export function ProductIntelligenceFormSections({ register, control, errors }: Props) {
  const evidenceFields = useFieldArray({ control, name: "evidence" });
  const prosConsFields = useFieldArray({ control, name: "prosCons" });
  const complaintFields = useFieldArray({ control, name: "complaints" });
  const personaFields = useFieldArray({ control, name: "personas" });

  return (
    <>
      <section className={cardCls}>
        <SectionTitle
          desc="Six dimension scores, verdict, and narrative blocks shown on the product detail page."
          icon={<Brain className="size-5" />}
          step="6"
          title="Product Intelligence"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {(
            [
              ["performanceScore", "Performance"],
              ["reliabilityScore", "Reliability"],
              ["valueScore", "Value"],
              ["comfortScore", "Comfort"],
              ["maintenanceScore", "Maintenance"],
              ["trustScore", "Trust"]
            ] as const
          ).map(([name, label]) => (
            <label className={labelCls} key={name}>
              {label} (0–10)
              <input className={inputCls} step="0.1" type="number" {...register(name)} placeholder="8.4" />
            </label>
          ))}
          <label className={labelCls}>
            Confidence (0–10)
            <input className={inputCls} step="0.1" type="number" {...register("confidenceScore")} placeholder="8.4" />
          </label>
          <label className={labelCls}>
            Should buy
            <select className={inputCls} {...register("shouldBuy")}>
              <option value="buy">Should buy</option>
              <option value="conditional">Conditional</option>
              <option value="avoid">Avoid</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className={labelCls}>
            Why buy (one point per line)
            <textarea className={textareaCls} {...register("whyBuyText")} placeholder="Even cooking&#10;Low failure rate" />
          </label>
          <label className={labelCls}>
            Why avoid (one point per line)
            <textarea className={textareaCls} {...register("whyAvoidText")} placeholder="Coating wear over time" />
          </label>
          <label className={labelCls}>
            Best for (one point per line)
            <textarea className={textareaCls} {...register("bestForText")} placeholder="Small households" />
          </label>
          <label className={labelCls}>
            Not for (one point per line)
            <textarea className={textareaCls} {...register("notForText")} placeholder="Large families" />
          </label>
          <label className={`${labelCls} md:col-span-2`}>
            Long-term ownership summary
            <textarea className={textareaCls} {...register("longTermExperience")} placeholder="Owners at 12+ months report..." />
          </label>
          <label className={`${labelCls} md:col-span-2`}>
            Hidden issues (one per line)
            <textarea className={textareaCls} {...register("hiddenIssuesText")} placeholder="Pan latch loosens after heavy use" />
          </label>
        </div>
      </section>

      <section className={cardCls}>
        <SectionTitle
          desc="Sources behind the PickProof score — review counts optional."
          icon={<Database className="size-5" />}
          step="7"
          title="Evidence Sources"
        />
        <div className="grid gap-3">
          {evidenceFields.fields.map((field, index) => (
            <div className="admin-form-evidence-row" key={field.id}>
              <select className={inputCls} {...register(`evidence.${index}.sourceType`)}>
                {EVIDENCE_SOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <input className={inputCls} {...register(`evidence.${index}.sourceName`)} placeholder="Amazon.in verified reviews" />
              <input className={inputCls} type="number" {...register(`evidence.${index}.reviewCount`)} placeholder="Count" />
              <button
                className="admin-icon-btn admin-icon-btn--danger"
                onClick={() => evidenceFields.remove(index)}
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          className="admin-inline-action mt-4"
          onClick={() =>
            evidenceFields.append({
              sourceType: "amazon_reviews",
              sourceName: "",
              sourceUrl: "",
              notes: ""
            })
          }
          type="button"
        >
          <Plus className="size-4" />
          Add evidence source
        </button>
        {errors.evidence && <p className={errorCls}>Check evidence rows for missing fields.</p>}
      </section>

      <section className={cardCls}>
        <SectionTitle
          desc="Structured pros and cons for the detail page. If empty, key features are used as pros."
          icon={<ListChecks className="size-5" />}
          step="8"
          title="Pros & Cons"
        />
        <div className="grid gap-3">
          {prosConsFields.fields.map((field, index) => (
            <div className="admin-form-proscons-row" key={field.id}>
              <select className={inputCls} {...register(`prosCons.${index}.type`)}>
                <option value="pro">Pro</option>
                <option value="con">Con</option>
              </select>
              <input className={inputCls} {...register(`prosCons.${index}.content`)} placeholder="Even cooking" />
              <button
                className="admin-icon-btn admin-icon-btn--danger"
                onClick={() => prosConsFields.remove(index)}
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          className="admin-inline-action mt-4"
          onClick={() => prosConsFields.append({ type: "pro", content: "" })}
          type="button"
        >
          <Plus className="size-4" />
          Add pro or con
        </button>
      </section>

      <section className={cardCls}>
        <SectionTitle
          desc="Recurring complaints mined from reviews and forums."
          icon={<ShieldAlert className="size-5" />}
          step="9"
          title="Recurring Complaints"
        />
        <div className="grid gap-3">
          {complaintFields.fields.map((field, index) => (
            <div className="admin-form-complaint-row" key={field.id}>
              <input className={inputCls} {...register(`complaints.${index}.complaint`)} placeholder="Basket latch loosens" />
              <select className={inputCls} {...register(`complaints.${index}.frequency`)}>
                {COMPLAINT_FREQUENCIES.map((value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <select className={inputCls} {...register(`complaints.${index}.severity`)}>
                {COMPLAINT_SEVERITIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button
                className="admin-icon-btn admin-icon-btn--danger"
                onClick={() => complaintFields.remove(index)}
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          className="admin-inline-action mt-4"
          onClick={() =>
            complaintFields.append({ complaint: "", frequency: "occasional", severity: "moderate" })
          }
          type="button"
        >
          <Plus className="size-4" />
          Add complaint
        </button>
      </section>

      <section className={cardCls}>
        <SectionTitle
          desc="Who this product fits — persona fit scores for the detail page."
          icon={<Users className="size-5" />}
          step="10"
          title="Persona Scores"
        />
        <div className="grid gap-3">
          {personaFields.fields.map((field, index) => (
            <div className="admin-form-persona-row" key={field.id}>
              <input className={inputCls} {...register(`personas.${index}.persona`)} placeholder="Daily home cook" />
              <input className={inputCls} step="0.1" type="number" {...register(`personas.${index}.score`)} placeholder="9.1" />
              <input className={inputCls} {...register(`personas.${index}.reason`)} placeholder="Why it fits" />
              <button
                className="admin-icon-btn admin-icon-btn--danger"
                onClick={() => personaFields.remove(index)}
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          className="admin-inline-action mt-4"
          onClick={() => personaFields.append({ persona: "", reason: "" })}
          type="button"
        >
          <Plus className="size-4" />
          Add persona
        </button>
      </section>
    </>
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
