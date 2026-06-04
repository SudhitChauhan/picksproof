-- Remap legacy category slugs to the five main hubs
update public.products
set category = 'electronics-tech'
where category in ('best-laptops', 'smartphones', 'electronics', 'audio');

update public.products
set category = 'home-kitchen'
where category = 'home';

update public.products
set category = 'health-fitness-sports'
where category = 'fitness';
