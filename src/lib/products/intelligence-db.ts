import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductFormValues } from "@/lib/products/schema";
import { productIntelligenceToDbRow } from "@/lib/products/db-map";

type Supabase = SupabaseClient;

export async function saveProductRelatedData(
  supabase: Supabase,
  productId: string,
  input: ProductFormValues
) {
  const cleaned: ProductFormValues = {
    ...input,
    evidence: input.evidence.filter((row) => row.sourceName.trim()),
    prosCons: input.prosCons.filter((row) => row.content.trim()),
    complaints: input.complaints.filter((row) => row.complaint.trim()),
    personas: input.personas.filter((row) => row.persona.trim()),
    specs: input.specs.filter((row) => row.title.trim() && row.description.trim())
  };

  await saveSpecifications(supabase, productId, cleaned);
  await saveIntelligence(supabase, productId, cleaned);
  await saveEvidence(supabase, productId, cleaned);
  await saveProsCons(supabase, productId, cleaned);
  await saveComplaints(supabase, productId, cleaned);
  await savePersonas(supabase, productId, cleaned);
}

async function saveSpecifications(supabase: Supabase, productId: string, input: ProductFormValues) {
  await supabase.from("product_specifications").delete().eq("product_id", productId);
  await supabase.from("product_attributes").delete().eq("product_id", productId);

  const specRows = input.specs.map((spec, i) => ({
    product_id: productId,
    specification_title: spec.specificationTitle,
    title: spec.title,
    description: spec.description,
    sort_order: i
  }));

  const attributeRows = input.specs.map((spec, i) => ({
    product_id: productId,
    attribute_name: spec.title,
    attribute_value: spec.description,
    attribute_type: "text",
    display_order: i,
    attribute_group: spec.specificationTitle || null
  }));

  if (specRows.length) {
    const { error: specError } = await supabase.from("product_specifications").insert(specRows);
    if (specError) throw new Error(`Specs could not be saved: ${specError.message}`);
  }

  if (attributeRows.length) {
    const { error: attrError } = await supabase.from("product_attributes").insert(attributeRows);
    if (attrError) throw new Error(`Attributes could not be saved: ${attrError.message}`);
  }
}

async function saveIntelligence(supabase: Supabase, productId: string, input: ProductFormValues) {
  const row = { product_id: productId, ...productIntelligenceToDbRow(input) };
  const { error } = await supabase.from("product_intelligence").upsert(row, { onConflict: "product_id" });
  if (error) throw new Error(`Intelligence could not be saved: ${error.message}`);
}

async function saveEvidence(supabase: Supabase, productId: string, input: ProductFormValues) {
  await supabase.from("evidence").delete().eq("product_id", productId);

  if (!input.evidence.length) return;

  const rows = input.evidence.map((item) => ({
    product_id: productId,
    source_type: item.sourceType,
    source_name: item.sourceName,
    source_url: item.sourceUrl?.trim() || null,
    review_count: item.reviewCount ?? null,
    notes: item.notes?.trim() || null
  }));

  const { error } = await supabase.from("evidence").insert(rows);
  if (error) throw new Error(`Evidence could not be saved: ${error.message}`);
}

async function saveProsCons(supabase: Supabase, productId: string, input: ProductFormValues) {
  await supabase.from("pros_cons").delete().eq("product_id", productId);

  const items =
    input.prosCons.length > 0
      ? input.prosCons
      : (input.features ?? []).map((content) => ({ type: "pro" as const, content }));

  if (!items.length) return;

  const rows = items.map((item, i) => ({
    product_id: productId,
    type: item.type,
    content: item.content,
    display_order: i
  }));

  const { error } = await supabase.from("pros_cons").insert(rows);
  if (error) throw new Error(`Pros & cons could not be saved: ${error.message}`);
}

async function saveComplaints(supabase: Supabase, productId: string, input: ProductFormValues) {
  await supabase.from("complaints").delete().eq("product_id", productId);

  if (!input.complaints.length) return;

  const rows = input.complaints.map((item) => ({
    product_id: productId,
    complaint: item.complaint,
    frequency: item.frequency,
    severity: item.severity
  }));

  const { error } = await supabase.from("complaints").insert(rows);
  if (error) throw new Error(`Complaints could not be saved: ${error.message}`);
}

async function savePersonas(supabase: Supabase, productId: string, input: ProductFormValues) {
  await supabase.from("persona_scores").delete().eq("product_id", productId);

  if (!input.personas.length) return;

  const rows = input.personas.map((item) => ({
    product_id: productId,
    persona: item.persona,
    score: item.score ?? null,
    reason: item.reason?.trim() || null
  }));

  const { error } = await supabase.from("persona_scores").insert(rows);
  if (error) throw new Error(`Persona scores could not be saved: ${error.message}`);
}

export async function loadProductFormRelations(supabase: Supabase, productId: string) {
  const [specsRes, intelligenceRes, evidenceRes, prosConsRes, complaintsRes, personasRes] =
    await Promise.all([
      supabase
        .from("product_attributes")
        .select("attribute_group, attribute_name, attribute_value, display_order")
        .eq("product_id", productId)
        .order("display_order", { ascending: true }),
      supabase.from("product_intelligence").select("*").eq("product_id", productId).maybeSingle(),
      supabase
        .from("evidence")
        .select("source_type, source_name, source_url, review_count, notes")
        .eq("product_id", productId)
        .order("created_at", { ascending: true }),
      supabase
        .from("pros_cons")
        .select("type, content, display_order")
        .eq("product_id", productId)
        .order("display_order", { ascending: true }),
      supabase
        .from("complaints")
        .select("complaint, frequency, severity")
        .eq("product_id", productId)
        .order("created_at", { ascending: true }),
      supabase
        .from("persona_scores")
        .select("persona, score, reason")
        .eq("product_id", productId)
        .order("created_at", { ascending: true })
    ]);

  let specs =
    (specsRes.data ?? []).map((row) => ({
      specification_title: row.attribute_group ?? "General",
      title: row.attribute_name,
      description: row.attribute_value,
      sort_order: row.display_order
    })) ?? [];

  if (!specs.length || specsRes.error) {
    const legacy = await supabase
      .from("product_specifications")
      .select("specification_title, title, description, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    specs = legacy.data ?? [];
  }

  return {
    specs,
    intelligence: intelligenceRes.data,
    evidence: evidenceRes.data ?? [],
    prosCons: prosConsRes.data ?? [],
    complaints: complaintsRes.data ?? [],
    personas: personasRes.data ?? []
  };
}
