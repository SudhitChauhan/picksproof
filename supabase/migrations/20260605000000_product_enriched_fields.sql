-- Enriched product fields for comparison, trust signals, and Amazon JSON import
-- Excludes: price, seller, customer review text, delivery/stock (policy + stale data)

alter table public.products
  add column if not exists asin                  text,
  add column if not exists brand                 text not null default '',
  add column if not exists features              text[] not null default '{}',
  add column if not exists amazon_rating         numeric(2, 1),
  add column if not exists amazon_review_count   integer,
  add column if not exists bestseller_rank       integer,
  add column if not exists bestseller_category   text not null default '',
  add column if not exists model_number          text not null default '',
  add column if not exists model_name            text not null default '',
  add column if not exists warranty              text not null default '',
  add column if not exists country_of_origin     text not null default '';

create index if not exists products_asin_idx on public.products(asin) where asin is not null;
create index if not exists products_brand_idx on public.products(brand) where brand <> '';
