create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  category text not null,
  main_image_url text not null,
  global_score numeric(3, 1) not null check (global_score >= 0 and global_score <= 10),
  created_at timestamptz not null default now()
);

create table if not exists public.product_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  retailer_name text not null,
  affiliate_url text not null,
  price numeric(12, 2) not null check (price >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  spec_name text not null,
  spec_value text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  summary text not null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  editor_verdict text not null,
  created_at timestamptz not null default now()
);

create index if not exists product_links_product_id_idx on public.product_links(product_id);
create index if not exists product_specs_product_id_idx on public.product_specs(product_id);
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id);

alter table public.products enable row level security;
alter table public.product_links enable row level security;
alter table public.product_specs enable row level security;
alter table public.product_reviews enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Products are publicly readable'
  ) then
    create policy "Products are publicly readable"
      on public.products for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_links' and policyname = 'Product links are publicly readable'
  ) then
    create policy "Product links are publicly readable"
      on public.product_links for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_specs' and policyname = 'Product specs are publicly readable'
  ) then
    create policy "Product specs are publicly readable"
      on public.product_specs for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_reviews' and policyname = 'Product reviews are publicly readable'
  ) then
    create policy "Product reviews are publicly readable"
      on public.product_reviews for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Admins manage products'
  ) then
    create policy "Admins manage products"
      on public.products for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_links' and policyname = 'Admins manage product links'
  ) then
    create policy "Admins manage product links"
      on public.product_links for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_specs' and policyname = 'Admins manage product specs'
  ) then
    create policy "Admins manage product specs"
      on public.product_specs for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_reviews' and policyname = 'Admins manage product reviews'
  ) then
    create policy "Admins manage product reviews"
      on public.product_reviews for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;
