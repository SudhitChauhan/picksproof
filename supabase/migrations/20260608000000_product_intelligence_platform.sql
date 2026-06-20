-- =====================================================================
-- PicksProof — Product Intelligence Platform
-- PostgreSQL schema (Supabase-ready)
--
-- Evolves the existing v2 schema (products + product_specifications)
-- into the intelligence platform model. Legacy columns on `products`
-- (main_image_url, amazon_affiliate_url, features, amazon_rating, etc.)
-- are retained for backward compatibility until the app is fully migrated.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 1. PRODUCTS — extend existing table
-- ---------------------------------------------------------------------
alter table public.products
  add column if not exists subcategory   text,
  add column if not exists model           text,
  add column if not exists price           numeric(10, 2),
  add column if not exists mrp             numeric(10, 2),
  add column if not exists image           text,
  add column if not exists affiliate_url   text,
  add column if not exists launch_date     date,
  add column if not exists updated_at      timestamptz not null default now();

-- Backfill intelligence-platform column names from legacy fields
update public.products
set
  model = coalesce(
    nullif(model, ''),
    nullif(model_number, ''),
    nullif(model_name, '')
  ),
  image = coalesce(nullif(image, ''), nullif(main_image_url, '')),
  affiliate_url = coalesce(nullif(affiliate_url, ''), nullif(amazon_affiliate_url, ''))
