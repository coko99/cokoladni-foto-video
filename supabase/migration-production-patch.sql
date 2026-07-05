-- Pokreni u Supabase → SQL Editor (produkcija)
-- Bezbedno za višestruko pokretanje (IF NOT EXISTS)

-- Kolone za kreiranje albuma i hero sekciju
alter table public.galleries
  add column if not exists username text,
  add column if not exists access_code text,
  add column if not exists pin_plain text,
  add column if not exists hosts_info text,
  add column if not exists event_type text,
  add column if not exists event_date date,
  add column if not exists hero_image_id uuid references public.gallery_images(id) on delete set null;

-- Username indeks
create unique index if not exists idx_galleries_username
  on public.galleries(username) where username is not null;

-- Popuni access_code za stare albume
update public.galleries
set access_code = upper(substr(md5(random()::text), 1, 6))
where access_code is null;

-- Popuni username iz slug-a
update public.galleries
set username = slug
where username is null and slug is not null;

-- Ko je poslao izbor (majka, otac...)
alter table public.selections
  add column if not exists sender_relation text;

update public.selections
set sender_relation = coalesce(nullif(trim(client_name), ''), 'Drugo')
where sender_relation is null;

alter table public.selections
  alter column sender_relation set default 'Drugo';

-- Dozvoli duplikate slika u izboru
alter table public.selection_images
  drop constraint if exists selection_images_selection_id_image_id_key;

-- Service role politike (slanje izbora sa servera)
drop policy if exists "service_all_selections" on public.selections;
create policy "service_all_selections" on public.selections
  for all to service_role using (true) with check (true);

drop policy if exists "service_all_selection_images" on public.selection_images;
create policy "service_all_selection_images" on public.selection_images
  for all to service_role using (true) with check (true);

-- Osveži PostgREST schema cache (Supabase API)
notify pgrst, 'reload schema';

-- Storage: admin (prijavljeni korisnik) može uploadovati slike direktno u bucket
drop policy if exists "admin_upload_gallery_images" on storage.objects;
create policy "admin_upload_gallery_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "admin_update_gallery_images" on storage.objects;
create policy "admin_update_gallery_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "admin_delete_gallery_images" on storage.objects;
create policy "admin_delete_gallery_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery-images');
