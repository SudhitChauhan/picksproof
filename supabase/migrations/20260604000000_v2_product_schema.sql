-- V2 schema: simplified products, 3-field specs, user profiles + trigger
-- Drop old tables (cascade removes dependent policies/indexes)
drop table if exists public.product_reviews cascade;
drop table if exists public.product_links cascade;
drop table if exists public.product_specs cascade;
drop table if exists public.product_specifications cascade;
drop table if exists public.user_profiles cascade;
drop table if exists public.products cascade;

drop function if exists public.handle_new_user cascade;

-- is_admin helper (idempotent)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- ─── Products ────────────────────────────────────────────────────────────────
create table public.products (
  id                    uuid        primary key default gen_random_uuid(),
  name                  text        not null,
  description           text        not null default '',
  category              text        not null,
  slug                  text        not null unique,
  main_image_url        text        not null default '',
  amazon_affiliate_url  text        not null default '',
  created_at            timestamptz not null default now()
);

-- ─── Product Specifications ───────────────────────────────────────────────────
-- Each row is one spec item. Multiple rows can share the same specification_title
-- (they form a visual group on the detail page).
create table public.product_specifications (
  id                   uuid        primary key default gen_random_uuid(),
  product_id           uuid        not null references public.products(id) on delete cascade,
  specification_title  text        not null default '',   -- group heading e.g. "Display"
  title                text        not null,              -- spec name e.g. "Screen Size"
  description          text        not null,              -- spec value e.g. "15.6 inches"
  sort_order           int         not null default 0,
  created_at           timestamptz not null default now()
);

-- ─── User Profiles ────────────────────────────────────────────────────────────
create table public.user_profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null default '',
  email       text        not null default '',
  created_at  timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index products_category_idx         on public.products(category);
create index products_created_at_idx       on public.products(created_at desc);
create index product_spec_product_id_idx   on public.product_specifications(product_id, sort_order);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
alter table public.products               enable row level security;
alter table public.product_specifications enable row level security;
alter table public.user_profiles          enable row level security;

-- Products: anyone can read; only admins can write
create policy "products_public_read"
  on public.products for select using (true);

create policy "products_admin_all"
  on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Specs: same as products
create policy "specs_public_read"
  on public.product_specifications for select using (true);

create policy "specs_admin_all"
  on public.product_specifications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- User profiles: own row only; admins can read all
create policy "profiles_own_read"
  on public.user_profiles for select to authenticated
  using (auth.uid() = id);

create policy "profiles_own_insert"
  on public.user_profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "profiles_own_update"
  on public.user_profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_read"
  on public.user_profiles for select to authenticated
  using (public.is_admin());

-- ─── Trigger: auto-create profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