where
  model is null
  or image is null
  or affiliate_url is null;

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_brand on public.products (brand);
create index if not exists idx_products_slug on public.products (slug);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 2. PRODUCT ATTRIBUTES
--     Flexible spec table: "Battery" -> "32 hrs"
--     Migrated from product_specifications when present.
-- ---------------------------------------------------------------------
create table if not exists public.product_attributes (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  attribute_name  text not null,
  attribute_value text not null,
  attribute_type  text not null default 'text'
                  check (attribute_type in ('text', 'number', 'boolean', 'unit')),
  display_order   int not null default 0,
  attribute_group text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_attributes_product on public.product_attributes (product_id);

-- One-time migration from legacy product_specifications
insert into public.product_attributes (
  product_id,
  attribute_name,
  attribute_value,
  attribute_type,
  display_order,
  attribute_group
)
select
  ps.product_id,
  ps.title,
  ps.description,
  'text',
  ps.sort_order,
  nullif(ps.specification_title, '')
from public.product_specifications ps
where not exists (
  select 1
  from public.product_attributes pa
  where pa.product_id = ps.product_id
    and pa.attribute_name = ps.title
    and pa.attribute_value = ps.description
    and coalesce(pa.attribute_group, '') = coalesce(nullif(ps.specification_title, ''), '')
);

-- ---------------------------------------------------------------------
-- 3. PRODUCT INTELLIGENCE — one row per product (verdict layer)
-- ---------------------------------------------------------------------
create table if not exists public.product_intelligence (
  product_id            uuid primary key references public.products(id) on delete cascade,
  performance_score     numeric(3, 1) check (performance_score between 0 and 10),
  reliability_score     numeric(3, 1) check (reliability_score between 0 and 10),
  value_score           numeric(3, 1) check (value_score between 0 and 10),
  comfort_score         numeric(3, 1) check (comfort_score between 0 and 10),
  maintenance_score     numeric(3, 1) check (maintenance_score between 0 and 10),
  trust_score           numeric(3, 1) check (trust_score between 0 and 10),
  should_buy            text not null default 'conditional'
                        check (should_buy in ('buy', 'conditional', 'avoid')),
  why_buy               text,
  why_avoid             text,
  best_for              text,
  not_for               text,
  hidden_issues         text,
  long_term_experience  text,
  confidence_score      numeric(3, 1) check (confidence_score between 0 and 10),
  updated_at            timestamptz not null default now()
);

drop trigger if exists product_intelligence_set_updated_at on public.product_intelligence;
create trigger product_intelligence_set_updated_at
  before update on public.product_intelligence
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4. EVIDENCE — sources behind the intelligence score
-- ---------------------------------------------------------------------
create table if not exists public.evidence (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  source_type     text not null
                  check (source_type in (
                    'amazon_reviews',
                    'reddit',
                    'youtube',
                    'forum',
                    'expert_review',
                    'editorial',
                    'survey',
                    'other'
                  )),
  source_url      text,
  source_name     text not null,
  review_count    int,
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_evidence_product on public.evidence (product_id);

-- Seed Amazon review evidence from legacy amazon_review_count when available
insert into public.evidence (product_id, source_type, source_name, review_count)
select
  p.id,
  'amazon_reviews',
  'Amazon.in verified reviews',
  p.amazon_review_count
from public.products p
where p.amazon_review_count is not null
  and p.amazon_review_count > 0
  and not exists (
    select 1
    from public.evidence e
    where e.product_id = p.id
      and e.source_type = 'amazon_reviews'
  );

-- ---------------------------------------------------------------------
-- 5. PROS & CONS
-- ---------------------------------------------------------------------
create table if not exists public.pros_cons (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  type            text not null check (type in ('pro', 'con')),
  content         text not null,
  display_order   int not null default 0
);

create index if not exists idx_proscons_product on public.pros_cons (product_id);

-- Seed pros from legacy features array
insert into public.pros_cons (product_id, type, content, display_order)
select
  p.id,
  'pro',
  feature,
  ordinality - 1
from public.products p
cross join lateral unnest(coalesce(p.features, '{}'::text[])) with ordinality as feature(feature, ordinality)
where feature <> ''
  and not exists (
    select 1
    from public.pros_cons pc
    where pc.product_id = p.id
      and pc.type = 'pro'
      and pc.content = feature
  );

-- ---------------------------------------------------------------------
-- 6. COMPLAINTS — pattern-mined recurring issues
-- ---------------------------------------------------------------------
create table if not exists public.complaints (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  complaint       text not null,
  frequency       text not null
                  check (frequency in ('rare', 'occasional', 'common', 'very_common')),
  severity        text not null default 'moderate'
                  check (severity in ('minor', 'moderate', 'major', 'dealbreaker')),
  created_at      timestamptz not null default now()
);

create index if not exists idx_complaints_product on public.complaints (product_id);

-- ---------------------------------------------------------------------
-- 7. PERSONA SCORES — fit-for-use-case breakdown
-- ---------------------------------------------------------------------
create table if not exists public.persona_scores (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  persona         text not null,
  score           numeric(3, 1) check (score between 0 and 10),
  reason          text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_persona_product on public.persona_scores (product_id);

-- ---------------------------------------------------------------------
-- Row-level security (matches existing public-read / admin-write pattern)
-- ---------------------------------------------------------------------
alter table public.product_attributes    enable row level security;
alter table public.product_intelligence  enable row level security;
alter table public.evidence              enable row level security;
alter table public.pros_cons             enable row level security;
alter table public.complaints            enable row level security;
alter table public.persona_scores        enable row level security;

create policy "product_attributes_public_read"
  on public.product_attributes for select using (true);

create policy "product_attributes_admin_all"
  on public.product_attributes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "product_intelligence_public_read"
  on public.product_intelligence for select using (true);

create policy "product_intelligence_admin_all"
  on public.product_intelligence for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "evidence_public_read"
  on public.evidence for select using (true);

create policy "evidence_admin_all"
  on public.evidence for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "pros_cons_public_read"
  on public.pros_cons for select using (true);

create policy "pros_cons_admin_all"
  on public.pros_cons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "complaints_public_read"
  on public.complaints for select using (true);

create policy "complaints_admin_all"
  on public.complaints for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "persona_scores_public_read"
  on public.persona_scores for select using (true);

create policy "persona_scores_admin_all"
  on public.persona_scores for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Detail page view — product + intelligence in one row
-- ---------------------------------------------------------------------
create or replace view public.product_detail_view as
select
  p.id,
  p.name,
  p.brand,
  p.category,
  p.subcategory,
  coalesce(p.model, p.model_number, p.model_name) as model,
  p.price,
  p.mrp,
  coalesce(p.image, p.main_image_url)             as image,
  coalesce(p.affiliate_url, p.amazon_affiliate_url) as affiliate_url,
  p.warranty,
  p.launch_date,
  p.description,
  p.slug,
  p.created_at,
  p.updated_at,
  -- legacy fields kept for transitional reads
  p.main_image_url,
  p.amazon_affiliate_url,
  p.features,
  p.amazon_rating,
  p.amazon_review_count,
  p.asin,
  p.model_number,
  p.model_name,
  p.country_of_origin,
  p.bestseller_rank,
  p.bestseller_category,
  -- intelligence layer
  pi.performance_score,
  pi.reliability_score,
  pi.value_score,
  pi.comfort_score,
  pi.maintenance_score,
  pi.trust_score,
  pi.should_buy,
  pi.why_buy,
  pi.why_avoid,
  pi.best_for,
  pi.not_for,
  pi.hidden_issues,
  pi.long_term_experience,
  pi.confidence_score,
  pi.updated_at as intelligence_updated_at
from public.products p
left join public.product_intelligence pi on pi.product_id = p.id;

grant select on public.product_detail_view to anon, authenticated;
