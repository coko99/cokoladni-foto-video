-- Storage politike za gallery-images bucket
-- Pokreni u Supabase SQL Editor (produkcija)

-- Javno čitanje slika (bucket je public)
drop policy if exists "public_read_gallery_images" on storage.objects;
create policy "public_read_gallery_images" on storage.objects
  for select to public
  using (bucket_id = 'gallery-images');

-- Admin upload / update / delete (authenticated)
drop policy if exists "admin_upload_gallery_images" on storage.objects;
create policy "admin_upload_gallery_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "admin_update_gallery_images" on storage.objects;
create policy "admin_update_gallery_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery-images')
  with check (bucket_id = 'gallery-images');

drop policy if exists "admin_delete_gallery_images" on storage.objects;
create policy "admin_delete_gallery_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery-images');

-- Server (service role) — backup za API rute
drop policy if exists "service_all_gallery_images" on storage.objects;
create policy "service_all_gallery_images" on storage.objects
  for all to service_role
  using (bucket_id = 'gallery-images')
  with check (bucket_id = 'gallery-images');
