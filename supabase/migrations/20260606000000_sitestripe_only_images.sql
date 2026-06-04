-- SiteStripe-only images: remove gallery column (scraper / manual gallery URLs)
alter table public.products drop column if exists gallery_image_urls;
